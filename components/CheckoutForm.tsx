import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Search, Lock, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { trackBeginCheckout } from "@/lib/tracking";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";

const countries = [
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
];

export type OrderItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  discount?: number;
};

interface CheckoutFormProps {
  items: OrderItem[];
  clientSecret: string;
}

export default function CheckoutForm({ items, clientSecret }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session, status } = useSession();

  // Form states (Contact and Address)
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [country, setCountry] = useState("UK");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [county, setCounty] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const icTriggered = React.useRef(false);

  // Auto-fill form if session exists
  useEffect(() => {
    if (session?.user) {
      if (session.user.email) setEmail(session.user.email);
      // Here we could extract phone from DB if available, keep flow
      if (session.user.name) {
        const parts = session.user.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
    }
  }, [session]);

  // Control states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Total calculations
  // Subtotal is based on ORIGINAL price so that "Subtotal - Savings = Total" makes sense
  const subtotal = items.reduce(
    (acc, item) => acc + ( (item.discount ? (item.price + item.discount) : item.price) * item.quantity ),
    0,
  );
  
  const totalDiscounts = items.reduce(
    (acc, item) => acc + (item.discount || 0) * item.quantity,
    0,
  );
  
  // Total is always the sum of what the customer actually pays (already discounted)
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Early trigger for Initiate Checkout (as soon as basic info is filled)
  const handleEarlyIC = React.useCallback(async () => {
    if (icTriggered.current || !email || !phone || !firstName) return;
    
    icTriggered.current = true;
    if (email) localStorage.setItem('nm_customer_email', email);
    const utmifyId = localStorage.getItem('utmify_id') || localStorage.getItem('success-id');
    const utmSource = localStorage.getItem('utm_source');

    try {
      console.log('🚀 FRONTEND: Sending Early IC Tracking (Backend + Pixel)...');
      
      // Browser Pixel Tracking
      trackBeginCheckout(
        items.map(i => ({ id: i.id, title: i.name, price: i.price, quantity: i.quantity })),
        total
      );

      await axios.post(`${API_URL}/api/payment/track-ic`, {
        customer: {
          name: `${firstName} ${lastName}`,
          email,
          phone: `${selectedCountry.code}${phone}`
        },
        trackingParameters: {
          utmify_id: utmifyId,
          utm_source: utmSource,
          utm_medium: localStorage.getItem('utm_medium'),
          utm_campaign: localStorage.getItem('utm_campaign')
        },
        amount: total,
        products: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, priceInCents: Math.round(i.price * 100) }))
      });
      console.log('✅ Early IC Tracking Sent Successfully');
    } catch (e) {
      console.warn('⚠️ Early IC failed', e);
      icTriggered.current = false; // Permite tentar novamente no Pay Now
    }
  }, [email, phone, firstName, lastName, selectedCountry, total, items]);

  // Formatação de moeda - British Heritage uses GBP
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  // Manual Checkout submission handling (Div simulating form)
  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // --- Track Initiate Checkout (IC) S2S (Final Fallback) ---
      const utmifyId = localStorage.getItem('utmify_id') || localStorage.getItem('success-id');
      const utmSource = localStorage.getItem('utm_source');
      
      if (!icTriggered.current) {
        icTriggered.current = true;
        axios.post(`${API_URL}/api/payment/track-ic`, {
          customer: {
            name: `${firstName} ${lastName}`,
            email,
            phone: `${selectedCountry.code}${phone}`
          },
          trackingParameters: {
            utmify_id: utmifyId,
            utm_source: utmSource,
            utm_medium: localStorage.getItem('utm_medium'),
            utm_campaign: localStorage.getItem('utm_campaign')
          },
          amount: total,
          products: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, priceInCents: Math.round(i.price * 100) }))
        }).catch(e => console.warn('IC tracking fallback failed', e));
      }

      // 1. Create Order in Database (PENDING/PAID)
      const cleanTotal = Number(total.toFixed(2));
      const { data: orderResponse } = await axios.post(`${API_URL}/api/orders`, {
        items,
        total: cleanTotal,
        status: "PAID", // Simplified for this direct flow
        userEmail: session?.user?.email, // Sends session email if logged in
        customerInfo: {
          email,
          phone,
          firstName,
          lastName,
          address,
          city,
          postcode,
          country,
          county,
          complement
        }
      });

      // 2. Trigger validation
      const { error: submitError, submission } = await (elements as any).submit();
      if (submitError) {
        setErrorMessage(
          submitError.message || "Payment validation error.",
        );
        setIsLoading(false);
        return;
      }

      const intentId = clientSecret ? clientSecret.split('_secret')[0] : null;

      // --- CUSTOM PAYMENT METHOD HANDLE (NORTHMIND) ---
      if (submission?.selectedPaymentMethod?.type === "cpmt_northmind") {
        console.log("🚀 Custom Payment Method Selected: northmind");
        try {
          // Track purchase as 'northmind' directly
          await axios.post(`${API_URL}/api/payment/track-purchase`, {
            intentId: intentId,
            paymentMethod: "northmind",
            utmifyIdManual: utmifyId
          });

          // Custom Redirect for Northmind
          window.location.href = `${window.location.origin}/success?o=${orderResponse.id}&u=${orderResponse.userId}&utmify_id=${utmifyId}&method=northmind`;
          return;
        } catch (e) {
          console.warn("Northmind tracking error", e);
          // Fallback: stay on page or proceed to redirect anyway? 
          // Usually redirect as order is already PAGO in our DB
          window.location.href = `${window.location.origin}/success?o=${orderResponse.id}&u=${orderResponse.userId}&utmify_id=${utmifyId}`;
          return;
        }
      }

      // 3. Update Stripe Metadata (For standard card/BNPL methods)
      if (intentId) {
        await axios.post(`${API_URL}/api/payment/update-metadata`, {
          intentId,
          metadata: {
            customer_name: `${firstName} ${lastName}`,
            customer_email: email,
            customer_phone: `${selectedCountry.code} ${phone}`,
            utmify_id: utmifyId,
            utm_source: utmSource,
            order_id: orderResponse.id,
            user_id: orderResponse.userId
          }
        });
      }

      // 4. Confirm Stripe Payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success?o=${orderResponse.id}&u=${orderResponse.userId}&utmify_id=${utmifyId}`,
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${lastName}`,
              email: email,
              phone: `${selectedCountry.code} ${phone}`,
              address: {
                line1: address,
                line2: complement || undefined,
                city: city,
                state: county,
                postal_code: postcode,
                country: country,
              },
            },
          },
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(
            error.message || "Card/Validation error.",
          );
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      }
    } catch (err: any) {
      console.error("CHECKOUT_SUBMIT_ERROR:", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setErrorMessage(serverMessage || "Error processing order. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="checkout-container">
      {/* 
        The structure uses flexbox row-reverse on desktop to maintain 
        visual fidelity, but with CSS we manipulate order or flex-direction 
        on mobile to show the summary on top.
      */}

      {/* --- LEFT COLUMN (Form) --- */}
      <div className="left-col">
        <div className="left-content">
          <div className="section-header">
            <h2 className="section-title text-lg">Contact</h2>
            {status !== "authenticated" ? (
              <Link href="/login?callbackUrl=/checkout" className="login-link text-lg text-black">
                Sign in
              </Link>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                Logged in as {session?.user?.name?.split(" ")[0]}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="input-group">
              <input
                type="email"
                className="input-field"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEarlyIC}
                required
              />
            </div>

            <div className="relative flex">
              <button
                type="button"
                onClick={() => setShowCountrySelector(!showCountrySelector)}
                className="flex items-center gap-2 px-4 bg-black border border-gray-300 rounded-l-md border-r-0 transition-all z-10"
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <ChevronDown size={14} className={`text-black transition-transform ${showCountrySelector ? 'rotate-180' : ''}`} />
              </button>
              <input
                type="tel"
                className="input-field rounded-l-none"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={handleEarlyIC}
                required
              />

              <AnimatePresence>
                {showCountrySelector && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCountrySelector(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl overflow-hidden z-50 shadow-2xl ring-1 ring-black ring-opacity-5"
                    >
                      <div className="max-h-60 overflow-y-auto py-1">
                        {countries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setShowCountrySelector(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 text-black hover:bg-black hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{c.flag}</span>
                              <span className="text-sm font-medium">{c.name}</span>
                            </div>
                            <span className="text-xs opacity-50 font-mono">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="section-header mt-8">
            <h2 className="section-title">Delivery</h2>
          </div>
          <div className="input-group">
            <select
              className="input-field select-field"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="UK">United Kingdom</option>
            </select>
          </div>

          <div className="row-inputs">
            <input
              type="text"
              className="input-field"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={handleEarlyIC}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={handleEarlyIC}
              required
            />
          </div>

          <div className="input-group search-input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Search className="search-icon" size={18} />
          </div>

          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Apartment, suite, etc. (optional)"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>

          <div className="row-inputs">
            <input
              type="text"
              className="input-field"
              placeholder="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="County (optional)"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="save-info"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />
            <label htmlFor="save-info">
              Save this information for next time
            </label>
          </div>

          <div className="section-header mt-8">
            <h2 className="section-title">Shipping method</h2>
          </div>
          <div className="shipping-card selected">
            <div className="shipping-left">
              <span className="shipping-method">Shipping</span>
            </div>
            <span className="shipping-price">FREE</span>
          </div>

          <div className="section-header mt-8 flex-col-start">
            <h2 className="section-title ">Payment</h2>
            <div className="secure-text">
              <Lock size={12} className="secure-icon" />
              <span>All transactions are secure and encrypted.</span>
            </div>
          </div>

          <div className="payment-wrapper">
            {/* PaymentElement - Stripe Tabs Layout configurado no Componente Pai */}
            <PaymentElement
              options={{
                layout: "accordion", 
                wallets: {
                  applePay: "auto",
                  googlePay: "auto",
                },
                fields: {
                  billingDetails: { name: "never", email: "never" },
                },
              }}
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="submit-section">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !stripe || !elements}
              className="submit-btn"
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <span>Pay now</span>
                  <span>{formatCurrency(total)}</span>
                </>
              )}
            </button>
          </div>

          <div className="footer-links">
            <a href="#">Refund policy</a>
            <a href="#">Shipping policy</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN (Order Summary) --- */}
      <div className="right-col">
        <div className="right-content">
          <div className="order-items">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="item-row">
                <div className="item-image-wrapper">
                  <div className="item-badge">{item.quantity}</div>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-image"
                  />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">{item.description}</div>
                </div>
                <div className="item-price">
                  {item.discount && (
                    <span className="item-discount">
                      (-{formatCurrency(item.discount)})
                    </span>
                  )}
                  <span>
                    {formatCurrency(
                      item.price * item.quantity,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span className="total-value">{formatCurrency(subtotal)}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Shipping</span>
              <span className="total-value green">£0.00</span>
            </div>
            {totalDiscounts > 0 && (
              <div className="total-row">
                <span className="total-label">Total savings</span>
                <span className="total-value savings-value">
                  {formatCurrency(totalDiscounts)}
                </span>
              </div>
            )}
            <div className="total-row final-total">
              <span className="total-label">Total</span>
              <span className="total-value bold-total">
                <span className="currency-label">GBP</span>{" "}
                {formatCurrency(total)}
              </span>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-container {
          display: flex;
          flex-direction: row;
          min-height: 100vh;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background-color: #f5f5f5;
        }

        .left-col {
          flex: 0 0 60%;
          background-color: #ffffff;
          padding: 64px 40px;
          display: flex;
          justify-content: flex-end;
          border-right: 1px solid #e5e7eb;
          justify-content: center;
        }

        .left-content {
          max-width: 600px;
          width: 100%;
        }

        .right-col {
          flex: 0 0 40%;
          background-color: #000000;
          padding: 64px 30px;
          display: flex;
          justify-content: flex-start;
        }

        .right-content {
          max-width: 400px;
          width: 100%;
          position: sticky;
          top: 64px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .flex-col-start {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .section-title {
          font-size: 1.125rem; /* text-xl */
          font-weight: 600;
          color: #374151  ;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .login-link {
          color: #000000;
          text-decoration: none;
          font-size: 1.125rem; /* text-lg */
        }

        .login-link:hover {
          text-decoration: underline;
        }

        .mt-8 {
          margin-top: 32px;
        }

        /* Forms / Inputs */
        .input-group {
          margin-bottom: 12px;
          position: relative;
        }

        .row-inputs {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .row-inputs > * {
          flex: 1;
        }

        .input-field {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: #ffffff;
          font-size: 16px;
          color: #111827;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
          box-sizing: border-box;
        }

        .input-field:focus {
          outline: none;
          border-color: #000000;
          box-shadow: 0 0 0 1px #000000;
        }

        .input-field::placeholder {
          color: #9ca3af;
        }

        .select-field {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          right: 14px;
          color: #9ca3af;
          pointer-events: none;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          margin-bottom: 8px;
          color: #000000;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #defad9;
          accent-color: #000000;
          cursor: pointer;
        }

        .checkbox-group label {
          font-size: 14px;
          color: #000000;
          cursor: pointer;
        }

        .shipping-card {
          border: 1px solid #d1dbd3;
          border-radius: 6px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #e4e4e4;
        }

        .shipping-card.selected {
          border-color: #000000;
          background-color: rgb(255, 255, 255);
          backdrop-filter: blur(10px);
        }

        .shipping-method {
          font-size: 14px;
          color: #000000;
        }

        .shipping-price {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          background-color: #1eaa25;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .secure-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;
        }

        .secure-icon {
          color: #9ca3af;
        }

        .payment-wrapper {
          margin-top: 16px;
        }

        .submit-section {
          margin-top: 32px;
          margin-bottom: 24px;
        }

        .submit-btn {
          width: 100%;
          background-color: #000000;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 18px 20px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }

        .submit-btn:hover {
          background-color: #ffffff;
          border: 1px solid #1dd81d;
          color: #000000;
        }

        .submit-btn:active {
          transform: scale(0.98);
          opacity: 0.9;
        }

        .submit-btn:disabled {
          background-color: #1dd81d;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin-top: 16px;
          padding: 12px;
          background-color: #fef2f2;
          border-radius: 6px;
          border: 1px solid #f87171;
        }

        /* Order Items Styling */
        .order-items {
          margin-bottom: 24px;
        }

        .item-row {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .item-image-wrapper {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 8px;
          border: 1px solid #ffffff;
          background-color: #ffffff;
          padding: 4px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }

        .item-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: black;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .item-details {
          flex: 1;
          margin-left: 14px;
        }

        .item-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }

        .item-desc {
          font-size: 12px;
          color: white;
        }

        .item-price {
          font-size: 14px;
          color: white;
          text-align: right;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
        }

        .item-discount {
          text-decoration: line-through;
          color: #e4e4e4;
          font-size: 12px;
        }

        .totals-section {
          padding-top: 24px;
          border-top: 1px solid #d1d5db;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: white;
        }

        .total-value {
          color: white;
        }

        .total-value.green {
          color: #ffffff;
        }

        .savings-value {
          color: #16a34a;
        }

        .final-total {
          margin-top: 24px;
          align-items: center;
        }

        .final-total .total-label {
          font-size: 16px;
          color: #ffffff;
        }

        .bold-total {
          font-size: 24px;
          font-weight: 600;
        }

        .currency-label {
          font-size: 14px;
          color: #b9b9b9;
          font-weight: normal;
          margin-right: 4px;
        }

        .footer-links {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #000000;
          font-size: 12px;
          text-decoration: none;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        /* Responsividade (Mobile: Abaixo de 768px -> 1 coluna com resumo primeiro) */
        @media (max-width: 768px) {
          .checkout-container {
            flex-direction: column-reverse; /* Resumo primeiro (em cima) - reverte o DOM flexível */
          }

          .left-col {
            padding: 32px 16px;
            border-right: none;
            justify-content: center;
          }

          .right-col {
            padding: 32px 16px;
            justify-content: center;
            border-bottom: 1px solid #d1d5db;
          }

          .right-content {
            position: static;
          }

          .row-inputs {
            flex-direction: column;
            gap: 12px;
          }

          .submit-btn {
            padding: 16px 20px;
            font-size: 16px;
            min-height: 52px;
          }
        }
      `}</style>
    </div>
  );
}
