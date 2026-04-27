"use client";

import React from "react";
import { FileText } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function TermsConditions() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      icon={FileText}
      lastUpdated="April 2026"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">1. Introduction</h2>
        <p>By using northmind.store, you agree to these Terms. They represent a legal binding contract between you and North Mind.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">2. General Information</h2>
        <p>We operate as an online retail store for premium heritage garments. Product descriptions and prices may be subject to changes without prior notice.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">3. Payments</h2>
        <p>All payments are processed securely via trusted third-party payment gateways (e.g., Stripe). We do not store sensitive credit card data on our servers.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">4. Shipping</h2>
        <p>Estimated delivery for global orders is 7–15 business days. We are not responsible for customs delays or international duties incurred at the destination.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">5. Returns</h2>
        <p>A 14-day return policy is in effect for all unworn assets in original packaging. Damaged or used items do not qualify for a refund.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">6. Pricing</h2>
        <p>All listed prices are in British Pounds (GBP) and include applicable taxes unless stated otherwise.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">7. Intellectual Property</h2>
        <p>All content on this website, including designs, images, and text, belongs exclusively to North Mind and is protected by copyright law.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">8. Liability</h2>
        <p>North Mind is not liable for indirect or consequential damages arising from the use of our platform or products.</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">9. Contact</h2>
        <p>For any legal or technical inquiries, please reach out to <strong className="text-accent">support@northmind.store</strong>.</p>
      </div>
    </PolicyLayout>
  );
}
