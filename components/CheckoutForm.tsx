"use client";

import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Search, Lock } from "lucide-react";

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
}

export default function CheckoutForm({ items }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  // Estados do formulário (Contato e Endereço)
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [country, setCountry] = useState("BR");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Cálculo de totais
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalDiscounts = items.reduce(
    (acc, item) => acc + (item.discount || 0) * item.quantity,
    0,
  );
  const total = subtotal - totalDiscounts;

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Busca do ViaCEP
  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
        );
        const data = await response.json();
        if (!data.erro) {
          setAddress(data.logradouro || "");
          setCity(data.localidade || "");
          setStateUF(data.uf || "");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // Tratamento da submissão manual do Checkout (Div simulando formulário)
  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js ainda não carregou.
      return;
    }

    if (
      !emailOrPhone ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !cep
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Trigger validação de form no PaymentElement antes de seguir
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(
          submitError.message || "Erro de validação do pagamento.",
        );
        setIsLoading(false);
        return;
      }

      // Confirma e processa o pagamento com Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/sucesso`,
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${lastName}`,
              email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
              phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
              address: {
                line1: address,
                line2: complement || undefined,
                city: city,
                state: stateUF,
                postal_code: cep,
                country: country,
              },
            },
          },
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(
            error.message || "Ocorreu um erro no cartão/validação.",
          );
        } else {
          setErrorMessage("Ocorreu um erro inesperado.");
        }
      }
    } catch (err: any) {
      setErrorMessage("Erro ao processar o pagamento.");
    }

    setIsLoading(false);
  };

  return (
    <div className="checkout-container">
      {/* 
        A estrutura utiliza flexbox row-reverse no desktop para manter 
        a fidelidade visual, mas com CSS manipulamos o order ou o flex-direction 
        no mobile para mostrar o resumo por cima.
      */}

      {/* --- COLUNA ESQUERDA (Formulário) --- */}
      <div className="left-col">
        <div className="left-content">
          <div className="section-header">
            <h2 className="section-title text-lg">Contact</h2>
            <a href="#" className="login-link text-lg">
              Sign in
            </a>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="E-mail ou número de celular"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
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
              {/* Adicionar mais se necessário */}
            </select>
          </div>

          <div className="row-inputs">
            <input
              type="text"
              className="input-field"
              placeholder="Nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-group search-input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder="Endereço"
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
              placeholder="Número / Complemento (opcional)"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>

          <div className="row-inputs">
            <input
              type="text"
              className="input-field"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
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
              Salvar informações para a próxima vez
            </label>
          </div>

          <div className="section-header mt-8">
            <h2 className="section-title">Shipping method</h2>
          </div>
          <div className="shipping-card selected">
            <div className="shipping-left">
              <span className="shipping-method">Frete Grátis</span>
            </div>
            <span className="shipping-price">GRÁTIS</span>
          </div>

          <div className="section-header mt-8 flex-col-start">
            <h2 className="section-title ">Payment</h2>
            <div className="secure-text">
              <Lock size={12} className="secure-icon" />
              <span>Todas as transações são seguras e criptografadas.</span>
            </div>
          </div>

          <div className="payment-wrapper">
            {/* PaymentElement - Stripe Tabs Layout configurado no Componente Pai */}
            <PaymentElement
              options={{
                paymentMethodOrder: ["pix", "card", "boleto"],
                fields: {
                  billingDetails: { name: "never", email: "never" },
                },
                wallets: {
                  applePay: "never",
                  googlePay: "never",
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
                  <span>Finalizar pedido</span>
                  <span>{formatCurrency(total)}</span>
                </>
              )}
            </button>
          </div>

          <div className="footer-links">
            <a href="#">Política de reembolso</a>
            <a href="#">Política de frete</a>
            <a href="#">Política de privacidade</a>
            <a href="#">Termos de serviço</a>
          </div>
        </div>
      </div>

      {/* --- COLUNA DIREITA (Resumo do Pedido) --- */}
      <div className="right-col">
        <div className="right-content">
          <div className="order-items">
            {items.map((item) => (
              <div key={item.id} className="item-row">
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
                      (item.price - (item.discount || 0)) * item.quantity,
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
              <span className="total-label">Frete</span>
              <span className="total-value">GRÁTIS</span>
            </div>
            {totalDiscounts > 0 && (
              <div className="total-row">
                <span className="total-label">Economia total</span>
                <span className="total-value savings-value">
                  {formatCurrency(totalDiscounts)}
                </span>
              </div>
            )}
            <div className="total-row final-total">
              <span className="total-label">Total</span>
              <span className="total-value bold-total">
                <span className="currency-label">BRL</span>{" "}
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
        }

        .left-content {
          max-width: 600px;
          width: 100%;
        }

        .right-col {
          flex: 0 0 40%;
          background-color: #f5f5f5;
          padding: 64px 40px;
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
          color: #374151;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .login-link {
          color: #2563eb;
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
          font-size: 14px;
          color: #111827;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
          box-sizing: border-box;
        }

        .input-field:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
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
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #d1d5db;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .checkbox-group label {
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .shipping-card {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #ffffff;
        }

        .shipping-card.selected {
          border-color: #2563eb;
          background-color: rgba(37, 99, 235, 0.03);
        }

        .shipping-method {
          font-size: 14px;
          color: #111827;
        }

        .shipping-price {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
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
          background-color: #2563eb;
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
          background-color: #1d4ed8;
        }

        .submit-btn:disabled {
          background-color: #93c5fd;
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
          border: 1px solid #d1d5db;
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
          background-color: rgba(114, 114, 114, 0.9);
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
          color: #111827;
          margin-bottom: 4px;
        }

        .item-desc {
          font-size: 12px;
          color: #6b7280;
        }

        .item-price {
          font-size: 14px;
          color: #111827;
          text-align: right;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
        }

        .item-discount {
          text-decoration: line-through;
          color: #f87171;
          font-size: 12px;
        }

        .discount-section {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          padding-top: 24px;
          border-top: 1px solid #d1d5db;
        }

        .coupon-input {
          flex: 1;
        }

        .apply-btn {
          background-color: #e5e7eb;
          color: #9ca3af;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: not-allowed;
          transition: background-color 0.2s;
        }

        .apply-btn:hover {
          /* Permitir visual de disabled / ou ativar caso tenha lógica */
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
          color: #4b5563;
        }

        .total-value {
          color: #111827;
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
          color: #111827;
        }

        .bold-total {
          font-size: 24px;
          font-weight: 600;
        }

        .currency-label {
          font-size: 14px;
          color: #6b7280;
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
          color: #2563eb;
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
            border-bottom: 1px solid #d1d5db; /* Separador para o topo */
          }

          .right-content {
            position: static;
          }

          .row-inputs {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
