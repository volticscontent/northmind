"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function TermsAndConditions() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      lastUpdated="April 2026"
    >
      <p>
        These Terms & Conditions govern your use of northmind.store and your purchase of products from North Mind. By accessing our website, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our website.
      </p>

      <h2>1. General Conditions</h2>
      <p>
        We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information) may be transferred unencrypted and involve transmissions over various networks.
      </p>

      <h2>2. Pricing and Modifications</h2>
      <p>
        Prices for our premium garments are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
      </p>

      <h2>3. International Shipping, Customs & Duties (DDU)</h2>
      <p>
        For orders shipped outside of our primary logistics hubs (e.g., shipping to the European Union or the United States), products are sold on a <strong>Delivered Duty Unpaid (DDU)</strong> basis. 
      </p>
      <ul>
        <li><strong>United States:</strong> Orders under the $800 de minimis threshold typically do not incur import duties.</li>
        <li><strong>European Union & Rest of World:</strong> The customer is the importer of record and is solely responsible for paying any applicable local sales taxes, import duties, and customs clearance fees. Refusal to pay these fees will result in the shipment being returned, and a restocking/return shipping fee will be deducted from your refund.</li>
      </ul>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on this site, including but not limited to text, graphics, logos, images, and software, is the property of North Mind and is protected by international copyright laws.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        North Mind shall not be liable for any direct, indirect, incidental, punitive, or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if North Mind has been advised of the possibility of such damages.
      </p>

      <h2>6. Governing Law & Jurisdiction</h2>
      <p>
        These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of London, UK.
      </p>

      <h2>7. Contact Information</h2>
      <p>
        Questions about the Terms of Service should be sent to us at <strong>legal@northmind.store</strong>.
      </p>
    </PolicyLayout>
  );
}
