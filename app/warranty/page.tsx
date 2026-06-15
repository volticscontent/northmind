"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function WarrantyPolicy() {
  return (
    <PolicyLayout
      title="Warranty & Guarantee"
      lastUpdated="April 2026"
    >
      <p>
        North Mind garments are engineered with uncompromising standards. We stand behind the craftsmanship and integrity of every piece that leaves our atelier. 
      </p>

      <h2>1. The Manufacturing Guarantee</h2>
      <p>
        All North Mind products carry a strict guarantee against manufacturing defects in materials and workmanship. If a product fails due to a manufacturing defect, we will repair the item free of charge, or replace it, at our discretion. 
      </p>
      
      <h2>2. Statutory Rights (EU/UK)</h2>
      <p>
        For customers within the European Union and the United Kingdom, this commercial guarantee is provided in addition to your statutory legal rights, which mandate that goods must be as described, fit for purpose, and of satisfactory quality for up to two years.
      </p>

      <h2>3. What Is Not Covered</h2>
      <p>
        Our guarantee does not cover:
      </p>
      <ul>
        <li>Normal wear and tear resulting from standard usage.</li>
        <li>Damage caused by accident, negligence, or improper care (e.g., ignoring dry-cleaning instructions).</li>
        <li>Natural fading of colors or breakdown of materials over extended time and use.</li>
        <li>Modifications or alterations performed by third-party tailors.</li>
      </ul>

      <h2>4. Claim Process</h2>
      <p>
        To initiate a warranty evaluation, please contact <strong>support@northmind.store</strong> with detailed photographs of the defect, a description of the issue, and your original order number. Our quality assurance team will assess the claim within 48 hours.
      </p>
    </PolicyLayout>
  );
}
