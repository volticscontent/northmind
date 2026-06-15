import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16" as any, 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { intentId, metadata } = body;

    if (!intentId) return NextResponse.json({ error: "intentId obrigatório" }, { status: 400 });

    await stripe.paymentIntents.update(intentId, {
      metadata: {
        ...metadata,
        source: 'checkout_update'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar metadados:", error);
    return NextResponse.json({ error: "Erro ao atualizar informações de rastreamento." }, { status: 500 });
  }
}
