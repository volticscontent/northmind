---
source_url: https://www.scribd.com/document/878608978/Documentac-a-o-API-UTMify
ingested_at_utc: 2026-04-24 07:11
title: Documentação da API Utmify
type: url
---

# Documentação da API Utmify

## 1- Formato da Requisição
Para enviar uma requisição à nossa API, será necessário criar uma credencial de API, que será utilizada nos headers desta requisição. Para obter uma credencial, basta acessar (ou criar) a sua conta gratuita na Utmify e seguir o caminho: Integrações > Webhooks > Credenciais de API > Adicionar Credencial > Criar Credencial.

### 1.1- Endpoint
Para enviar as informações dos pedidos, devem ser enviadas requisições do tipo POST para o seguinte endpoint:
https://api.utmify.com.br/api-credentials/orders

### 1.2- Headers
Nos headers da requisição deve ser informada a credencial de api gerada no seguinte formato:
`{'x-api-token': string}`

### 1.3- Payload
O body da requisição deve seguir o formato abaixo:

#### 1.3.1- Body
```json
{
  orderId: string,
  platform: string,
  paymentMethod: 'credit_card' | 'boleto' | 'pix' | 'paypal' | 'free_price',
  status: 'waiting_payment' | 'paid' | 'refused' | 'refunded' | 'chargedback',
  createdAt: 'YYYY-MM-DD HH:MM:SS', // UTC
  approvedDate: 'YYYY-MM-DD HH:MM:SS' | null, // UTC
  refundedAt: 'YYYY-MM-DD HH:MM:SS' | null, // UTC
  customer: Customer,
  products: Product[],
  trackingParameters: TrackingParameters,
  commission: Commission,
  isTest?: boolean
}
```

#### 1.3.2- Customer
(Omitido no snippet parcial, mas presumido seguir a interface padrão de name, email, phone, document)
