"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Package, Edit2, Trash2, X, Search, Filter, ChevronDown } from "lucide-react";
import { CollectionManager } from "./CollectionManager";
import { upsertProduct, deleteProduct } from "@/lib/actions";

export function ProductManager({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // You can adjust this value
  const [currentView, setCurrentView] = useState("products"); // "products" or "collections"

  const uniqueCollections = Array.from(new Set(initialProducts.map(p => p.collection)));

  const [formData, setFormData] = useState({
    nome: "",
    handle: "",
    descricao: "",
    preco: "",
    precoOriginal: "",
    collection: "",
    fotos: [], // We'll manage this as an array of strings in the UI
  });

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome,
        handle: product.handle,
        descricao: product.descricao,
        preco: (product.preco ?? "").toString(),
        precoOriginal: (product.precoOriginal ?? "").toString(),
        collection: (product.collection ?? "").toString(),
        fotos: product.fotos || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nome: "",
        handle: "",
        descricao: "",
        preco: "",
        precoOriginal: "",
        collection: "",
        fotos: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id: editingProduct?.id,
        nome: formData.nome,
        handle: formData.handle.toLowerCase().replace(/\s+/g, '-'),
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : null,
        collection: formData.collection,
        fotos: formData.fotos,
      };

      await upsertProduct(payload);
      // To immediately reflect changes in UI without relying solely on revalidatePath
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...payload, id: editingProduct.id } : p));
      } else {
        // Just a mock ID for UI until hard refresh
        setProducts([{ ...payload, id: Math.random().toString() }, ...products]);
      }
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Error saving product. Make sure the handle is unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting product.");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === "all" || product.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-12 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView("products")}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                currentView === "products"
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              Product Management
            </button>
            <button
              onClick={() => setCurrentView("collections")}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                currentView === "collections"
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              Collection Management
            </button>
          </div>
        </div>

        {currentView === "products" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                  Catalog Management
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  {products.length} products currently active
                </p>
              </div>
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all"
              >
                <Plus size={16} />
                Add New Product
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-grow">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white appearance-none focus:outline-none focus:border-accent"
                >
                  <option value="all">All Collections</option>
                  {uniqueCollections.map((collection) => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-0">
              {currentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-black border border-white/5 rounded-lg group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-white/5">
                      {product.fotos && product.fotos.length > 0 ? (
                        <Image 
                          src={product.fotos[0]} 
                          alt={product.nome} 
                          layout="fill" 
                          objectFit="cover" 
                          className="group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <Package size={18} className="text-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{product.nome}</h3>
                        <p className="text-[10px] text-white/30 font-mono">/{product.handle}</p>
                      </div>
                      {product.collection && (
                        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-white/50 whitespace-nowrap">
                          {product.collection}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      £{(typeof product.preco === 'number') ? product.preco.toFixed(2) : (product.preco || 0)}
                    </span>
                    <button 
                      onClick={() => openModal(product)}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10 disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 text-xs rounded-lg ${
                      currentPage === index + 1
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    } transition-all`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10 disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {currentView === "collections" && (
          <CollectionManager />
        )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                {editingProduct ? "Edit Product" : "New Heritage Piece"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-white/40 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Product Name</label>
                <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent" />
                <p className="text-[10px] text-white/20 font-mono">Handle: /{formData.handle || '...'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
                <textarea required value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white min-h-[100px] focus:outline-none focus:border-accent" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price (£)</label>
                  <input required type="number" step="0.01" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Compare at (£)</label>
                  <input type="number" step="0.01" value={formData.precoOriginal} onChange={e => setFormData({...formData, precoOriginal: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Image URLs</label>
                <div className="space-y-2">
                  {formData.fotos.map((foto, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        required
                        value={foto}
                        onChange={e => {
                          const newFotos = [...formData.fotos];
                          newFotos[index] = e.target.value;
                          setFormData({ ...formData, fotos: newFotos });
                        }}
                        placeholder="e.g. /assets/img1.jpg"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFotos = formData.fotos.filter((_, i) => i !== index);
                          setFormData({ ...formData, fotos: newFotos });
                        }}
                        className="p-2 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, fotos: [...formData.fotos, ""] })}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Plus size={14} />
                    Add Image
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 disabled:opacity-50 transition-all">
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
