# ADR-002 — Arquitetura de Tracking (Pixels + UTMify S2S)

**Status:** Implementado e auditado  
**Data:** Junho 2026  
**Autores:** Rafael + Claude

---

## Contexto

O projeto precisava de tagueamento de qualidade máxima para Meta, TikTok e Google Ads, com:
- Conformidade com LGPD (não carregar pixels sem consentimento)
- Tracking server-side para reduzir perda por bloqueadores de anúncio
- Taxa GBP→BRL dinâmica (não hardcoded) para reportar valores corretos em BRL
- Múltiplos pixels UTMify, um por plataforma (Meta, TikTok, Google)

## Decisão

### Camada 1 — Consentimento (LGPD)
O banner LGPD (`components/LgpdBanner.tsx`) grava em `localStorage`:
- `nm_cookie_consent = "all"` → todos os pixels carregam
- `nm_cookie_consent = "essential"` → apenas UTMify script (interesse legítimo)

O `CustomEvent("nm_consent_changed")` notifica `ConsentScripts.tsx` em runtime.

### Camada 2 — Config Global (window.__NM_CONFIG__)
O `app/layout.tsx` lê `StoreSettings` do BD via `unstable_cache` (TTL 1h, tag `store-settings`) e injeta no HTML antes do React:
```javascript
window.__NM_CONFIG__ = {
  gbpToBrlRate: 7.52,
  metaPixelId: "636389112021100",
  tiktokPixelId: "D4LDB1RC77UDM7TK2810"
}
```
Fallback: env vars → valores hardcoded.

### Camada 3 — Pixels nativos (client-side, consent-gated)
`components/ConsentScripts.tsx` injecta dinamicamente Meta Pixel, TikTok Pixel e Google Tag **apenas** após `consent = "all"`. Usa deduplicação via `if (!(window as any).fbq)`.

`components/PixelTracker.tsx` dispara PageView em cada mudança de rota (usa `usePathname`).

### Camada 4 — Eventos de e-commerce (client-side)
`lib/tracking.ts` exporta:
- `trackViewProduct()` → Meta `ViewContent`, TikTok `ViewContent`
- `trackAddToCart()` → Meta `AddToCart`, TikTok `AddToCart`
- `trackBeginCheckout()` → Meta `InitiateCheckout`, TikTok `InitiateCheckout` + `fbq('init', pixelId, {em, ph})` para advanced matching
- `trackPurchase()` → Meta `Purchase`, TikTok `CompletePayment` + identity update
- `trackUtmfyPurchase()` → UTMify browser pixel (separado para evitar duplo disparo)

### Camada 5 — UTMify S2S (server-side, sem bloqueadores)
`lib/utmfy.ts` — `sendToAllUtmfyPixels(data, apiKeys[])` dispara em paralelo para `utmifyMetaApiKey`, `utmifyTiktokApiKey`, `utmifyGoogleApiKey`.

Endpoints S2S:
- `app/api/payment/track-ic/route.ts` — Initiate Checkout (dispara cedo, quando cliente preenche email/phone)
- `app/api/payment/track-purchase/route.ts` — Purchase (dispara na página /success após Stripe confirmar)

### Camada 6 — Taxa GBP→BRL
- Lida em runtime de `window.__NM_CONFIG__.gbpToBrlRate` no cliente
- Lida do BD (`storeSettings.gbpToBrlRate`) nas rotas S2S
- Sincronizada via Stripe em `/admin/settings` → botão "Sync Stripe" chama `syncGbpToBrlRate()` em `lib/actions.ts`

---

## Fluxo Completo de uma Compra

```
1. Usuário abre produto
   └─ trackViewProduct() → Meta ViewContent, TikTok ViewContent

2. Usuário adiciona ao carrinho
   └─ trackAddToCart() → Meta AddToCart, TikTok AddToCart

3. Usuário chega no checkout e preenche email/phone (onBlur)
   ├─ ttq.identify({ email, phone_number })        [TikTok identity]
   ├─ trackBeginCheckout()
   │     ├─ fbq('init', pixelId, { em, ph })       [Meta advanced matching]
   │     ├─ Meta: InitiateCheckout
   │     ├─ TikTok: InitiateCheckout
   │     └─ UTMify browser: initiate_checkout
   └─ POST /api/payment/track-ic [S2S]
         customer: { name, email, phone, country, state, city, postcode, address, complement }
         trackingParameters: { utmify_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term }

4. Usuário clica "Pay Now"
   ├─ POST /api/orders  → cria pedido no BD
   └─ POST /api/payment/update-metadata → Stripe metadata com endereço + UTMs completos

5. Stripe redireciona para /success?payment_intent=pi_xxx
   ├─ POST /api/payment/track-purchase [S2S]
   │     Lê endereço/UTMs do Stripe metadata
   │     Dispara UTMify S2S para todos os pixels configurados
   ├─ trackPurchase()
   │     ├─ fbq('init', pixelId, { em, ph }) + Meta Purchase
   │     └─ ttq.identify() + TikTok CompletePayment
   └─ trackUtmfyPurchase()
         UTMify browser pixel (único disparo, com valor BRL real da API)
```

---

## Admin Settings

`/admin/settings` → `components/admin/SettingsForm.tsx`

Cada plataforma tem:
- **Pixel nativo** (ID para o script client-side)
- **UTMify API Key** (chave S2S por plataforma)

Status badge automático: Configurado / Parcial / Não configurado.

Salvar chama `saveStoreSettings()` (Server Action) que faz `prisma.storeSettings.upsert` e `revalidateTag("store-settings")`.

---

## Bugs Corrigidos no Audit (15/06/2026)

| # | Bug | Arquivo |
|---|-----|---------|
| 1 | Endereço nunca chegava no IC S2S | `CheckoutForm.tsx` |
| 2 | Stripe metadata sem endereço/UTMs completos | `CheckoutForm.tsx` |
| 3 | UTMify browser disparava 2x na compra (`trackPurchase` + `trackUtmfyPurchase`) | `lib/tracking.ts` |
| 4 | `ttq.identify()` nunca chamado | `CheckoutForm.tsx` + `lib/tracking.ts` |
| 5 | Meta sem advanced matching no momento dos eventos | `lib/tracking.ts` |
| 6 | Campo `complement` ausente no UTMify S2S | `track-ic/route.ts` + `track-purchase/route.ts` |

---

## Pendência Restante

- `prisma generate` precisa rodar após parar o servidor (arquivo DLL bloqueado)
- Remover casts `(prisma as any).storeSettings` após gerar o cliente
