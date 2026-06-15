# northmind (repo)

## Fonte
- Path: ../ (interpretado como raiz do repositório northmind)
- Raw: raw/docs/2026-04-23-northmind-repo.md
- Ingested at (UTC): 2026-04-23 22:51

## Snapshot
- Frontend em Next.js (App Router) em `app/`
- Backend em Express em `backend/` (porta 3001)
- Prisma com multi-schema (schemas `admin` e `public`) em `prisma/schema.prisma`

## Pontos-chave
- Scripts do projeto em `package.json`: dev/build/start/lint
- Autenticação (backend):
  - User login: `POST /api/auth/login`
  - Admin login: `POST /api/auth/admin/login`
  - Bootstrap 1º admin (temporário): `POST /api/auth/admin/create-first-admin`
- Autorização (backend): `isAdmin` valida `decoded.type === "ADMIN"` via JWT

## Referenciado por
- [[index]]
- [[overview]]
- [[log]]
