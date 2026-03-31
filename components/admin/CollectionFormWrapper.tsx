"use client";

import { useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import { CollectionForm } from "./CollectionForm";

interface CollectionFormWrapperProps {
  collection?: any;
  products: any[];
  isEdit?: boolean;
}

export function CollectionFormWrapper({ collection, products, isEdit }: CollectionFormWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 group transition-all cursor-pointer ${
          isEdit 
            ? 'p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white bg-transparent border-none' 
            : 'bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 shadow-xl shadow-white/5 border-none'
        }`}
      >
        {isEdit ? <Edit3 size={16} /> : (
          <>
            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            New Collection
          </>
        )}
      </button>

      {isOpen && (
        <CollectionForm 
          collection={collection} 
          products={products} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
