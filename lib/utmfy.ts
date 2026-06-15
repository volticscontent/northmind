export interface UtmfyCustomer {
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  address?: {
    country?: string | null;
    state?: string | null;
    city?: string | null;
    zipCode?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
  } | null;
}

export interface UtmfyConversionData {
  orderId: string;
  platform: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  approvedDate: string | null;
  refundedAt?: string | null;
  customer: UtmfyCustomer;
  trackingParameters: {
    utmify_id?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_medium?: string | null;
    utm_source?: string | null;
    utm_term?: string | null;
  };
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
  };
  products: Array<{
    id: string;
    name: string;
    planId?: string;
    planName?: string;
    quantity: number;
    priceInCents: number;
  }>;
}

const UTMIFY_URL = 'https://api.utmify.com.br/api-credentials/orders';

export async function sendConversionToUtmfy(
  data: UtmfyConversionData,
  apiKey?: string
): Promise<boolean> {
  try {
    const key = apiKey || process.env.UTMIFY_API_KEY;

    if (!key) {
      console.warn('[UTMify] No API key configured');
      if (process.env.NODE_ENV === 'development') return true;
      return false;
    }

    const response = await fetch(UTMIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': key,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const respData = await response.json().catch(() => ({}));
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ UTMify [${key.slice(0, 8)}...] Error:`, response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ UTMify fetch error:', error);
    return false;
  }
}

/**
 * Fires the same conversion event to all configured UTMify API keys in parallel.
 * Falls back to UTMIFY_API_KEY env var if no keys are passed.
 */
export async function sendToAllUtmfyPixels(
  data: UtmfyConversionData,
  apiKeys: (string | null | undefined)[]
): Promise<void> {
  const validKeys = apiKeys.filter(Boolean) as string[];

  if (validKeys.length === 0) {
    await sendConversionToUtmfy(data);
    return;
  }

  await Promise.all(validKeys.map((key) => sendConversionToUtmfy(data, key)));
}

export { sendConversionToUtmfy as sendToUtmfy };
