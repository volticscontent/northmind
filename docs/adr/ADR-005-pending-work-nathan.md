# ADR-005 — Trabalho Pendente para Nathan Junior

**Status:** Checklist de implementação  
**Data:** 15 de junho de 2026  
**Contexto:** Este documento lista tudo que precisa ser feito para o checkout funcionar em produção e para o admin estar completo.

---

## Ordem de Prioridade

```
BLOQUEANTE (checkout quebrado sem isso)
  → P1: Gerar Prisma client
  → P2: Migrar /api/orders
  → P3: Corrigir URLs no CheckoutForm

IMPORTANTE (funcionalidade incompleta)
  → P4: Adicionar endereço ao model Pedido
  → P5: Migrar rotas auth

NICE TO HAVE
  → P6: Drawer de pedido no admin
  → P7: Página de analytics
```

---

## P1 — Gerar Prisma Client (5 minutos)

**Por que:** O model `StoreSettings` foi adicionado ao `prisma/schema.prisma` mas o cliente não foi regenerado. Código usa `(prisma as any).storeSettings` como workaround.

**Como:**
```bash
# 1. Parar o servidor de dev (Ctrl+C)
# 2. Rodar:
npx prisma generate
npx prisma db push    # se o schema mudou
# 3. Subir o servidor novamente:
npm run dev
```

**Depois:** Substituir todos os `(prisma as any).storeSettings` por `prisma.storeSettings` nos arquivos:
- `lib/actions.ts` (3 ocorrências)
- `app/api/payment/track-ic/route.ts`
- `app/api/payment/track-purchase/route.ts`
- `app/layout.tsx`

---

## P2 — Migrar `/api/orders` (30-60 minutos)

**Por que:** Este é o endpoint que cria o pedido no banco durante o checkout. Sem ele, o checkout falha silenciosamente.

**Arquivo a criar:** `app/api/orders/route.ts`

Ver implementação detalhada em `docs/adr/ADR-004-payment-flow.md`.

**Pontos críticos:**
- Recebe `{ items, total, status, userEmail, customerInfo }`
- Deve criar/encontrar o usuário pelo email
- Retorna `{ id: pedido.id, userId }`
- Incluir campos de endereço (requer P4 antes)

---

## P3 — Corrigir URLs no CheckoutForm.tsx (15 minutos)

**Arquivo:** `components/CheckoutForm.tsx`

Trocar todas as ocorrências de `${API_URL}/api/...` para paths relativos `/api/...`:

```typescript
// ANTES (quebrado - aponta para Express morto):
await axios.post(`${API_URL}/api/payment/track-ic`, ...)
await axios.post(`${API_URL}/api/orders`, ...)
await axios.post(`${API_URL}/api/payment/update-metadata`, ...)

// DEPOIS (correto - Route Handlers do Next.js):
await axios.post(`/api/payment/track-ic`, ...)
await axios.post(`/api/orders`, ...)
await axios.post(`/api/payment/update-metadata`, ...)
```

Também remover o import de `API_URL` do topo do arquivo.

---

## P4 — Adicionar Endereço ao Model Pedido (20 minutos)

**Arquivo:** `prisma/schema.prisma`

Adicionar ao model `Pedido`:
```prisma
customerName       String?
customerEmail      String?
customerPhone      String?
shippingAddress    String?
shippingCity       String?
shippingPostcode   String?
shippingCountry    String?
shippingState      String?
shippingComplement String?
```

Depois:
```bash
npx prisma db push
npx prisma generate
```

---

## P5 — Migrar Rotas de Auth (1-2 horas)

### `app/api/auth/register/route.ts`
A Server Action `registerUser()` já existe em `lib/actions.ts`. Wrapper simples:
```typescript
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await registerUser(data);
  return NextResponse.json(result);
}
```

### `app/api/auth/set-password/route.ts`
Criar Server Action `setUserPassword(userId: string, password: string)`:
```typescript
export async function setUserPassword(userId: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { hashedPassword },
  });
}
```

### `app/api/admin/customer/[email]/route.ts`
```typescript
export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  // verificar session ADMIN
  const user = await prisma.user.findUnique({ where: { email: params.email } });
  return NextResponse.json(user);
}
```

### `app/api/admin/verify-order/[orderId]/[userId]/route.ts`
Já existe como Server Action em `app/success/actions.ts`. Criar wrapper ou manter como está.

---

## P6 — Drawer de Detalhes do Pedido (2-3 horas)

**Arquivo a criar:** `components/admin/OrderDrawer.tsx`

Ao clicar em um pedido em `/admin/orders`, abre um Drawer lateral com:
- Cabeçalho: ID do pedido, status badge colorido, data
- Seção Cliente: nome, email, telefone
- Seção Entrega: endereço completo (quando P4 estiver feito)
- Seção Produtos: lista de produtos com imagem, nome, preço
- Seção Ações: botões para trocar status (confirmar, enviar, entregue, cancelar)

Design: seguir o padrão dark do admin (fundo preto, texto branco, bordas `border-white/5`).

---

## P7 — Página de Analytics (4-6 horas)

**Arquivo a criar:** `app/admin/(dashboard)/analytics/page.tsx`

Dados disponíveis:
```typescript
// Usar getOrders() que já traz pedidos com produtos
// Filtrar por data, calcular métricas

const revenueByDay = orders
  .filter(o => ["PAGO","ENVIADO","ENTREGUE"].includes(o.status))
  .reduce((acc, o) => {
    const day = o.dataCompra.substring(0, 10);
    acc[day] = (acc[day] || 0) + o.totalAmmount;
    return acc;
  }, {});
```

Componentes sugeridos:
- Gráfico de linha: receita por dia (últimos 30 dias) — usar `recharts` ou `chart.js`
- Card: taxa de conversão (pedidos / visitantes únicos — se tiver dado de sessions)
- Lista: top 5 produtos mais vendidos
- Tabela: pedidos por origem (utm_source — extrair do Stripe via API se necessário)

---

## Checklist Final de Produção

Antes de ir ao ar com tráfego pago:

- [ ] P1: Prisma generate feito, casts `as any` removidos
- [ ] P2: `/api/orders` funcionando
- [ ] P3: URLs do CheckoutForm corrigidas
- [ ] P4: Endereço salvo no Pedido
- [ ] P5: Auth routes migradas
- [ ] Pixels configurados em `/admin/settings` (Meta Pixel ID, TikTok Pixel ID, UTMify keys)
- [ ] Taxa GBP→BRL sincronizada com Stripe em `/admin/settings`
- [ ] LGPD banner testado (aceitar → pixels carregam, recusar → só UTMify)
- [ ] Compra de teste end-to-end com cartão de teste Stripe
- [ ] Verificar UTMify dashboard — eventos aparecem?
- [ ] Verificar Meta Events Manager — Purchase aparece?
