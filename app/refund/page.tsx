"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Returns & Refunds"
      lastUpdated="April 2026"
    >
      <p>
        At North Mind, we construct garments intended to last a lifetime. If, however, a piece does not meet your expectations, our return protocol is straightforward and globally compliant.
      </p>

      <h2>1. Global 14-Day Return Policy</h2>
      <p>
        We accept returns on all unworn, unaltered items within 14 days of delivery. The asset must be returned in its original condition, with all tags attached and in the original premium packaging. Items that show signs of wear, alteration, or damage will be rejected and sent back to the customer.
      </p>

      <h2>2. EU/UK Right of Withdrawal</h2>
      <p>
        In accordance with the Consumer Rights Directive for EU and UK customers, you have the legal right to cancel your contract and return your purchase for any reason within 14 days from the day you, or a designated third party, receives the goods. To exercise this right, you must inform us via a clear statement to <strong>returns@northmind.store</strong> before the period expires.
      </p>

      <h2>3. Return Shipping & International Fees</h2>
      <p>
        Customers are responsible for the cost of return shipping. We strongly advise using a trackable premium courier service (e.g., DHL, FedEx), as we cannot be held liable for assets lost in transit.
      </p>
      <p>
        <strong>International Returns (US/EU):</strong> Any original import duties or taxes paid (if applicable) are non-refundable by North Mind. You may need to contact your local customs bureau directly to claim a refund on duties for returned goods.
      </p>

      <h2>4. Refund Processing</h2>
      <p>
        Upon receiving and inspecting the returned asset, we will notify you of the approval or rejection of your refund. Approved refunds are processed immediately back to the original method of payment. Please allow 5-10 business days for the funds to clear, depending on your financial institution.
      </p>

      <h2>5. Exemptions</h2>
      <p>
        For hygienic reasons, certain intimate items or bespoke/custom-tailored garments are strictly non-refundable unless a manufacturing defect is present.
      </p>
    </PolicyLayout>
  );
}
