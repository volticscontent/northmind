import { NextRequest, NextResponse } from "next/server";
import { sendToAllUtmfyPixels } from "@/lib/utmfy";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, trackingParameters, amount, products } = body;

    // Read settings from DB
    let GBP_TO_BRL = 7.4;
    let utmifyKeys: (string | null)[] = [];
    try {
      const s = await (prisma as any).storeSettings.findUnique({ where: { id: "singleton" } });
      if (s?.gbpToBrlRate) GBP_TO_BRL = s.gbpToBrlRate;
      utmifyKeys = [s?.utmifyMetaApiKey, s?.utmifyTiktokApiKey, s?.utmifyGoogleApiKey];
    } catch {}

    console.log(`[UTMify] 🛒 IC: ${customer?.email} — firing to ${utmifyKeys.filter(Boolean).length || "env"} pixel(s)`);

    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const totalInCents = Math.round(amount * 100 * GBP_TO_BRL);

    const data = {
      orderId: `ic_${Date.now()}`,
      platform: "stripe",
      paymentMethod: "credit_card",
      status: "waiting_payment",
      createdAt: now,
      approvedDate: null,
      refundedAt: null,
      customer: {
        name: customer?.name || "Customer",
        email: customer?.email || "cliente@email.com",
        phone: customer?.phone || null,
        document: null,
        address: {
          country: customer?.country || "GB",
          state: customer?.state || null,
          city: customer?.city || null,
          zipCode: customer?.postcode || null,
          street: customer?.address || null,
          complement: customer?.complement || null,
        },
      },
      trackingParameters: {
        ...trackingParameters,
        utm_content: trackingParameters?.utm_content || null,
        utm_term: trackingParameters?.utm_term || null,
      },
      commission: {
        totalPriceInCents: totalInCents,
        gatewayFeeInCents: Math.round(totalInCents * 0.04),
        userCommissionInCents: totalInCents - Math.round(totalInCents * 0.04),
      },
      products: products
        ? products.map((p: any) => ({
            id: p.id || "p1",
            name: p.name || "Product",
            planId: p.id || "p1",
            planName: p.name || "Product",
            quantity: p.quantity || 1,
            priceInCents: p.priceInCents || totalInCents,
          }))
        : [
            {
              id: "checkout_start",
              name: "Checkout Initiation",
              planId: "checkout_start",
              planName: "Checkout Initiation",
              quantity: 1,
              priceInCents: totalInCents,
            },
          ],
    };

    await sendToAllUtmfyPixels(data, utmifyKeys);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UTMify] Error tracking IC:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
