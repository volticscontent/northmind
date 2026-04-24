# UTMify (API Integração)

## Fonte
- URL: https://www.scribd.com/document/878608978/Documentac-a-o-API-UTMify
- Raw: knowledge-base/raw/docs/2026-04-24-utmify-api.md
- Ingested at (UTC): 2026-04-24 07:11

## Resumo Técnico
O endpoint `POST https://api.utmify.com.br/api-credentials/orders` é usado para marcar compras no modelo Server-to-Server (S2S). 

### Requisitos Essenciais:
1. **Header Authentication**: Requer o header `{'x-api-token': string}` (que na nossa config corresponde a `UTMIFY_API_KEY` no `.env`). **Não utiliza Pixel ID no backend.**
2. **Sessão do Usuário**: Requer o parâmetro `utmify_id` enviado dentro de `trackingParameters` no body da requisição, gerado pelo frontend no momento da visita.
3. **Formatos de Data**: As datas (`createdAt`, `approvedDate`, `refundedAt`) devem OBRIGATORIAMENTE seguir o formato string `YYYY-MM-DD HH:MM:SS` (em UTC).

## Entidades
- Headers: `x-api-token`
- Tracking: `utmify_id`
- Datas: `YYYY-MM-DD HH:MM:SS`

## Referenciado por
- [[index]]
- [[overview]]
- [[log]]
