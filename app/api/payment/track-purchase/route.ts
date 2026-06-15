import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendToAllUtmfyPixels } from "@/lib/utmfy";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { intentId, utmifyIdManual } = body;

    if (!intentId) return NextResponse.json({ error: "intentId required" }, { status: 400 });

    // Read settings from DB (GBP rate + UTMify S2S API keys per platform)
    let GBP_TO_BRL = 7.4;
    let utmifyKeys: (string | null)[] = [];
    try {
      const s = await (prisma as any).storeSettings.findUnique({ where: { id: "singleton" } });
      if (s?.gbpToBrlRate) GBP_TO_BRL = s.gbpToBrlRate;
      utmifyKeys = [s?.utmifyMetaApiKey, s?.utmifyTiktokApiKey, s?.utmifyGoogleApiKey];
    } catch {}

    console.log(`[UTMify] 💰 Purchase: ${intentId} — firing to ${utmifyKeys.filter(Boolean).length || "env"} pixel(s)`);

    const paymentIntent = await stripe.paymentIntents.retrieve(intentId, {
      expand: ["customer", "payment_method"],
    });

    if (paymentIntent.status !== "succeeded") {
      console.warn(`[UTMify] PaymentIntent ${intentId} not succeeded`);
      return NextResponse.json({ error: "Payment not succeeded" }, { status: 400 });
    }

    const m = paymentIntent.metadata || {};
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const totalPriceInBRL = Math.round(paymentIntent.amount * GBP_TO_BRL);

    console.log(`[UTMify] 💱 £${(paymentIntent.amount / 100).toFixed(2)} → R$${(totalPriceInBRL / 100).toFixed(2)} (x${GBP_TO_BRL})`);

    const data = {
      orderId: paymentIntent.id,
      platform: "stripe",
      paymentMethod: "credit_card",
      status: "paid",
      createdAt: now,
      approvedDate: now,
      refundedAt: null,
      customer: {
        name: m.customer_name || "Customer",
        email: paymentIntent.receipt_email || m.customer_email || "cliente@email.com",
        phone: m.customer_phone || null,
        document: null,
        address: {
          country: m.customer_country || "GB",
          state: m.customer_state || null,
          city: m.customer_city || null,
          zipCode: m.customer_postal_code || null,
          street: m.customer_address || null,
          complement: m.customer_complement || null,
        },
      },
      trackingParameters: {
        utmify_id: utmifyIdManual || m.utmify_id || null,
        utm_source: m.utm_source || null,
        utm_medium: m.utm_medium || null,
        utm_campaign: m.utm_campaign || null,
        utm_content: m.utm_content || null,
        utm_term: m.utm_term || null,
      },
      commission: {
        totalPriceInCents: totalPriceInBRL,
        gatewayFeeInCents: Math.round(totalPriceInBRL * 0.04),
        userCommissionInCents: Math.round(totalPriceInBRL * 0.96),
      },
      products: [
        {
          id: `order_${paymentIntent.id}`,
          name: m.product_name || "North Mind Order",
          planId: `order_${paymentIntent.id}`,
          planName: m.product_name || "North Mind Order",
          quantity: 1,
          priceInCents: totalPriceInBRL,
        },
      ],
    };

    await sendToAllUtmfyPixels(data, utmifyKeys);

    return NextResponse.json({
      success: true,
      orderId: paymentIntent.id,
      amountInBRL: totalPriceInBRL / 100,
      amountInGBP: paymentIntent.amount / 100,
    });
  } catch (error) {
    console.error("[UTMify] Error tracking Purchase:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
