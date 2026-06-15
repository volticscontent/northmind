"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface ProductAccordionProps {
  items: AccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="space-y-4 pt-5 px-1">
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`overflow-hidden transition-all duration-500 border-b ${activeId === item.id
              ? "border-white/30"
              : "border-white/10"
              }`}
          >
            <button
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left group"
              aria-expanded={activeId === item.id}
            >
              <div className="flex items-center gap-4">
                <span className={`p-0 transition-all duration-500 ${activeId === item.id
                  ? "text-white"
                  : "text-white/60 group-hover:text-white"
                  }`}>
                  {item.icon}
                </span>
                <span className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${activeId === item.id ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}>
                  {item.title}
                </span>
              </div>
              {activeId === item.id ? (
                <ChevronUp size={16} className="text-accent" />
              ) : (
                <ChevronDown size={16} className="text-white/90 group-hover:text-white/60" />
              )}
            </button>
            <AnimatePresence>
              {activeId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="px-4 py-2 bg-white/5 border-t border-white/10">
                    <div className="text-sm md:text-base leading-relaxed text-white/80 font-medium">
                      {item.content}
                    </div>
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
