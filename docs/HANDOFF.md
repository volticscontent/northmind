# North Mind — Handoff Document
**Data:** 15 de junho de 2026  
**Para:** Nathan Junior (ou próxima sessão de desenvolvimento)  
**Estado:** Em produção parcial — funciona mas há pendências críticas listadas abaixo

---

## Stack e Infra

| Item | Valor |
|------|-------|
| Framework | Next.js 14 App Router |
| Banco | PostgreSQL via Prisma ORM |
| Host BD | `easypanel.landcriativa.com:9000` |
| Pagamentos | Stripe (API version `2023-10-16`) |
| Storage de mídia | Cloudflare R2 |
| Auth | NextAuth.js v4 |
| Schemas Prisma | `admin` (usuários/pedidos/configurações) + `public` (produtos/coleções) |

---

## O Que Foi Feito (Histórico Consolidado)

### Fase 1 — Migração para Monolito
O projeto tinha um backend Express separado em porta 3001 que causava `ECONNREFUSED` constantemente. Foi migrado para um monolito puro Next.js App Router:
- Todas as rotas do Express foram convertidas para Route Handlers em `app/api/`
- Acesso ao banco agora é via Server Actions (`lib/actions.ts`) e Route Handlers
- `API_URL` (`localhost:3001`) foi eliminada (ainda existe em alguns componentes — ver pendências)

### Fase 2 — Performance
- Streaming com Suspense na home page
- Reviews carregadas server-side em `app/product/[handle]/page.tsx`
- Search usando Server Action (`lib/search-actions.ts`)
- Skeletons durante carregamento progressivo

### Fase 3 — Design System
- Cards de produto com design premium/dark
- Hero mobile com aspecto cinematográfico
- Layout de políticas legais (`PolicyLayout`)

### Fase 4 — Legal & Compliance
Páginas em `/terms`, `/refund`, `/privacy`, `/cookies`, `/warranty` com textos DDU, EU Right of Withdrawal, GDPR, CCPA.

### Fase 5 — Admin Panel (auditado e reescrito)
- **Dashboard** (`/admin`) — métricas reais: revenue filtrando só PAGO/ENVIADO/ENTREGUE, pedidos recentes
- **Collections** (`/admin/collections`) — CRUD completo com toast + modal de confirmação; badge "X Pieces" funcional
- **Products** (`/admin/products`) — CRUD completo com upload de mídia
- **Orders** (`/admin/orders`) — lista com troca de status; falta drawer de detalhe
- **Reviews** (`/admin/reviews`) — moderação com toast + confirm
- **Settings** (`/admin/settings`) — painel de tracking (ver Fase 6)
- Sidebar com ícone de Settings adicionado

### Fase 6 — Sistema de Tracking (DB-managed)
Todo o tracking foi redesenhado. Pixels e chaves de API saíram das env vars e vão para o banco.

**Modelo `StoreSettings` no Prisma (schema `admin`):**
```prisma
model StoreSettings {
  id                 String   @id @default("singleton")
  metaPixelId        String?
  tiktokPixelId      String?
  googleTagId        String?
  utmifyPixelId      String?
  utmifyMetaApiKey   String?
  utmifyTiktokApiKey String?
  utmifyGoogleApiKey String?
  gbpToBrlRate       Float    @default(7.4)
  trackingMode       String   @default("production")
  updatedAt          DateTime @updatedAt
  @@schema("admin")
}
```

**Arquivos chave:**
- `app/layout.tsx` — lê config do BD via `unstable_cache` (tag: `store-settings`, TTL 1h); injeta `window.__NM_CONFIG__`
- `components/ConsentScripts.tsx` — carrega Meta/TikTok/Google só após consent LGPD
- `components/LgpdBanner.tsx` — banner LGPD com `localStorage.setItem("nm_cookie_consent", "all"|"essential")`
- `components/PixelTracker.tsx` — dispara PageView em cada mudança de rota
- `lib/tracking.ts` — funções client-side: `trackViewProduct`, `trackAddToCart`, `trackBeginCheckout`, `trackPurchase`, `trackUtmfyPurchase`
- `lib/utmfy.ts` — `sendToAllUtmfyPixels()` dispara S2S para todos os pixels UTMify em paralelo
- `app/api/payment/track-ic/route.ts` — S2S para UTMify no Initiate Checkout
- `app/api/payment/track-purchase/route.ts` — S2S para UTMify na compra confirmada
- `lib/actions.ts` — `getStoreSettings()`, `saveStoreSettings()`, `syncGbpToBrlRate()` (taxa via Stripe)

**Tracking audit (último trabalho desta sessão):**
Foram corrigidos 6 bugs críticos — ver `docs/adr/ADR-002-tracking-architecture.md` para detalhes.

---

## Pendências Críticas (Bloqueantes)

### P1 — `prisma generate` precisa rodar
O modelo `StoreSettings` foi adicionado ao schema mas o cliente Prisma não foi regenerado (o dev server estava rodando, bloqueando o arquivo DLL). Consequência: o código usa `(prisma as any).storeSettings` em vários lugares. Depois de parar o servidor:
```bash
npx prisma generate
npx prisma db push
```
Depois remover os casts `as any`.

### P2 — Express routes ainda não migradas
Estes endpoints ainda apontam para `API_URL` (Express morto):
1. `POST /api/auth/register` — cadastro de usuário
2. `POST /api/auth/set-password` — definir senha pós-compra
3. `GET /api/admin/customer/:email` — buscar cliente no admin
4. `GET /api/admin/verify-order/:orderId/:userId` — verificar pedido
5. `POST /api/orders` — **CRÍTICO**: cria o pedido no BD; precisa incluir campos de endereço
6. `GET /api/products/admin/:id` — preview de produto no admin

### P3 — Componentes ainda usando `API_URL` (fetch para Express morto)
1. `app/checkout/page.tsx` → URL de create-intent
2. `components/CheckoutForm.tsx` → 4 referências de URL de pagamento (IC, track-purchase, orders, update-metadata)
3. `app/success/page.tsx` → `/api/payment/track-purchase`
4. `components/admin/MediaUpload.tsx` → `/api/upload`

### P4 — Campos de endereço não salvos no modelo `Pedido`
O checkout coleta `address`, `city`, `postcode`, `county`, `country`, `complement` mas o model `Pedido` no Prisma não tem esses campos. A route `/api/orders` que cria o pedido precisa ser migrada (P2) e o model precisa ser expandido.

---

## Pendências Não-Críticas

- **Drawer de detalhes do pedido** em `/admin/orders` (abrir pedido completo com itens, endereço, histórico de status)
- **Página de Analytics** em `/admin/analytics` (receita por dia, top produtos, funil de conversão)
- **Imagens reais** — muitos produtos apontam para placeholders

---

## Como Rodar Localmente

```bash
cd D:\Códigos\Rafa\Nathan\northmind
npm run dev
```

Admin: `/admin` (credenciais no BD, tipo `ADMIN`)  
Loja: `/`  
Settings de tracking: `/admin/settings`

---

## Variáveis de Ambiente Necessárias

```env
DATABASE_URL=postgresql://...@easypanel.landcriativa.com:9000/...
STRIPE_SECRET_KEY=sk_live_...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://northmind.uk
CLOUDFLARE_R2_...  (para upload de mídia)
# Fallbacks (se StoreSettings do BD estiver vazio):
NEXT_PUBLIC_FB_PIXEL_ID=...
NEXT_PUBLIC_TIKTOK_PIXEL_ID=...
NEXT_PUBLIC_UTMIFY_PIXEL_ID=...
```
