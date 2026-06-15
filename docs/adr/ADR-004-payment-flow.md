# ADR-004 — Fluxo de Pagamento (Stripe)

**Status:** Parcialmente migrado — `/api/orders` ainda no Express morto  
**Data:** Junho 2026

---

## Fluxo Atual (como está no código)

```
1. app/checkout/page.tsx
   └─ GET /api/payment/create-intent → cria PaymentIntent no Stripe
      (este endpoint já existe em app/api/payment/create-intent/route.ts)

2. components/CheckoutForm.tsx (client)
   ├─ Usuário preenche form (nome, email, phone, endereço)
   ├─ onBlur → IC tracking early (veja ADR-002)
   ├─ "Pay Now" clicked:
   │   ├─ elements.submit() → valida campos Stripe
   │   ├─ POST /api/orders → CRIA PEDIDO (⚠️ Express morto, precisa migrar)
   │   ├─ POST /api/payment/update-metadata → adiciona dados ao PaymentIntent
   │   └─ stripe.confirmPayment() → redireciona para /success?payment_intent=pi_xxx
   └─ Método custom "northmind": redireciona diretamente

3. app/success/page.tsx (client)
   ├─ POST /api/payment/track-purchase → tracking S2S
   ├─ verifyOrder() Server Action → retorna se usuário tem senha
   └─ Se não tem senha: exibe SetPasswordForm
```

## Stripe Metadata (após update-metadata)

O PaymentIntent tem estes campos após o checkout:
```
customer_name: "João Silva"
customer_email: "joao@email.com"
customer_phone: "+44 7700900000"
customer_country: "GB"
customer_state: "Greater London"
customer_city: "London"
customer_postal_code: "SW1A 1AA"
customer_address: "10 Downing Street"
customer_complement: ""
utmify_id: "abc123"
utm_source: "meta"
utm_medium: "paid"
utm_campaign: "summer-collection"
utm_content: ""
utm_term: ""
order_id: "clx..."
user_id: "clx..."
source: "checkout_update"
```

`track-purchase/route.ts` lê esses campos para montar o evento UTMify S2S com dados completos do cliente.

## Model Pedido (Prisma) — Campos Atuais vs Necessários

O modelo `Pedido` atualmente **não tem campos de endereço**. O checkout coleta o endereço mas ele é perdido (vai para o Stripe mas não para o banco).

**Adicionar ao schema.prisma:**
```prisma
model Pedido {
  // ... campos existentes ...
  
  // Endereço de entrega (adicionar)
  shippingAddress   String?
  shippingCity      String?
  shippingPostcode  String?
  shippingCountry   String?
  shippingState     String?
  shippingComplement String?
  
  // Dados do cliente para o pedido
  customerName      String?
  customerEmail     String?
  customerPhone     String?
}
```

## Migrações Necessárias

### `/api/orders` (CRÍTICO)
Este é o endpoint mais importante a migrar. Sem ele, o checkout está completamente quebrado.

```typescript
// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items, total, status, userEmail, customerInfo } = body;
  
  // Encontrar ou criar usuário
  let userId = null;
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    userId = user?.id;
    
    // Se não tem usuário, criar um anônimo (convidado)
    if (!userId) {
      const guestUser = await prisma.user.create({
        data: {
          email: userEmail,
          name: customerInfo.firstName + ' ' + customerInfo.lastName,
        }
      });
      userId = guestUser.id;
    }
  }
  
  const pedido = await prisma.pedido.create({
    data: {
      userId,
      totalAmmount: total,
      status,
      produtosIds: items.map((i: any) => i.id),
      // Endereço (quando campos adicionados)
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress: customerInfo.address,
      shippingCity: customerInfo.city,
      shippingPostcode: customerInfo.postcode,
      shippingCountry: customerInfo.country,
      shippingState: customerInfo.county,
      shippingComplement: customerInfo.complement,
    }
  });
  
  return NextResponse.json({ id: pedido.id, userId });
}
```

### Outros endpoints

`/api/auth/register` → `registerUser()` Server Action já existe em `lib/actions.ts`, pode usar diretamente  
`/api/auth/set-password` → criar action `setUserPassword(userId, password)`  
`/api/admin/verify-order/:orderId/:userId` → já existe como Server Action em `app/success/actions.ts`

## URLs a Corrigir em CheckoutForm.tsx

| Linha atual | Substituir por |
|-------------|----------------|
| `${API_URL}/api/payment/track-ic` | `/api/payment/track-ic` |
| `${API_URL}/api/orders` | `/api/orders` |
| `${API_URL}/api/payment/update-metadata` | `/api/payment/update-metadata` |
| `${API_URL}/api/payment/track-purchase` | `/api/payment/track-purchase` |

E em `app/success/page.tsx`:
```typescript
// Trocar:
await axios.post(`/api/payment/track-purchase`, ...)
// (já usa path relativo — verificar se não tem API_URL)
```
