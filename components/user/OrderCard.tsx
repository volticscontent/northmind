"use client";

import { useState } from "react";
import { ChevronDown, Package, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Defining the minimum necessary for the interface to understand input
interface ProductSnippet {
  id: string;
  nome: string;
  preco: number;
  fotos: string[];
}

interface OrderCardProps {
  pedido: {
    id: string;
    dataCompra: Date;
    status: string;
    totalAmmount: number;
    produtosIds: string[];
  };
  productsDict: Record<string, ProductSnippet>; // Product dictionary ({ "id_123": {...data} })
}

export function OrderCard({ pedido, productsDict }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Map order products using the dictionary
  const orderProducts = pedido.produtosIds
    .map(id => productsDict[id])
    .filter(Boolean); // Remove nulls in case a product was deleted from central database

  // As a visual simplification, we group by key:
  const productCounts = orderProducts.reduce((acc, prod) => {
    if (!acc[prod.id]) {
      acc[prod.id] = { product: prod, count: 0 };
    }
    acc[prod.id].count += 1;
    return acc;
  }, {} as Record<string, { product: ProductSnippet, count: number }>);

  const uniqueItems = Object.values(productCounts);

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-all group/card">
      {/* CLICKABLE ORDER HEADER */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
            <Package size={20} className="text-accent" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Order ID</div>
            <div className="font-mono text-sm tracking-wider">#{pedido.id.slice(-8).toUpperCase()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:items-center gap-8 flex-1 md:justify-end">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1">
              <Clock size={10} /> Date
            </div>
            <div className="text-sm font-medium">{new Date(pedido.dataCompra).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Status</div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-accent">{pedido.status}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Items</div>
            <div className="text-sm font-medium">{pedido.produtosIds.length} Products</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Total</div>
            <div className="text-sm font-bold text-white">£{pedido.totalAmmount.toFixed(2)}</div>
          </div>
        </div>

        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 group-hover/card:bg-accent group-hover/card:text-black transition-all ${isExpanded ? 'rotate-180 bg-accent text-black' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {/* EXPANDABLE AREA (ACCORDION) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            <div className="p-6 bg-black/40 backdrop-blur-3xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                Order <span className="text-white">Receipt</span>
              </h4>
              
              <div className="space-y-4">
                {uniqueItems.map(({ product, count }) => (
                  <div key={product.id} className="flex items-center justify-between group/item hover:bg-white/[0.02] p-2 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                      {/* THUMBNAIL PHOTO */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/5 flex-shrink-0">
                        {product.fotos[0] ? (
                          <img 
                            src={product.fotos[0]} 
                            alt={product.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10"><Package size={16} /></div>
                        )}
                        {count > 1 && (
                           <div className="absolute top-1 right-1 bg-accent text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                             x{count}
                           </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm max-w-[200px] truncate">{product.nome}</h5>
                        <p className="text-[10px] text-white/40 font-black tracking-widest uppercase mt-1">ID: {product.id.substring(0,6)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-sm">£{product.preco.toFixed(2)}</p>
                      {count > 1 && <p className="text-[10px] text-white/40 mt-1">£{(product.preco * count).toFixed(2)} total</p>}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
