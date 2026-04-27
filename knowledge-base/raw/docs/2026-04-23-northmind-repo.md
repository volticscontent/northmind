---
source_path: ../
interpreted_as: northmind repository root (knowledge-base/..)
ingested_at_utc: 2026-04-23 22:51
title: Northmind repository snapshot (structure + key configs)
---

## Estrutura (alto nível)
- app/ (Next.js 14 App Router)
- backend/ (Express API)
- prisma/ (schema, migrations, seed, scripts)
- components/, lib/, public/, data/

## Scripts (package.json)
- dev: next dev
- build: next build
- start: next start
- lint: next lint

## Backend (Express)
- Entry: backend/src/index.ts
- Porta padrão: 3001 (env PORT)
- Rotas montadas:
  - /api/auth
  - /api/admin
  - /api/products
  - /api/collections
  - /api/reviews
  - /api/orders
  - /api/payment
  - /api/upload

## Auth (backend)
- User login: POST /api/auth/login (JWT: { id, type: "USER" })
- Admin login: POST /api/auth/admin/login (JWT: { id, type: "ADMIN" })
- Bootstrap (temporário): POST /api/auth/admin/create-first-admin (cria 1º admin)
- Middleware: backend/src/middleware/auth.ts
  - isAdmin exige decoded.type === "ADMIN"

## Prisma
- Config: prisma.config.ts (datasource url via env DATABASE_URL)
- Schema: prisma/schema.prisma
  - multiSchema enabled (schemas: public, admin)
  - modelos em admin: Account, Session, Admin, User, Pedido, VerificationToken
  - modelos em public: Produto, Comentario, Collection
