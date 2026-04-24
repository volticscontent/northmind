"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Folder, Image as ImageIcon, ExternalLink, Eye, EyeOff, Loader2, Package } from "lucide-react";
import { getCollections, deleteCollection, getProducts, setCollectionStatus, setCollectionDraft } from "@/lib/actions";
import { CollectionForm } from "./CollectionForm";

export function CollectionManager() {
  const [collections, setCollections] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isTogglingDraft, setIsTogglingDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cols, prods] = await Promise.all([
        getCollections(),
        getProducts()
      ]);
      setCollections(cols);
      setAllProducts(prods);
    } catch (err: any) {
      console.error("Failed to load admin data:", err);
      setError(err.message || "Failed to load management data.");
    } finally {
      setIsLoading(false);
    }
  };

  const openForm = (collection: any = null) => {
    setEditingCollection(collection);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCollection(null);
    loadData(); // Refresh list to show changes
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection? This action is irreversible.")) return;
    try {
      await deleteCollection(id);
      loadData();
    } catch (err: any) {
      console.error("Error deleting collection:", err);
      alert(err.message || "Error deleting collection.");
    }
  };

  const handleToggleStatus = async (collectionName: string, currentlyPublished: boolean) => {
    const action = currentlyPublished ? "DRAFT" : "LIVE";
    if (!confirm(`Set all products in "${collectionName}" to ${action}?`)) return;

    setIsUpdatingStatus(collectionName);
    try {
      await setCollectionStatus(collectionName, !currentlyPublished);
      await loadData();
    } catch (err: any) {
      console.error("Error updating collection status:", err);
      alert(err.message || "Error updating collection status.");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleToggleCollectionDraft = async (collection: any) => {
    const nextState = !collection.publicado;
    const label = nextState ? "LIVE" : "DRAFT";
    if (!confirm(`Set collection "${collection.name}" to ${label}? This controls whether the collection page is visible on the storefront.`)) return;

    setIsTogglingDraft(collection.id);
    try {
      await setCollectionDraft(collection.id, nextState);
      await loadData();
    } catch (err: any) {
      console.error("Error toggling collection draft:", err);
      alert(err.message || "Error updating collection visibility.");
    } finally {
      setIsTogglingDraft(null);
    }
  };

  if (isFormOpen) {
    return (
      <CollectionForm 
        collection={editingCollection} 
        products={allProducts} 
        onClose={closeForm} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
            Collection Management
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Design your storefront hierarchy and category assets
          </p>
        </div>
        <button 
          onClick={() => openForm()}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all shadow-xl shadow-white/5"
        >
          <Plus size={16} />
          Create New Category
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center space-y-4">
           <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
           <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
               <Folder size={40} className="mx-auto text-white/10 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Empty Territory</p>
            </div>
          ) : (
            collections.map((collection) => (
              <div key={collection.id} className="group relative bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all shadow-2xl">
                {/* Image Preview */}
                <div className="aspect-[2/1] relative overflow-hidden bg-white/5">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <ImageIcon size={24} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Stats Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/60">
                    {collection.products?.length || 0} Pieces
                  </div>

                  {/* Collection Draft Overlay */}
                  {!collection.publicado && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-rose-500/80 backdrop-blur-md rounded-full border border-rose-500/40">
                      <EyeOff size={10} className="text-white" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">Draft</span>
                    </div>
                  )}
                </div>

                <div className="p-6 pt-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-black uppercase tracking-tight text-white mb-1 group-hover:text-accent transition-colors">
                        {collection.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-[9px] font-mono text-white/30 truncate">/{collection.handle}</p>

                        {/* Collection-level visibility badge */}
                        {collection.publicado ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Page Live</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
                            <div className="w-1 h-1 rounded-full bg-rose-500" />
                            <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Page Draft</span>
                          </div>
                        )}

                        {/* Products-level status badge */}
                        {(() => {
                            const productsInCollection = allProducts.filter(p => p.collection === collection.name);
                            const allPublished = productsInCollection.length > 0 && productsInCollection.every(p => p.publicado);
                            const somePublished = productsInCollection.some(p => p.publicado);
                            if (allPublished) return (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Products Live</span>
                                </div>
                            );
                            if (somePublished) return (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Partial Live</span>
                                </div>
                            );
                            return (
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full">
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Products Draft</span>
                                </div>
                            );
                        })()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Toggle collection page visibility (draft/live) */}
                        <button
                            onClick={() => handleToggleCollectionDraft(collection)}
                            disabled={isTogglingDraft === collection.id}
                            className={`p-2.5 rounded-xl transition-all ${
                                isTogglingDraft === collection.id ? "bg-white/5 opacity-50 cursor-not-allowed" :
                                collection.publicado
                                  ? "bg-emerald-500/10 hover:bg-rose-500/20 text-emerald-500 hover:text-rose-400"
                                  : "bg-rose-500/10 hover:bg-emerald-500/20 text-rose-400 hover:text-emerald-500"
                            }`}
                            title={collection.publicado ? "Hide collection page (set to Draft)" : "Publish collection page (set to Live)"}
                        >
                            {isTogglingDraft === collection.id ? <Loader2 size={14} className="animate-spin" /> :
                             collection.publicado ? <Eye size={14} /> : <EyeOff size={14} />
                            }
                        </button>

                        {/* Bulk toggle all products in collection */}
                        <button
                            onClick={() => {
                                const productsInCollection = allProducts.filter(p => p.collection === collection.name);
                                const isPublished = productsInCollection.some(p => p.publicado);
                                handleToggleStatus(collection.name, isPublished);
                            }}
                            disabled={isUpdatingStatus === collection.name}
                            className={`p-2.5 rounded-xl transition-all ${
                                isUpdatingStatus === collection.name ? "bg-white/5 opacity-50 cursor-not-allowed" :
                                allProducts.some(p => p.collection === collection.name && p.publicado)
                                  ? "bg-amber-500/10 hover:bg-amber-500/30 text-amber-500"
                                  : "bg-white/5 hover:bg-emerald-500/20 text-white/30 hover:text-emerald-500"
                            }`}
                            title={allProducts.some(p => p.collection === collection.name && p.publicado) ? "Set all products to Draft" : "Set all products to Live"}
                        >
                            {isUpdatingStatus === collection.name ? <Loader2 size={14} className="animate-spin" /> :
                             <Package size={14} />
                            }
                        </button>

                        <a
                            href={`/collections/${collection.handle}`} target="_blank" rel="noopener noreferrer"
                            className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all" title="View Frontend Category"
                        >
                            <ExternalLink size={14} />
                        </a>
                        <button
                            onClick={() => openForm(collection)}
                            className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all" title="Edit Category"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => handleDelete(collection.id)}
                            className="p-2.5 bg-rose-500/5 rounded-xl hover:bg-rose-500/20 text-rose-500/40 hover:text-rose-500 transition-all" title="Delete Category"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
