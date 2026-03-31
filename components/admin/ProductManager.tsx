"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Plus, Package, Edit2, Trash2, X, Search, Filter,
  ChevronDown, Monitor, Smartphone, ExternalLink,
  Save, Eye, Settings, Image as ImageIcon,
  Type, ShoppingBag, ShieldCheck, Truck, ListPlus, Play,
  Loader2
} from "lucide-react";
import { CollectionManager } from "./CollectionManager";
import { upsertProduct, deleteProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { MediaUpload } from "./MediaUpload";

export function ProductManager({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [currentView, setCurrentView] = useState<"products" | "collections" | "editor">("products");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [formData, setFormData] = useState<any>({
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
    publicado: true,
    opcoesTamanho: ["S", "M", "L", "XL", "XXL"],
    opcoesCor: [] as any[],
    highlights: [] as any[],
  });

  const uniqueCollections = useMemo(() =>
    Array.from(new Set(products.map(p => p.collection).filter(Boolean))),
    [products]
  );

  // LIVE STUDIO SYNC: Broadcaster
  useEffect(() => {
    if (currentView === "editor" && iframeRef.current) {
      const payload = {
        type: "NORTHMIND_PREVIEW_UPDATE",
        payload: {
          ...formData,
          title: formData.nome,
          description: formData.descricao,
          price: parseFloat(formData.preco) || 0,
          originalPrice: parseFloat(formData.precoOriginal) || 0,
          images: formData.fotos,
          videos: formData.videos,
        }
      };

      const sendUpdate = () => {
        iframeRef.current?.contentWindow?.postMessage(payload, "*");
      };

      // Send immediately and again after short delay to ensure iframe is ready
      sendUpdate();
      const timer = setTimeout(sendUpdate, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, currentView]);

  const openEditor = (product: any = null) => {
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
        publicado: product.publicado ?? true,
        opcoesTamanho: product.opcoesTamanho || ["S", "M", "L", "XL", "XXL"],
        opcoesCor: product.opcoesCor || [],
        highlights: product.highlights || [],
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
        publicado: true,
        opcoesTamanho: ["S", "M", "L", "XL", "XXL"],
        opcoesCor: [],
        highlights: [],
      });
    }
    setCurrentView("editor");
  };

  const closeEditor = () => {
    setCurrentView("products");
    setEditingProduct(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        publicado: formData.publicado,
        opcoesTamanho: formData.opcoesTamanho,
        opcoesCor: formData.opcoesCor,
        highlights: formData.highlights,
      };

      await upsertProduct(payload);
      router.refresh();
      if (!editingProduct) closeEditor();
      alert("Changes synced successfully.");
    } catch (error) {
      console.error(error);
      alert("Error saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm asset deletion?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.handle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === "all" || product.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="space-y-12 relative min-h-screen">
      {currentView !== "editor" && (
        <div className="flex items-center justify-between animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
              Studio Catalog
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView("products")}
                className={`text-[9px] font-black uppercase tracking-widest transition-all ${currentView === "products" ? "text-accent" : "text-white/40 hover:text-white"}`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setCurrentView("collections")}
                className={`text-[9px] font-black uppercase tracking-widest transition-all ${currentView === "collections" ? "text-accent" : "text-white/40 hover:text-white"}`}
              >
                Collections
              </button>
            </div>
          </div>
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all shadow-2xl"
          >
            <Plus size={16} />
            New Asset
          </button>
        </div>
      )}

      {currentView === "products" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
          <div className="relative group max-w-2xl">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm text-white focus:outline-none focus:border-accent/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentProducts.map((p) => (
              <div key={p.id} className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/5 bg-black bg-grid-white/[0.02]">
                    <img
                      src={p.fotoPrincipal || p.fotos?.[0] || "/assets/community/1.png"}
                      alt={p.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    {!p.publicado && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest border border-rose-500/30 px-2 py-0.5 rounded">Draft</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{p.nome}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{p.collection}</span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full">
                        <span className="text-[10px] font-black text-accent tracking-tighter">£{p.preco.toFixed(2)}</span>
                      </div>
                      {p.publicado ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-px">Live Storefront</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-px">Draft Offline</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.publicado && (
                    <a href={`/product/${p.handle || p.id}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-emerald-500/10 rounded-2xl hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all" title="View on Frontend">
                      <ExternalLink size={20} />
                    </a>
                  )}
                  <button onClick={() => openEditor(p)} className="p-4 bg-white/5 rounded-2xl hover:bg-white text-white/40 hover:text-black transition-all" title="Edit Asset">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-4 bg-rose-500/10 rounded-2xl hover:bg-rose-500 text-rose-500 hover:text-white transition-all" title="Delete Asset">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === "collections" && <CollectionManager />}

      {currentView === "editor" && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in slide-in-from-right-4 duration-700">
          <header className="flex items-center justify-between px-10 py-5 border-b border-white/5 bg-black/90 backdrop-blur-3xl">
            <div className="flex items-center gap-8">
              <button
                onClick={closeEditor}
                className="p-4 bg-white/5 rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-all group"
              >
                <ChevronDown size={28} className="rotate-90 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                  {editingProduct ? "Studio: Refine Asset" : "Studio: Create Asset"}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className={`w-2 h-2 rounded-full ${formData.publicado ? 'bg-emerald-500 shrink-animate-pulse' : 'bg-white/20'}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    {formData.publicado ? "Live Production Sync" : "Local Workspace Mode"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-3 rounded-full transition-all ${previewMode === "desktop" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                >
                  <Monitor size={18} />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-3 rounded-full transition-all ${previewMode === "mobile" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                >
                  <Smartphone size={18} />
                </button>
              </div>
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="flex items-center gap-4 px-10 py-5 bg-accent text-black text-[11px] font-black uppercase tracking-luxury rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-accent/10"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? "Syncing..." : "Publish to Cloud"}
              </button>
            </div>
          </header>

          <main className="flex-grow flex overflow-hidden">
            {/* LEFT: STUDIO CONTROLS (40%) */}
            <div className="w-[40%] overflow-y-auto custom-scrollbar p-12 space-y-16 border-r border-white/10 bg-[#050505]">
              <section className="space-y-10">
                <div className="flex items-center justify-between p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem]">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Global Visibility</h4>
                    <p className="text-[10px] text-white/30 uppercase font-bold">Show this piece on the storefront</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.publicado} onChange={e => setFormData({ ...formData, publicado: e.target.checked })} className="sr-only peer" />
                    <div className="w-14 h-7 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-accent after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-accent border-b border-white/10 pb-4">
                    <Type size={18} />
                    <h4 className="text-xs font-black uppercase tracking-luxury">Creative Details</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Asset Identifier</label>
                      <input value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base text-white font-black uppercase focus:border-accent/40" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Listing Price (£)</label>
                        <input type="number" step="0.01" value={formData.preco} onChange={e => setFormData({ ...formData, preco: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-black text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Heritage Collection</label>
                        <select value={formData.collection} onChange={e => setFormData({ ...formData, collection: e.target.value })} className="w-full h-[76px] bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-white appearance-none">
                          <option value="">Select Category...</option>
                          {uniqueCollections.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Brand Narrative</label>
                      <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/60 min-h-[140px] resize-none leading-relaxed" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-10">
                <div className="flex items-center gap-4 text-accent border-b border-white/10 pb-4">
                  <ImageIcon size={18} />
                  <h4 className="text-xs font-black uppercase tracking-luxury">Gallery & Reels</h4>
                </div>
                <div className="space-y-10">
                  <MediaUpload label="Primary Thumbnail" value={formData.fotoPrincipal} onChange={url => setFormData({ ...formData, fotoPrincipal: url as string })} maxFiles={1} />
                  <MediaUpload label="Photo Gallery (Lookbook)" value={formData.fotos} onChange={urls => setFormData({ ...formData, fotos: urls as string[] })} multiple maxFiles={10} />

                  <div className="pt-6 border-t border-white/5">
                    <MediaUpload
                      label="Social Reels (3 Stories - MP4)"
                      value={formData.videos}
                      onChange={urls => setFormData({ ...formData, videos: urls as string[] })}
                      multiple
                      maxFiles={3}
                    />
                    <p className="text-[9px] text-white/20 uppercase font-bold text-center mt-4">
                      Reels appear in the 'Experience' section on the product page
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-10 pb-20">
                <div className="flex items-center gap-4 text-accent border-b border-white/10 pb-4">
                  <ShieldCheck size={18} />
                  <h4 className="text-xs font-black uppercase tracking-luxury">Product Matrix</h4>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Sizing Chart</label>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map(s => {
                        const active = (formData.opcoesTamanho || []).includes(s);
                        return (
                          <button key={s} onClick={() => {
                            const next = active ? formData.opcoesTamanho.filter((x: string) => x !== s) : [...formData.opcoesTamanho, s];
                            setFormData({ ...formData, opcoesTamanho: next });
                          }} className={`px-5 py-3 text-[10px] font-black rounded-xl border transition-all ${active ? "bg-white text-black border-white shadow-xl" : "border-white/5 text-white/20 hover:border-white/20"}`}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Color Palette</label>
                    <div className="space-y-4">
                      {(formData.opcoesCor || []).map((c: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-2xl items-center group">
                          <input type="color" value={c.hex} onChange={e => {
                            let next = [...(formData.opcoesCor || [])];
                            next[i].hex = e.target.value;
                            setFormData({ ...formData, opcoesCor: next });
                          }} className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent" />
                          <input placeholder="Color Tone Name" value={c.name} onChange={e => {
                            let next = [...(formData.opcoesCor || [])];
                            next[i].name = e.target.value;
                            setFormData({ ...formData, opcoesCor: next });
                          }} className="flex-grow bg-transparent text-xs font-bold text-white focus:outline-none" />
                          <button onClick={() => setFormData({ ...formData, opcoesCor: (formData.opcoesCor || []).filter((_: any, idx: number) => idx !== i) })}>
                            <X size={16} className="text-white/20 hover:text-rose-500" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setFormData({ ...formData, opcoesCor: [...(formData.opcoesCor || []), { name: "", hex: "#000000" }] })} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase text-accent hover:text-white transition-all flex items-center justify-center gap-2">
                        <Plus size={14} /> Add Colorway
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT: REAL-TIME FRAME (60%) */}
            <div className="flex-grow bg-[#000] relative flex items-center justify-center p-10 overflow-hidden">
              <div
                className={`transition-all duration-1000 ease-out bg-[#0a0a09] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5 ${previewMode === "mobile"
                    ? "w-[390px] h-[844px] rounded-[3.5rem] border-[12px] border-zinc-900"
                    : "w-full h-full rounded-none md:rounded-[1rem]"
                  }`}
              >
                <iframe
                  ref={iframeRef}
                  src={editingProduct ? `/admin/products/preview/${editingProduct.id}` : `/admin/products/preview/new`}
                  className="w-full h-full border-none"
                  title="Studio Real-Time Preview"
                />
              </div>

              {previewMode === "mobile" && (
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 flex flex-col gap-8 opacity-20 pointer-events-none">
                  <div className="w-1 h-20 bg-white rounded-full" />
                  <div className="w-1 h-32 bg-white rounded-full" />
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
