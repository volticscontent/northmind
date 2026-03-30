import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("A variável de ambiente STRIPE_SECRET_KEY não está definida.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16", // Versão da API do Stripe
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency } = body;

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount e currency são obrigatórios." }, { status: 400 });
    }

    // Cria um PaymentIntent com o valor do pedido e moeda
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe espera o valor em centavos
      currency: currency,
      // Usar a configuração automática baseada no Dashboard da Stripe (evita erro se Pix não estiver ativado)
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Erro interno ao criar Payment Intent:", error);
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno ao processar o pagamento." },
      { status: 500 }
    );
  }
}
