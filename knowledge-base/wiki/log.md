# Log

## [2026-04-23 22:49] [INGEST] Ingestão da home https://www.northmind.store/.
- Files affected: [[northmind-store]], [[index]], [[overview]]
- Context: Captura do conteúdo textual público para referência interna. Raw: knowledge-base/raw/docs/2026-04-23-northmind-store.md

## [2026-04-23 22:51] [INGEST] Ingestão de snapshot do repositório (../).
- Files affected: [[northmind-repo]], [[index]], [[overview]]
- Context: Captura de estrutura e configurações-chave (Next.js/Express/Prisma) para referência interna. Raw: knowledge-base/raw/docs/2026-04-23-northmind-repo.md

## [2026-04-24 07:11] [INGEST] Ingestão da doc API UTMify.
- Files affected: [[utmify]], [[index]], [[overview]]
- Context: Ingestão de doc PDF externa referenciando o formato de payload da API (sem pixel ID, e requerendo datas em formato YYYY-MM-DD HH:MM:SS). Raw: knowledge-base/raw/docs/2026-04-24-utmify-api.md

## [2026-04-24 07:29] [FEAT] Aprimoramento do fluxo de Checkout e Tracking S2S.
- Files affected: [[utmify]]
- Context: Integração das tags `<script dangerouslySetInnerHTML>` nativas para carregar os pixels da Meta e TikTok sincronicamente. Refatoração do payload enviado ao UTMify para seguir estritamente o formato de datas requerido (`YYYY-MM-DD HH:MM:SS`). Adoção de um "Strong Initiate Checkout" antecipado (acionado ao focar no PaymentElement do Stripe) para garantir alta retenção de leads na Utmify, além da correção da lógica do carrossel na Product Detail Page que causava tela em branco ao trocar a imagem ativa.
