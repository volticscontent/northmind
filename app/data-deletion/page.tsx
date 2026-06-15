"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function DataDeletionPolicy() {
  return (
    <PolicyLayout
      title="Data Erasure"
      lastUpdated="April 2026"
    >
      <p>
        Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA), you possess the "Right to be Forgotten." North Mind respects your autonomy over your personal data.
      </p>

      <h2>1. The Right to Erasure</h2>
      <p>
        You may request the complete deletion of your personal data from our systems. Upon validation of your request, we will permanently erase your profile, purchase history (where legally permissible), and contact details from our active databases.
      </p>
      
      <h2>2. Exemptions</h2>
      <p>Please note that we may be legally required to retain certain data points, including:</p>
      <ul>
        <li>Transaction records necessary for tax, accounting, and legal auditing purposes.</li>
        <li>Information required to fulfill an active contract (e.g., an order currently in transit).</li>
        <li>Data necessary to establish, exercise, or defend legal claims.</li>
      </ul>

      <h2>3. Execution Timeline</h2>
      <p>
        Upon receiving a valid erasure request, we will process the deletion across our primary systems and third-party processors within 30 days. You will receive a final confirmation once the protocol is complete.
      </p>

      <h2>4. Submit a Request</h2>
      <p>
        To exercise your right to data erasure, you must submit a formal request from the email address associated with your account to our Data Protection Officer at:
      </p>
      <p>
        <strong>data@northmind.store</strong>
      </p>
    </PolicyLayout>
  );
}
