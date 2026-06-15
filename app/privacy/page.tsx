"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="April 2026"
    >
      <p>
        At North Mind ("we", "our", or "us"), your privacy is a priority. This Privacy Policy details the information we collect, how it is used, and the strict protocols we follow to ensure its protection when you visit northmind.store or engage with our services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information to deliver a premium experience, including:</p>
      <ul>
        <li><strong>Identity & Contact Data:</strong> Name, billing/shipping addresses, email address, and telephone number.</li>
        <li><strong>Financial Data:</strong> Payment details (processed securely via Stripe; we do not store full credit card numbers).</li>
        <li><strong>Technical Data:</strong> IP address, browser type, time zone setting, operating system, and platform.</li>
        <li><strong>Usage Data:</strong> Information about how you navigate our website and interact with our products.</li>
      </ul>

      <h2>2. Global Compliance (GDPR & CCPA)</h2>
      <p>As an international brand operating across the UK, EU, and US, we adhere to the highest standards of data protection:</p>
      <ul>
        <li><strong>UK/EU GDPR Rights:</strong> If you are a resident of the European Economic Area (EEA) or the United Kingdom, you have the right to access the personal information we hold about you, to port it to a new service, and to ask that your personal information be corrected, updated, or erased (the "Right to be Forgotten"). If you would like to exercise these rights, please contact us.</li>
        <li><strong>California Residents (CCPA/CPRA):</strong> We do not "sell" your personal information as defined by California law. You have the right to request access to your data, request deletion, and opt-out of sharing for cross-context behavioral advertising.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>Your data is strictly utilized to:</p>
      <ul>
        <li>Process transactions and fulfill your orders efficiently.</li>
        <li>Provide elite customer service and personalized support.</li>
        <li>Enhance, secure, and monitor the performance of our digital boutique.</li>
        <li>Send exclusive marketing communications (only if explicit consent has been provided, which can be withdrawn at any time).</li>
      </ul>

      <h2>4. Data Retention & Security</h2>
      <p>
        We employ advanced encryption and security measures to protect your data. We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
      </p>

      <h2>5. Third-Party Disclosures</h2>
      <p>
        We exclusively share necessary data with vetted partners (e.g., couriers, secure payment gateways like Stripe) to fulfill your contract. We do not engage in unauthorized data brokerage.
      </p>

      <h2>6. Contact the Data Officer</h2>
      <p>
        For inquiries regarding this policy or to exercise your rights, please direct your correspondence to our legal department:
      </p>
      <p>
        <strong>Email:</strong> legal@northmind.store<br />
        <strong>Address:</strong> North Mind Legal Dept, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom
      </p>
    </PolicyLayout>
  );
}
