"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { SetPasswordForm } from "@/components/SetPasswordForm";
import { trackPurchase } from "@/lib/tracking";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const orderId = searchParams.get("o");
  const userId = searchParams.get("u");

  const [email, setEmail] = React.useState("");
  const [hasPassword, setHasPassword] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const dataRef = React.useRef(false); // Ref to avoid double tracking trigger

  React.useEffect(() => {
    console.log("✅ Success Page Loaded. PI ID:", paymentIntentId);
    
    if (!paymentIntentId || dataRef.current) {
      if (dataRef.current) console.log("ℹ️ Tracking already processed for this session.");
      return;
    }
    
    // Mark as processed
    dataRef.current = true;

    async function processTracking() {
      try {
        // --- 1. S2S AND PIXEL TRACKING ---
        const utmifyId = typeof window !== 'undefined' 
          ? (searchParams.get("utmify_id") || 
             searchParams.get("success-id") || 
             localStorage.getItem('utmify_id') || 
             localStorage.getItem('success-id')) 
          : null;

        console.log("🚀 SUCCESS_PAGE: Notifying Backend for UTMify Tracking...");
        
        const axios = (await import("axios")).default;
        const { API_URL } = await import("@/lib/api");
        
        if (paymentIntentId) {
          const response = await axios.post(`${API_URL}/api/payment/track-purchase`, {
            intentId: paymentIntentId,
            utmifyIdManual: utmifyId
          });
          console.log("📊 BACKEND_RESPONSE:", response.data);
          
          if (response.data.success) {
            const { trackPurchase, trackUtmfyPurchase } = await import("@/lib/tracking");
            
            // Meta & TikTok (GBP)
            trackPurchase({ 
              id: paymentIntentId as string, 
              amount: response.data.amountInGBP || 0 
            });

            // UTMify (BRL converted)
            trackUtmfyPurchase({
              id: paymentIntentId as string,
              amountInBRL: response.data.amountInBRL || 0
            });
          }
        }

        // --- 2. ORDER VERIFICATION (PASSWORD FORM) ---
        if (orderId && userId) {
          const res = await fetch(`${API_URL}/api/admin/verify-order/${orderId}/${userId}`);
          if (res.ok) {
            const userData = await res.json();
            setEmail(userData.email);
            setHasPassword(userData.hasPassword);
          }
        }

      } catch (error) {
        console.error('❌ SUCCESS_PAGE_ERROR:', error);
      } finally {
        setLoading(false);
      }
    }

    processTracking();
  }, [paymentIntentId, searchParams, orderId, userId]);

  return (
    <div className="success-container">
      <div className="success-card animate-fade-in">
        <CheckCircle className="success-icon" size={64} />
        <h1 className="success-title">Order Confirmed!</h1>
        
        {loading ? (
          <p className="success-message">Verifying order details...</p>
        ) : (
          <>
            <div className="status-badge">Payment Successful</div>
            <p className="success-message">
              Your order has been confirmed. A confirmation email with your receipt and tracking details has been sent to <strong className="text-black">{email || 'your email'}</strong>.
            </p>

            {/* Password Set or Dashboard Access */}
            {!hasPassword ? (
              <div className="login-context-card !bg-transparent !p-0">
                <SetPasswordForm userId={userId!} orderId={orderId!} email={email} />
              </div>
            ) : (
              <div className="login-context-card">
                 <h3 className="context-title">Track Your Heritage</h3>
                 <p className="context-text">
                   To follow your order status, manage delivery details and access exclusive support, please ensure you are logged into your account.
                 </p>
                 <Link href="/user" className="login-action-btn">
                   Access My Dashboard
                 </Link>
              </div>
            )}

            <div className="actions-container">
              <a href="/" className="back-link-secondary">
                Continue Shopping
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
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .status-badge {
          display: inline-block;
          background-color: #f0fdf4;
          color: #16a34a;
          font-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 border border-green-100;
        }

        .success-message {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .login-context-card {
          background-color: #000000;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .context-title {
           font-size: 10px;
           font-black uppercase tracking-widest text-[#c5a358] mb-3;
        }

        .context-text {
           font-size: 12px;
           color: #ffffff;
           opacity: 0.8;
           line-height: 1.6;
           margin-bottom: 20px;
        }

        .login-action-btn {
           display: block;
           width: 100%;
           background-color: #ffffff;
           color: #000000;
           font-[10px] font-black uppercase tracking-widest py-4 rounded-xl text-center hover:bg-[#c5a358] hover:text-white transition-all;
        }

        .actions-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
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
