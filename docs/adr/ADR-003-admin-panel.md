# ADR-003 — Admin Panel

**Status:** Implementado (sem drawer de pedido e analytics)  
**Data:** Junho 2026

---

## Estrutura de Rotas

```
/admin                    → Dashboard (métricas + pedidos recentes)
/admin/collections        → Gestão de coleções
/admin/products           → Gestão de produtos
/admin/orders             → Gestão de pedidos
/admin/reviews            → Moderação de reviews
/admin/settings           → Configurações de tracking (pixels, UTMify, taxa)
```

Todas as páginas são Server Components que fazem `getServerSession` e redirecionam se `session.user.type !== "ADMIN"`.

## Layout

`app/admin/layout.tsx` → sidebar + header.  
`components/admin/AdminSidebarNav.tsx` → links com ícones Lucide, indicador de rota ativa.

## Padrão de Componentes

Cada seção tem:
- **Page** (Server Component) — busca dados, passa para o client component
- **Manager** (Client Component) — estado local, toasts, modais de confirmação

```typescript
// Padrão de Toast
type Toast = { type: "success" | "error"; msg: string };
const [toast, setToast] = useState<Toast | null>(null);
const showToast = (type: Toast["type"], msg: string) => {
  setToast({ type, msg });
  setTimeout(() => setToast(null), 3000);
};

// Padrão de Confirm Modal (substitui window.confirm())
type ConfirmModal = { message: string; onConfirm: () => void } | null;
const [confirmModal, setConfirmModal] = useState<ConfirmModal>(null);
const showConfirm = (msg: string, onConfirm: () => void) =>
  setConfirmModal({ message: msg, onConfirm });
```

**Importante:** `alert()` e `confirm()` foram eliminados — usam toast + modal.

## Server Actions (lib/actions.ts)

| Action | Descrição |
|--------|-----------|
| `getAdminStats()` | Revenue (só PAGO/ENVIADO/ENTREGUE), pedidos recentes |
| `getOrders()` | Lista completa de pedidos com produtos resolvidos |
| `updateOrderStatus(id, status)` | Troca status do pedido |
| `getProducts()` | Lista de produtos |
| `upsertProduct(data)` | Criar ou editar produto |
| `deleteProduct(id)` | Deletar produto |
| `getCollections()` | Lista de coleções |
| `upsertCollection(data)` | Criar ou editar coleção |
| `deleteCollection(id)` | Deletar coleção |
| `setCollectionDraft(id, publicado)` | Publicar/despublicar coleção |
| `setCollectionStatus(name, publicado)` | Publicar/despublicar todos os produtos de uma coleção |
| `getAdminReviews()` | Lista de reviews |
| `updateReview(id, data)` | Editar review |
| `deleteReview(id)` | Deletar review |
| `getStoreSettings()` | Ler configurações de tracking |
| `saveStoreSettings(data)` | Salvar configurações de tracking |
| `syncGbpToBrlRate()` | Buscar taxa GBP→BRL via Stripe e salvar |

## Pendências do Admin

### 1. Drawer de Detalhes do Pedido
Em `/admin/orders`, clicar em um pedido deve abrir um drawer lateral com:
- Itens do pedido (nome, quantidade, preço)
- Dados do cliente (nome, email, telefone)
- Endereço de entrega (**precisa dos campos adicionados ao model Pedido**)
- Timeline de status

### 2. Página de Analytics
`/admin/analytics` — não existe ainda. Sugestão:
- Receita por dia (últimos 30 dias)
- Top 5 produtos mais vendidos
- Funil de conversão (views → cart → checkout → purchase)
- Origem dos pedidos (utm_source do Stripe metadata)

## Bug Conhecido

`setCollectionDraft` estava quebrando porque chamava o Express. Foi corrigido para usar `prisma.collection.update` diretamente.

A contagem "X Pieces" em cada coleção estava sempre 0. Corrigido: agora filtra `allProducts.filter(p => p.collection === collection.name).length`.
