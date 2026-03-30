"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  // O texto base solicitado na instrução
  return (
    <div className="success-container">
      <div className="success-card">
        <CheckCircle className="success-icon" size={64} />
        <h1 className="success-title">Pagamento Confirmado!</h1>
        <p className="success-message">
          Hello World e o nome do produto que a pessoa comprou: 
          <strong> Tênis Esportivo Runner</strong> (e outros itens).
        </p>
        
        {paymentIntent && (
          <p className="payment-id">
            ID do Pedido: {paymentIntent}
          </p>
        )}

        <a href="/" className="back-link">
          Voltar para a página inicial
        </a>
      </div>

      <style jsx>{`
        .success-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 20px;
        }

        .success-card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 48px 32px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .success-icon {
          color: #10b981; /* Verde */
          margin: 0 auto 24px;
        }

        .success-title {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          margin-top: 0;
        }

        .success-message {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .payment-id {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 32px;
          word-break: break-all;
        }

        .back-link {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .back-link:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
