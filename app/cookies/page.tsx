"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function CookiesPolicy() {
  return (
    <PolicyLayout
      title="Cookies Protocol"
      lastUpdated="April 2026"
    >
      <p>
        To ensure a seamless, personalized experience, northmind.store utilizes cookies and similar tracking technologies. This policy outlines how we use them and your rights under global privacy directives, including the ePrivacy Directive (EU) and GDPR.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently, as well as to provide reporting information to the site owners.
      </p>
      
      <h2>2. How We Use Them</h2>
      <p>Our digital boutique deploys cookies for the following purposes:</p>
      <ul>
        <li><strong>Strictly Necessary:</strong> Essential for the operation of the site, such as maintaining your session, securely processing payments, and preserving your cart contents.</li>
        <li><strong>Performance & Analytics:</strong> To understand how visitors engage with our site, enabling us to refine the user experience (e.g., via Google Analytics).</li>
        <li><strong>Marketing & Targeting:</strong> To deliver relevant advertisements and track the efficiency of our campaigns across platforms (e.g., Meta Pixel, UTMify).</li>
      </ul>

      <h2>3. Consent & Control</h2>
      <p>
        Upon your first visit from a regulated jurisdiction, you are presented with a consent banner. You reserve the right to accept or decline non-essential cookies. You can also modify your browser settings to block or delete cookies at any time; however, disabling strictly necessary cookies may impede your ability to complete a purchase.
      </p>

      <h2>4. Third-Party Tracking</h2>
      <p>
        Some of our elite partners may set third-party cookies on your device. We hold our partners to rigorous data protection standards, but we do not have direct control over these third-party mechanisms.
      </p>
    </PolicyLayout>
  );
}
