import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16" as any, 
});

export async function GET(
  req: NextRequest,
  { params }: { params: { intentId: string } }
) {
  try {
    const intentId = params.intentId;
    if (!intentId) return NextResponse.json({ error: "intentId obrigatório" }, { status: 400 });

    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

    return NextResponse.json({ status: paymentIntent.status, paymentIntent });
  } catch (error: any) {
    console.error("Erro na verificação de pagamento:", error);
    return NextResponse.json({ error: "Erro interno verificando pagamento." }, { status: 500 });
  }
}
