import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, metadata } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount e currency são obrigatórios." },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { ...metadata, source: "api_direct" },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Erro ao criar Payment Intent:", error);
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno ao processar o pagamento." },
      { status: 500 }
    );
  }
}
