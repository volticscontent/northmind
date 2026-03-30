"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm, { OrderItem } from "@/components/CheckoutForm";
import { useCart } from "@/lib/CartContext";

// Chave pública do Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);



export default function CheckoutPage() {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [initError, setInitError] = useState("");

  // Transforma os itens do cart global para o formato do Checkout
  const orderItems: OrderItem[] = cart.map((item) => ({
    id: item.id,
    name: item.title,
    description: `Size: ${item.selectedSize}`,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.images[0],
    discount: 0,
  }));

  // Calcula o total dos items (preço com desconto * quantidade)
  const totalAmount = orderItems.reduce((sum, item) => {
    const itemPrice = item.price - (item.discount || 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  useEffect(() => {
    if (totalAmount <= 0) return; // Se carrinho zerado, não tenta criar o pagamento

    // Cria o PaymentIntent via API route
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "brl",
          }),
        });

        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setInitError(data.error || "Erro desconhecido ao comunicar com Stripe.");
          console.error("Client Secret não encontrado", data.error);
        }
      } catch (error: any) {
        setInitError("Erro de comunicação com o servidor.");
        console.error("Erro ao comunicar com a API de Payment Intent", error);
      }
    };

    createPaymentIntent();
  }, [totalAmount]);

  // Opções de configuração do Stripe Elements
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe", // Tema base do stripe (que é limpo)
      variables: {
        colorPrimary: "#2563eb", // Cor principal azul
        colorBackground: "#ffffff",
        colorText: "#111827",
        colorDanger: "#dc2626",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
        // Variáveis customizadas para ficar idêntico ao estilo do checkout
      },
      rules: {
         ".Input": {
            padding: "12px 14px",
            boxShadow: "none",
            border: "1px solid #d1d5db",
         },
         ".Input:focus": {
            border: "1px solid #2563eb",
            boxShadow: "0 0 0 1px #2563eb",
         },
         ".Label": {
            color: "#6b7280",
            fontSize: "14px",
         }
      }
    },
    locale: "pt-BR", // Define o idioma para os inputs do Stripe (como CC, CVC)
  };

  return (
    <div className="checkout-page-wrapper">
      {totalAmount <= 0 ? (
        <div className="error-state">
          <p className="error-text">O seu carrinho está vazio.</p>
          <p className="error-detail">Adicione produtos antes de finalizar a compra.</p>
          <a href="/" className="retry-btn" style={{ textDecoration: 'none' }}>Voltar para a loja</a>
        </div>
      ) : initError ? (
        <div className="error-state">
          <p className="error-text">Ocorreu um erro ao inicializar o checkout:</p>
          <p className="error-detail">{initError}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">Tentar Novamente</button>
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm items={orderItems} />
        </Elements>
      ) : (
        <div className="loading-state">
          <span className="spinner"></span>
          <p>Preparando ambiente seguro...</p>
        </div>
      )}

      <style jsx>{`
        .checkout-page-wrapper {
           min-height: 100vh;
           background-color: #f5f5f5;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #6b7280;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          text-align: center;
          padding: 24px;
        }

        .error-text {
          font-size: 18px;
          color: #111827;
          font-weight: 500;
        }

        .error-detail {
          margin-top: 8px;
          color: #dc2626;
          max-width: 400px;
        }

        .retry-btn {
          margin-top: 24px;
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(37, 99, 235, 0.2);
          border-radius: 50%;
          border-top-color: #2563eb;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
