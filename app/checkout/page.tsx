"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Image from "next/image";
import CheckoutForm, { OrderItem } from "@/components/CheckoutForm";
import { useCart } from "@/lib/CartContext";
import { API_URL } from "@/lib/api";

// Stripe Public Key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);



export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [initError, setInitError] = useState("");
  const totalAmount = totalPrice;

  // Transform global cart items to CheckoutForm format
  const orderItems: OrderItem[] = cart.map((item) => ({
    id: item.id,
    name: item.title,
    description: `Size: ${item.selectedSize}`,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.images[0],
    discount: Math.max(0, (item.originalPrice || 0) - item.price),
  }));

  useEffect(() => {
    console.log("🛒 Cart Total (GBP):", totalAmount);
    if (totalAmount <= 0) return; // If cart is empty, do not attempt to create payment

    // Cria o PaymentIntent via API route
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "gbp",
          }),
        });

        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setInitError(data.error || "Unknown error when communicating with Stripe.");
          console.error("Client Secret not found", data.error);
        }
      } catch (error: any) {
        setInitError("Server communication error.");
        console.error("Error communicating with Payment Intent API", error);
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
        colorPrimary: "#000000", // Cor principal azul
        colorBackground: "#ffffff",
        colorText: "#0c0c0c",
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
          border: "1px solid #838383",
          boxShadow: "0 0 0 1px #838383",
        },
        ".Label": {
          color: "#6b7280",
          fontSize: "14px",
        }
      }
    },
    locale: "en", // Set input language for Stripe (CC, CVC)
    customPaymentMethods: [
      {
        id: "cpmt_northmind",
        options: {
          type: "static",
        },
      },
    ],
  };

  return (
    <div className="checkout-page-wrapper">
      {/* North Mind Logo Header */}
      <header className="checkout-header">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center md:justify-start">
          <a href="/" className="group transition-all duration-500">
            <Image
              src="/assets/logo.svg"
              alt="NORTH MIND"
              width={160}
              height={50}
              priority
              className="h-8 md:h-10 w-auto opacity-100 hover:opacity-70 transition-opacity"
            />
          </a>
        </div>
      </header>

      {totalAmount <= 0 ? (
        <div className="error-state">
          <p className="error-text">Your cart is empty.</p>
          <p className="error-detail">Add products before completing your purchase.</p>
          <a href="/" className="retry-btn" style={{ textDecoration: 'none' }}>Return to Boutique</a>
        </div>
      ) : initError ? (
        <div className="error-state">
          <p className="error-text">An error occurred while initializing checkout:</p>
          <p className="error-detail">{initError}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm items={orderItems} clientSecret={clientSecret} />
        </Elements>
      ) : (
        <div className="loading-state">
          <span className="spinner"></span>
          <p>Preparing secure environment...</p>
        </div>
      )}

      <style jsx>{`
        .checkout-page-wrapper {
           min-height: 100vh;
           background-color: #f5f5f5;
        }

        .checkout-header {
           background-color: #000000;
           border-bottom: 1px solid #adadad;
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
