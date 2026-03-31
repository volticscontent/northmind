"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Package, Edit2, Trash2, X, Search, Filter, ChevronDown } from "lucide-react";
import { CollectionManager } from "./CollectionManager";
import { upsertProduct, deleteProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { MediaUpload } from "./MediaUpload";

export function ProductManager({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [currentView, setCurrentView] = useState<"products" | "collections">("products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); 

  const uniqueCollections = Array.from(new Set(initialProducts.map(p => p.collection)));

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    precoOriginal: "",
    collection: "",
    fotoPrincipal: "",
    fotos: [] as string[],
    videos: [] as string[],
    totalAvaliacoes: 0,
    mediaAvaliacoes: 5.0,
  });

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome || "",
        descricao: product.descricao || "",
        preco: (product.preco ?? "").toString(),
        precoOriginal: (product.precoOriginal ?? "").toString(),
        collection: (product.collection ?? "").toString(),
        fotoPrincipal: product.fotoPrincipal || "",
        fotos: product.fotos || [], 
        videos: product.videos || [],
        totalAvaliacoes: product.totalAvaliacoes || 0,
        mediaAvaliacoes: product.mediaAvaliacoes || 5.0,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        precoOriginal: "",
        collection: "",
        fotoPrincipal: "",
        fotos: [],
        videos: [],
        totalAvaliacoes: 0,
        mediaAvaliacoes: 5.0,
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
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : null,
        collection: formData.collection,
        fotoPrincipal: formData.fotoPrincipal,
        fotos: formData.fotos,
        videos: formData.videos,
        totalAvaliacoes: formData.totalAvaliacoes,
        mediaAvaliacoes: formData.mediaAvaliacoes,
      };

      const result = await upsertProduct(payload);
      router.refresh();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Error saving product.");
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
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.handle?.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="space-y-12 relative min-h-screen">
        {/* VIEW: PRODUCT LIST */}
        {!isModalOpen && currentView === ("products" as string) && (
          <>
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

            <div className="flex items-center gap-4 mb-4">
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

            <div className="space-y-2">
              {currentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-black border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/5 bg-white/5">
                      {(product.fotoPrincipal || product.fotos?.[0]) ? (
                        <img 
                          src={product.fotoPrincipal || product.fotos[0]} 
                          alt={product.nome} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={18} className="text-white/20" />
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
                    <div className="text-right mr-4">
                      <p className="text-sm font-bold text-white leading-none">
                        £{(typeof product.preco === 'number') ? product.preco.toFixed(2) : (product.preco || 0)}
                      </p>
                      {product.precoOriginal && (
                        <p className="text-[9px] text-white/20 line-through">
                          £{product.precoOriginal.toFixed(2)}
                        </p>
                      )}
                    </div>
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

        {!isModalOpen && currentView === ("collections" as string) && (
           <>
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentView("products")}
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                      (currentView as string) === "products"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    Product Management
                  </button>
                  <button
                    onClick={() => setCurrentView("collections")}
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                      (currentView as string) === "collections"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    Collection Management
                  </button>
                </div>
              </div>
              <CollectionManager />
           </>
        )}

      {/* VIEW: FULL PAGE EDITOR */}
      {isModalOpen && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Fixo de Edição */}
            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
              <div>
                <button 
                  onClick={closeModal}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white mb-4 transition-colors"
                >
                  <X size={14} /> Back to Catalog
                </button>
                <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
                  {editingProduct ? "Edit Heritage Piece" : "New Heritage Piece"}
                </h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-accent">
                  {editingProduct ? `Managing unique assets for ${formData.nome}` : "Configure new inventory item"}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                 <button type="button" onClick={closeModal} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="min-w-[200px] px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all shadow-2xl shadow-white/10"
                  >
                    {isSubmitting ? "Syncing..." : "Save Product Data"}
                  </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Side: Text Details (col-span-5) */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Product Name</label>
                    <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-bold" placeholder="e.g. Vintage Leather Jacket" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Description</label>
                    <textarea required value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white/70 min-h-[250px] focus:outline-none focus:border-white/20 transition-all resize-none leading-relaxed" placeholder="Describe the heritage and craft..." />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Current Price (£)</label>
                      <input required type="number" step="0.01" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm font-black text-white focus:outline-none focus:border-white/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Compare at (£)</label>
                      <input type="number" step="0.01" value={formData.precoOriginal} onChange={e => setFormData({...formData, precoOriginal: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm font-black text-white/40 focus:outline-none focus:border-white/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Collection Assignment</label>
                    <div className="relative">
                       <select
                        required
                        value={formData.collection}
                        onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm font-bold text-white appearance-none focus:outline-none focus:border-white/20"
                        >
                        <option value="" disabled>Select a collection</option>
                        {uniqueCollections.map((col) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    </div>
                  </div>

                  {/* Social/Stats Section */}
                  <div className="pt-10 border-t border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-8 flex items-center gap-4">
                      <div className="w-8 h-[1px] bg-accent/30" /> Social Proofing & Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Review Count</label>
                            <input type="number" value={formData.totalAvaliacoes} onChange={e => setFormData({...formData, totalAvaliacoes: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm font-bold text-white focus:outline-none focus:border-white/20" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Average Star Rating</label>
                             <input type="number" step="0.1" max="5" value={formData.mediaAvaliacoes} onChange={e => setFormData({...formData, mediaAvaliacoes: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm font-bold text-white focus:outline-none focus:border-accent/40" />
                        </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Media Management (col-span-7) */}
                <div className="lg:col-span-7 space-y-12">
                   <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-8">
                      <MediaUpload 
                          label="Main Featured Asset"
                          value={formData.fotoPrincipal}
                          onChange={(url) => setFormData({ ...formData, fotoPrincipal: url as string })}
                          maxFiles={1}
                          minWidth={800}
                          minHeight={800}
                      />

                      <MediaUpload 
                          label="Media Gallery (Grid View)"
                          value={formData.fotos}
                          onChange={(urls) => setFormData({ ...formData, fotos: urls as string[] })}
                          multiple
                          maxFiles={10}
                          minWidth={600}
                          minHeight={600}
                      />

                      <MediaUpload 
                          label="Interactive Video Assets"
                          value={formData.videos}
                          onChange={(urls) => setFormData({ ...formData, videos: urls as string[] })}
                          multiple
                          maxFiles={3}
                      />
                   </div>

                   <div className="p-8 bg-accent/5 border border-accent/10 rounded-2xl">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Media Optimization Tip</h5>
                      <p className="text-xs text-accent/60 leading-relaxed uppercase font-bold tracking-tight">
                        North Mind layouts prioritize 1:1 square assets for product details. Ensure your high-resolution photos meet the minimum 800px threshold for our premium zoom features.
                      </p>
                   </div>
                </div>
              </div>
            </form>
        </div>
      )}
    </div>
  );
}
