"use server";

import Stripe from "stripe";
import { UtmfyConversionData, sendConversionToUtmfy } from "@/lib/utmfy";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export async function handlePurchaseTracking(paymentIntentId: string, utmifyId?: string | null) {
  try {
    if (!paymentIntentId) return { success: false, error: 'PaymentIntentId missing' };

    console.log('🔍 Retrieving PaymentIntent from Stripe:', paymentIntentId);
    
    // Recuperar o PaymentIntent com expansão do customer se necessário
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['customer', 'payment_method'],
    });

    console.log('📦 Stripe Metadata Retrieved:', paymentIntent.metadata);

    if (paymentIntent.status !== 'succeeded') {
      console.warn('⚠️ Tracking attempt for non-successful payment:', paymentIntent.status);
      return { success: false, error: 'Payment not successful' };
    }

    // Extrair dados para UTMify
    const amount = (paymentIntent.amount / 100); 
    const now = new Date().toISOString();

    const data: UtmfyConversionData = {
      orderId: paymentIntent.id,
      platform: 'stripe',
      paymentMethod: 'credit_card', // Simplificado
      status: 'paid',
      createdAt: now,
      approvedDate: now,
      customer: {
        name: (paymentIntent.metadata?.customer_name as string) || 'Customer',
        email: (paymentIntent.receipt_email as string) || (paymentIntent.metadata?.customer_email as string) || 'cliente@email.com',
        phone: (paymentIntent.metadata?.customer_phone as string) || null,
        document: null,
      },
      trackingParameters: {
        utmify_id: utmifyId || (paymentIntent.metadata?.utmify_id as string) || null,
        utm_campaign: (paymentIntent.metadata?.utm_campaign as string) || null,
        utm_content: (paymentIntent.metadata?.utm_content as string) || null,
        utm_medium: (paymentIntent.metadata?.utm_medium as string) || null,
        utm_source: (paymentIntent.metadata?.utm_source as string) || null,
        utm_term: (paymentIntent.metadata?.utm_term as string) || null,
      },
      commission: {
        totalPriceInCents: paymentIntent.amount,
        gatewayFeeInCents: Math.round(paymentIntent.amount * 0.04), // Estimativa de taxa
        userCommissionInCents: paymentIntent.amount - Math.round(paymentIntent.amount * 0.04),
      },
      products: [
        {
          id: 'order_' + paymentIntent.id,
          name: (paymentIntent.metadata?.product_name as string) || 'North Mind Order',
          quantity: 1,
          priceInCents: paymentIntent.amount,
        }
      ],
    };

    console.log('🚀 Sending conversion to UTMify...');
    const result = await sendConversionToUtmfy(data);

    // TODO: Disparar CAPI da Meta e TikTok também S2S se as chaves estiverem no .env
    // (Currently the client already handles pixel tracking as a safety measure)

    return { 
      success: result, 
      order: {
        amount,
        email: data.customer.email,
        id: data.orderId
      }
    };
  } catch (error: any) {
    console.error('❌ Error in Tracking Server Action:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}
