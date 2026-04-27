"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ImagePlus, Package, Search, Check } from "lucide-react";
import { MediaUpload } from "./MediaUpload";
import { upsertCollection } from "@/lib/actions";

interface CollectionFormProps {
  collection?: any;
  onClose: () => void;
  products: any[];
}

export function CollectionForm({ collection, onClose, products: allProducts }: CollectionFormProps) {
  const [formData, setFormData] = useState({
    id: collection?.id || null,
    name: collection?.name || "",
    handle: collection?.handle || "",
    description: collection?.description || "",
    image: collection?.image || "",
    selectedProductIds: collection?.products?.map((p: any) => p.id) || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(productId)
        ? prev.selectedProductIds.filter((id: string) => id !== productId)
        : [...prev.selectedProductIds, productId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await upsertCollection(formData);
      onClose();
    } catch (err: any) {
      console.error("Error saving collection:", err);
      setError(err.message || "Failed to save collection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = allProducts.filter(p => 
    p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.handle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto flex flex-col">
      {/* Header Fixo de Edição */}
      <div className="flex items-center justify-between border-b border-white/5 p-10 bg-[#050505] sticky top-0 z-50">
        <div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white mb-4 transition-colors"
          >
            <X size={14} /> Back to Collections
          </button>
          <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
            {collection ? "Edit Collection" : "New Collection"}
          </h3>
          <p className="text-[10px] uppercase font-bold tracking-widest text-accent">
            {collection ? `Refining ${formData.name}` : "Architecting a new category"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button type="button" onClick={onClose} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[200px] px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all shadow-2xl shadow-white/10"
          >
            {isSubmitting ? "Syncing..." : "Save Collection"}
          </button>
        </div>
      </div>

      <div className="p-10 flex-1">
        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24 h-full">
          {/* Coluna Esquerda: Informações & Mídia (col-span-5) */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Collection Name</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-bold" placeholder="e.g. Summer Collection" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Handle (Slug)</label>
                    <input required value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} placeholder="e.g. summer-sale" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/40 focus:outline-none focus:border-white/20" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/70 min-h-[150px] focus:outline-none focus:border-white/20 transition-all resize-none leading-relaxed" placeholder="Describe the aesthetic..." />
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-8">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Collection Banner</h4> 
                    <button 
                        type="button"
                        onClick={() => setShowProductPicker(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg text-accent text-[9px] font-black uppercase tracking-widest hover:bg-accent/20 transition-all"
                    >
                        <ImagePlus size={14} />
                        From Product
                    </button>
                </div>

                <MediaUpload 
                    label="Cover Image"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url as string })}
                    maxFiles={1}
                    minWidth={1200}
                    minHeight={600}
                />
            </div>
          </div>

          {/* Coluna Direita: Seleção de Produtos (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
             <div className="flex items-center justify-between mb-8">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Products Membership</h4>
                    <p className="text-[20px] font-black uppercase tracking-tighter text-white">
                        {formData.selectedProductIds.length} Selected
                    </p>
                 </div>
                 
                 <div className="relative w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                    <input 
                       type="text" 
                       placeholder="Search products..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-white/20"
                    />
                 </div>
             </div>

             <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                <div className="overflow-y-auto p-4 space-y-2 h-[calc(100vh-400px)]">
                    {filteredProducts.map((product) => {
                        const isSelected = formData.selectedProductIds.includes(product.id);
                        return (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                    isSelected 
                                    ? "bg-accent/10 border-accent/30" 
                                    : "bg-black/40 border-white/5 hover:border-white/20"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                                        {(product.fotoPrincipal || product.fotos?.[0]) && (
                                            <Image src={product.fotoPrincipal || product.fotos[0]} alt={product.nome} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-white">{product.nome}</p>
                                        <p className="text-[9px] text-white/20 font-mono">/{product.handle}</p>
                                    </div>
                                </div>
                                
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? "bg-accent text-black" : "bg-white/5 border border-white/10"
                                }`}>
                                    {isSelected && <Check size={14} />}
                                </div>
                            </button>
                        );
                    })}
                    {filteredProducts.length === 0 && (
                        <div className="py-20 text-center">
                            <Package size={40} className="mx-auto text-white/10 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No items found</p>
                        </div>
                    )}
                </div>
             </div>
          </div>
        </form>
      </div>

      {/* Product Picker Modal (For Cover selection) */}
      {showProductPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowProductPicker(false)} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Select Cover Photo</h4>
              <button onClick={() => setShowProductPicker(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-4">
              {allProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image: product.fotoPrincipal || (product.fotos?.[0] || "") });
                    setShowProductPicker(false);
                  }}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-accent transition-all shadow-lg"
                >
                  <Image 
                    src={product.fotoPrincipal || (product.fotos?.[0] || "")} 
                    alt={product.nome}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-[8px] font-black uppercase text-white truncate text-left">{product.nome}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
