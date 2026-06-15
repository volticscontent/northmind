# ADR-001 — Monolito Next.js (eliminar backend Express)

**Status:** Implementado (parcialmente — ver pendências)  
**Data:** Junho 2026  
**Autores:** Rafael + Claude

---

## Contexto

O projeto nasceu com dois processos separados:
- **Frontend:** Next.js rodando em porta 3000
- **Backend:** Express.js rodando em porta 3001

Em produção e em desenvolvimento, o Express frequentemente não subia junto com o Next.js, gerando `ECONNREFUSED 127.0.0.1:3001` em todos os endpoints de dados. O código do frontend estava cheio de `fetch(`${API_URL}/api/...`)` onde `API_URL = 'http://localhost:3001'`.

## Decisão

Migrar para um **monolito Next.js puro**, usando:
- **Server Actions** (`"use server"`) para mutações e queries iniciadas por componentes
- **Route Handlers** (`app/api/.../route.ts`) para endpoints chamados via `fetch`/`axios` do cliente ou de serviços externos (ex: Stripe webhooks)
- **Prisma ORM** acessado diretamente no servidor, sem camada intermediária

## Consequências

### Positivas
- Zero processos externos — um único `npm run dev` sobe tudo
- Server Actions têm type-safety end-to-end (sem serialização manual)
- `unstable_cache` e `revalidatePath`/`revalidateTag` do Next.js para invalidação granular
- Deploy simplificado (apenas o Next.js container)

### Negativas / Riscos
- Route Handlers precisam de autenticação manual (sem middleware Express)
- Upload de arquivos grandes via Route Handler tem limite de tamanho no Vercel/Edge

## Estado Atual da Migração

| Rota Express original | Route Handler Next.js | Status |
|-----------------------|-----------------------|--------|
| `POST /api/payment/create-intent` | `app/api/payment/create-intent/route.ts` | ✅ Feito |
| `POST /api/payment/update-metadata` | `app/api/payment/update-metadata/route.ts` | ✅ Feito |
| `POST /api/payment/track-ic` | `app/api/payment/track-ic/route.ts` | ✅ Feito |
| `POST /api/payment/track-purchase` | `app/api/payment/track-purchase/route.ts` | ✅ Feito |
| `POST /api/upload` | `app/api/upload/route.ts` | ✅ Feito |
| `POST /api/auth/register` | ❌ Não migrado | **PENDENTE** |
| `POST /api/auth/set-password` | ❌ Não migrado | **PENDENTE** |
| `GET /api/admin/customer/:email` | ❌ Não migrado | **PENDENTE** |
| `GET /api/admin/verify-order/:id/:uid` | ❌ Não migrado | **PENDENTE** |
| `POST /api/orders` | ❌ Não migrado | **CRÍTICO** |
| `GET /api/products/admin/:id` | ❌ Não migrado | **PENDENTE** |

## Componentes Ainda Usando `API_URL` (Express morto)

Estes componentes precisam ter suas URLs atualizadas para os Route Handlers do Next.js:

1. **`components/CheckoutForm.tsx`** — múltiplas chamadas:
   - `${API_URL}/api/payment/track-ic` → `/api/payment/track-ic` (relativo)
   - `${API_URL}/api/orders` → `/api/orders` (quando migrado)
   - `${API_URL}/api/payment/update-metadata` → `/api/payment/update-metadata`

2. **`app/checkout/page.tsx`** — chamada ao create-intent

3. **`app/success/page.tsx`** — chamada ao track-purchase

4. **`components/admin/MediaUpload.tsx`** — chamada ao upload

## Padrão de Implementação para Rotas Pendentes

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { name, email, password, ... } = await req.json();
  
  // validação
  // bcrypt.hash
  // prisma.user.create
  
  return NextResponse.json({ success: true });
}
```

```typescript
// app/api/orders/route.ts — CRÍTICO
// Este é o mais importante. Precisa:
// 1. Criar o Pedido no banco (com campos de endereço adicionados ao model Prisma)
// 2. Retornar { id, userId } para o CheckoutForm continuar o fluxo Stripe
export async function POST(req: NextRequest) {
  const { items, total, status, userEmail, customerInfo } = await req.json();
  // ...
}
```
