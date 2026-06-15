"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plane, MapPin, RotateCcw, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    id: 1,
    question: "What are the delivery times?",
    icon: <Plane size={18} className="text-white/60" />,
    answer: (
      <>
        We dispatch orders within <strong>1–3 business days</strong>.<br />
        <br />
        UK delivery typically takes <strong>10–20 business days</strong>,
        depending on customs and courier workload.
      </>
    ),
  },
  {
    id: 2,
    question: "How can I track my order?",
    icon: <MapPin size={18} className="text-white/60" />,
    answer: (
      <>
        You will receive a <strong>tracking number by email</strong> once your
        parcel has been shipped.
        <br />
        <br />
        If tracking has not updated, please allow 5–7 days from dispatch.
      </>
    ),
  },
  {
    id: 3,
    question: "What is your returns policy?",
    icon: <RotateCcw size={18} className="text-white/60" />,
    answer: (
      <>
        We accept returns within <strong>14 days</strong> of delivery,
        provided the item is unused and in its original condition.
        <br />
        <br />
        To start a return, contact: <strong>support@northmind.store</strong>
      </>
    ),
  },
  {
    id: 4,
    question: "What should I do if my item is faulty?",
    icon: <HelpCircle size={18} className="text-white/60" />,
    answer: (
      <>
        If your product arrives damaged or defective, please email us within{" "}
        <strong>7 days</strong> of delivery with photos.
        <br />
        <br />
        We will promptly arrange a replacement or refund.
      </>
    ),
  },
];

export function ProductFaqBox() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">
          Frequently Asked
        </h3>
        <div className="h-[1px] flex-grow bg-white/10" />
      </div>
      <div className="grid grid-cols-1 gap-3">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className={`overflow-hidden transition-all duration-300 border-b ${activeFaq === faq.id ? "border-white/30 bg-white/[0.02]" : "border-white/10 bg-transparent"
              }`}
          >
            <button
              onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left group"
              aria-expanded={activeFaq === faq.id}
            >
              <div className="flex items-center gap-4">
                <span className="p-0 transition-colors">
                  {faq.icon}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                  {faq.question}
                </span>
              </div>
              {activeFaq === faq.id ? (
                <ChevronUp size={16} className="text-accent" />
              ) : (
                <ChevronDown size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
              )}
            </button>
            <AnimatePresence>
              {activeFaq === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <div className="px-6 pb-6 pt-2 text-xs leading-relaxed text-white/60 max-w-md ml-14">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
