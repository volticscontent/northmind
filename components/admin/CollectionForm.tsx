"use client";

import { useState } from "react";
import { X, Plus, Package } from "lucide-react";
import { upsertCollection } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface CollectionFormProps {
  collection?: any;
  products: any[];
  onClose: () => void;
}

export function CollectionForm({ collection, products, onClose }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: collection?.id || "",
    name: collection?.name || "",
    handle: collection?.handle || "",
    description: collection?.description || "",
    image: collection?.image || "",
    // We'll manage products by updating their collection field
    // But since the current model is simple, we'll just show the products
    // and let the user select them.
    selectedProductIds: products
      .filter((p) => p.collection === collection?.name)
      .map((p) => p.id),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real implementation with relations, we'd send the product IDs.
      // For now, we'll send the collection data. 
      // The backend needs to handle the product association if we want it robust.
      // THE USER ASKED: "permitir acrescentar ou remover os produtos"
      await upsertCollection({
        ...formData,
        productIds: formData.selectedProductIds // Backend will map these products to this collection
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error saving collection");
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(id)
        ? prev.selectedProductIds.filter(pid => pid !== id)
        : [...prev.selectedProductIds, id]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-white">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A0A0A] z-10">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              {collection ? "Edit Collection" : "New Collection"}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Manage items and details
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Winter Sale"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Handle (SLUG)</label>
                <input
                  type="text"
                  required
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="winter-sale"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Right Column: Image & Products */}
            <div className="space-y-6">
               <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Collection Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
                />
              </div>

            <div className="flex flex-col h-[300px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center justify-between">
                  <span>Included Products ({formData.selectedProductIds.length})</span>
                  <Package size={14} className="text-white/20" />
                </label>
                
                <div className="bg-black/40 border border-white/5 rounded-2xl flex-1 overflow-y-auto divide-y divide-white/[0.03] scrollbar-hide">
                  {products.map((p) => (
                    <div 
                      key={p.id} 
                      onClick={() => toggleProduct(p.id)}
                      className={`flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${
                        formData.selectedProductIds.includes(p.id) ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        formData.selectedProductIds.includes(p.id) 
                          ? 'bg-white border-white text-black' 
                          : 'border-white/20'
                      }`}>
                        {formData.selectedProductIds.includes(p.id) && <Plus size={10} className="stroke-[4]" />}
                      </div>
                      <div className="size-10 bg-white/5 rounded-lg border border-white/10 overflow-hidden shrink-0">
                        {p.fotos?.[0] && <img src={p.fotos[0]} alt={p.nome} className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate">{p.nome}</p>
                        <p className="text-[9px] text-white/30 uppercase truncate">{p.collection || "No Collection"}</p>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="p-8 text-center text-white/20 uppercase text-[10px] font-black tracking-widest">
                        No products found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl shadow-white/5 border-none"
            >
              {loading ? "Saving..." : "Save Collection"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white/5 transition-all bg-transparent cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
