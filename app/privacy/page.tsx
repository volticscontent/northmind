"use client";

import React from "react";
import { Shield } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      icon={Shield}
      lastUpdated="April 2026"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">1. Introduction</h2>
        <p>
          At northmind.store, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit our website or make a purchase. By using our website, you agree to this policy.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">2. Information We Collect</h2>
        <p>We may collect personal details such as:</p>
        <ul className="list-disc pl-10 space-y-2">
          <li>Name and surname</li>
          <li>Email address and phone number</li>
          <li>Billing and shipping addresses</li>
          <li>Payment and order details</li>
        </ul>
        <p>We may also collect technical data such as your IP address and device type.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-10 space-y-2">
          <li>Process and deliver your orders</li>
          <li>Provide customer service</li>
          <li>Send updates</li>
          <li>Improve user experience</li>
          <li>Send marketing communications (if consented)</li>
        </ul>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">4. Data Storage and Security</h2>
        <p>Your data is stored securely and processed through encrypted payment gateways.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">5. Third-Party Services</h2>
        <p>We share limited data with trusted service providers. We do not sell your data to third parties.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">6. Your Rights</h2>
        <p>You may request access, correction, or deletion of your data. Under standard GDPR principles, you have the right to be forgotten and to access your records.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-white border-l-2 border-accent pl-6">7. Updates</h2>
        <p>Updates will be posted on this page with a revised &quot;Last Updated&quot; timestamp.</p>
      </div>

      <div className="space-y-6 pt-6 bg-white/5 p-8 rounded-2xl border border-white/10">
        <h2 className="text-lg font-medium text-white mb-4">Contact</h2>
        <p className="text-sm text-white/60 mb-4">For any inquiries regarding your data, please reach out to our concierge:</p>
        <a href="mailto:support@northmind.store" className="text-accent font-bold tracking-widest uppercase hover:underline text-xs">
          support@northmind.store
        </a>
      </div>
    </PolicyLayout>
  );
}
