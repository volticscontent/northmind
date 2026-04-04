// Utilities for UTMify integration (Based on NORTH MIND standard)

export interface UtmfyConversionData {
  orderId: string;
  platform: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  approvedDate: string;
  customer: {
    name: string;
    email: string;
    phone: string | null;
    document: string | null;
  };
  trackingParameters: {
    utmify_id?: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_medium: string | null;
    utm_source: string | null;
    utm_term: string | null;
  };
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
  };
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    priceInCents: number;
  }>;
}

export async function sendConversionToUtmfy(data: UtmfyConversionData): Promise<boolean> {
  try {
    const utmfyWebhookUrl = process.env.UTMIFY_WEBHOOK_URL || 'https://api.utmify.com.br/api-credentials/orders';
    const utmfyApiKey = process.env.UTMIFY_API_KEY;

    if (!utmfyApiKey) {
      console.warn('UTMIFY_API_KEY not configured in .env');
      // In development, return true to avoid blocking the flow
      if (process.env.NODE_ENV === 'development') return true;
      return false;
    }

    const response = await fetch(utmfyWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': utmfyApiKey,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('✅ Conversion sent to UTMify:', data.orderId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ UTMify error:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending to UTMify:', error);
    return false;
  }
}
