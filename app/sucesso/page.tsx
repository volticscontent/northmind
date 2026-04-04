"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const dataRef = React.useRef(false); // Ref to avoid double tracking trigger

  React.useEffect(() => {
    if (!paymentIntentId || dataRef.current) return;
    
    // Mark as processed
    dataRef.current = true;

    async function processTracking() {
      try {
        // Capture tracking IDs from browser
        const utmifyId = typeof window !== 'undefined' ? localStorage.getItem('utmify_id') : null;

        // Call Server Action for UTMify & Stripe
        const { handlePurchaseTracking } = await import("@/lib/actions/tracking");
        const result = await handlePurchaseTracking(paymentIntentId, utmifyId);

        if (result.success && result.order) {
          setOrderDetails(result.order);

          // Trigger Client-Side Pixels (Redundant safety)
          if (typeof window !== 'undefined') {
            const fbq = (window as any).fbq;
            const ttq = (window as any).ttq;

            if (fbq) {
              fbq('track', 'Purchase', {
                value: result.order.amount,
                currency: 'GBP',
                order_id: result.order.id
              });
            }

            if (ttq) {
              ttq.track('CompletePayment', {
                content_type: 'product',
                value: result.order.amount,
                currency: 'GBP',
                contents: [{
                  id: result.order.id,
                  name: 'North Mind Order',
                  quantity: 1,
                  price: result.order.amount
                }]
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing tracking:', error);
      } finally {
        setLoading(false);
      }
    }

    processTracking();
  }, [paymentIntentId]);

  return (
    <div className="success-container">
      <div className="success-card animate-fade-in">
        <CheckCircle className="success-icon" size={64} />
        <h1 className="success-title">Order Confirmed!</h1>
        
        {loading ? (
          <p className="success-message">Verifying order details...</p>
        ) : (
          <>
            <p className="success-message">
              Thank you for your purchase! Your order has been processed successfully.
              {orderDetails && (
                <span className="block mt-2 font-bold text-black/80">
                  Total: £{orderDetails.amount.toFixed(2)}
                </span>
              )}
            </p>

            <div className="actions-container">
                <Link href="/user" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-colors">
                  Access Order Dashboard
                </Link>
              <a href="/" className="back-link-secondary">
                Return to Homepage
              </a>
            </div>
          </>
        )}
        
        {paymentIntentId && (
          <p className="payment-id">
            Order ID: {paymentIntentId}
          </p>
        )}
      </div>

      <style jsx>{`
        .success-container {
          min-height: 100vh;
          background-color: #0a0a09; /* Dark background matching the store */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .success-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 48px 32px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .success-icon {
          color: #c5a358; /* Gold accent color */
          margin: 0 auto 24px;
        }

        .success-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .success-message {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .actions-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .login-offer-btn {
          display: inline-block;
          background-color: #c5a358;
          color: #ffffff;
          text-decoration: none;
          padding: 14px 24px;
          border-radius: 6px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 0.1em;
          transition: all 0.3s;
          box-shadow: 0 4px 6px rgba(197, 163, 88, 0.2);
        }

        .login-offer-btn:hover {
          background-color: #a6874a;
          transform: translateY(-2px);
        }

        .back-link-secondary {
          font-size: 14px;
          color: #6b7280;
          text-decoration: underline;
          padding: 8px;
        }

        .payment-id {
          font-size: 11px;
          color: #9ca3af;
          word-break: break-all;
          margin-top: 16px;
        }

        .block { display: block; }
        .mt-2 { margin-top: 8px; }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
