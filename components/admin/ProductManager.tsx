"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Plus, Package, Edit2, Trash2, X, Search, Filter,
  ChevronDown, Monitor, Smartphone, ExternalLink,
  Save, Settings, Image as ImageIcon,
  Type, ShoppingBag, ShieldCheck, Truck, ListPlus, Play,
  Loader2
} from "lucide-react";
import { CollectionManager } from "./CollectionManager";
import { upsertProduct, deleteProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { MediaUpload } from "./MediaUpload";
import { ReviewManager } from "./ReviewManager";

export function ProductManager({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [currentView, setCurrentView] = useState<"products" | "collections" | "reviews" | "editor">("products");
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
    materiais: [] as { item: string; percentage: string }[],
    guiaTamanho: {
      type: "table",
      headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
      rows: [
        ["S", "54", "70", "64"],
        ["M", "56", "72", "66"],
        ["L", "58", "74", "68"],
        ["XL", "60", "76", "70"]
      ]
    },
    detalhesModelo: "",
    instrucoesCuidado: "",
    especificacoes: [] as string[],
    variantes: [] as { label: string; price: string; originalPrice?: string; sku?: string }[],
    handle: "",
    tipo: "ROUPA",
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
        publicado: true,
        opcoesTamanho: product.opcoesTamanho || ["S", "M", "L", "XL", "XXL"],
        opcoesCor: product.opcoesCor || [],
        highlights: product.highlights || [],
        materiais: product.materiais || [],
        guiaTamanho: product.guiaTamanho || {
          type: "table",
          headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
          rows: [
            ["S", "54", "70", "64"],
            ["M", "56", "72", "66"],
            ["L", "58", "74", "68"],
            ["XL", "60", "76", "70"]
          ]
        },
        detalhesModelo: product.detalhesModelo || "",
        instrucoesCuidado: product.instrucoesCuidado || "",
        especificacoes: product.especificacoes || [],
        variantes: (product.variantes || []).map((v: any) => ({
          ...v,
          price: v.price?.toString() || "",
          originalPrice: v.originalPrice?.toString() || ""
        })),
        handle: product.handle || "",
        tipo: product.tipo || "ROUPA"
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
        especificacoes: [],
        handle: "",
        tipo: "ROUPA"
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
        handle: formData.handle,
        tipo: formData.tipo,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : null,
        collection: formData.collection,
        fotoPrincipal: formData.fotoPrincipal,
        fotos: formData.fotos,
        videos: formData.videos,
        totalAvaliacoes: formData.totalAvaliacoes,
        mediaAvaliacoes: formData.mediaAvaliacoes,
        publicado: true,
        opcoesTamanho: formData.opcoesTamanho,
        opcoesCor: formData.opcoesCor,
        highlights: formData.highlights,
        materiais: formData.materiais,
        guiaTamanho: formData.guiaTamanho,
        detalhesModelo: formData.detalhesModelo,
        instrucoesCuidado: formData.instrucoesCuidado,
        especificacoes: formData.especificacoes,
        variantes: formData.variantes.map((v: any) => ({
          ...v,
          price: parseFloat(v.price) || 0,
          originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : null
        }))
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
              <button
                onClick={() => setCurrentView("reviews")}
                className={`text-[9px] font-black uppercase tracking-widest transition-all ${currentView === "reviews" ? "text-accent" : "text-white/40 hover:text-white"}`}
              >
                Experience Hub (Reviews)
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
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{p.nome}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{p.collection}</span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full">
                        <span className="text-[10px] font-black text-accent tracking-tighter">£{p.preco.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-px">Public Storefront</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/product/${p.handle || p.id}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-emerald-500/10 rounded-2xl hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all" title="View on Frontend">
                    <ExternalLink size={20} />
                  </a>
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
      {currentView === "reviews" && <ReviewManager />}

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
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    Public Catalog Sync
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
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Asset Category</h4>
                    <p className="text-[10px] text-white/30 uppercase font-bold">Classify for specialized logic</p>
                  </div>
                  <div className="flex gap-2 bg-black p-1.5 rounded-2xl border border-white/10">
                    {["ROUPA", "PERFUME"].map(t => (
                      <button
                        key={t}
                        onClick={() => setFormData({ ...formData, tipo: t })}
                        className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.tipo === t ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-white/20 hover:text-white"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-8 bg-white/[0.03] border border-emerald-500/20 rounded-[2.5rem]">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Storefront Status</h4>
                    <p className="text-[10px] text-white/30 uppercase font-bold">All products are saved as public</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Public</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-accent border-b border-white/10 pb-4">
                    <Type size={18} />
                    <h4 className="text-xs font-black uppercase tracking-luxury">Creative Details</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Asset Identifier (Title)</label>
                      <input value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base text-white font-black uppercase focus:border-accent/40" />
                    </div>
                    <div className="space-y-2 opacity-60">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Unique Slug (Handle - SEO Permanent)</label>
                      <input value={formData.handle} onChange={e => setFormData({ ...formData, handle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-[11px] font-mono text-white/60 focus:border-accent/40" placeholder="Auto-generated on creation..." />
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
                      Reels appear in the &apos;Experience&apos; section on the product page
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

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Technical Highlights (Crafstmanship)</label>
                    <div className="space-y-4">
                      {(formData.highlights || []).map((h: any, i: number) => (
                        <div key={i} className="space-y-3 p-6 bg-white/[0.02] border border-white/10 rounded-2xl group relative transition-all hover:bg-white/[0.04]">
                          <button 
                            onClick={() => setFormData({ ...formData, highlights: (formData.highlights || []).filter((_: any, idx: number) => idx !== i) })}
                            className="absolute top-4 right-4 text-white/20 hover:text-rose-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-accent tracking-[0.2em]">Accordion Title</label>
                              <input 
                                placeholder="e.g. The Heritage Style" 
                                value={h.title} 
                                onChange={e => {
                                  let next = [...(formData.highlights || [])];
                                  next[i].title = e.target.value;
                                  setFormData({ ...formData, highlights: next });
                                }} 
                                className="w-full bg-transparent text-xs font-black uppercase tracking-widest text-white focus:outline-none placeholder:text-white/10" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em]">Accordion Content</label>
                              <textarea 
                                placeholder="Detailed description for this section..." 
                                value={h.text} 
                                onChange={e => {
                                  let next = [...(formData.highlights || [])];
                                  next[i].text = e.target.value;
                                  setFormData({ ...formData, highlights: next });
                                }} 
                                className="w-full bg-transparent text-[11px] font-medium text-white/50 focus:outline-none resize-none leading-relaxed min-h-[80px]" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setFormData({ ...formData, highlights: [...(formData.highlights || []), { title: "", text: "" }] })} 
                        className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase text-accent hover:text-white hover:border-accent/40 hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> Create New Accordion Section
                      </button>
                    </div>
                  </div>

                  {/* ELITE UPGRADE: Technical Specifications (Bullets) */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Technical Specifications (Bullets)</label>
                    <div className="space-y-3">
                      {(formData.especificacoes || []).map((spec: string, i: number) => (
                        <div key={i} className="flex gap-4 items-center group">
                          <div className="w-2 h-2 rounded-full bg-accent/40 group-hover:bg-accent transition-colors shrink-0" />
                          <input 
                            placeholder="e.g. Removable, three-piece hood" 
                            value={spec} 
                            onChange={e => {
                              let next = [...(formData.especificacoes || [])];
                              next[i] = e.target.value;
                              setFormData({ ...formData, especificacoes: next });
                            }} 
                            className="bg-transparent text-xs font-medium text-white/70 focus:text-white focus:outline-none flex-grow" 
                          />
                          <button onClick={() => setFormData({ ...formData, especificacoes: (formData.especificacoes || []).filter((_: any, idx: number) => idx !== i) })}>
                            <X size={14} className="text-white/20 hover:text-rose-500" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setFormData({ ...formData, especificacoes: [...(formData.especificacoes || []), ""] })} 
                        className="w-full py-3 border border-dashed border-white/5 rounded-xl text-[8px] font-black uppercase text-white/20 hover:text-accent hover:border-accent/20 transition-all"
                      >
                        + Add spec bullet
                      </button>
                    </div>
                  </div>

                  {/* ELITE UPGRADE: Materials & Composition */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Materials & Composition</label>
                    <div className="space-y-4">
                      {(formData.materiais || []).map((m: any, i: number) => (
                        <div key={i} className="flex gap-4 items-center">
                          <input 
                            placeholder="Material (e.g. Cotton)" 
                            value={m.item} 
                            onChange={e => {
                              let next = [...(formData.materiais || [])];
                              next[i].item = e.target.value;
                              setFormData({ ...formData, materiais: next });
                            }} 
                            className="bg-transparent text-xs font-bold text-white focus:outline-none flex-grow" 
                          />
                          <input 
                            placeholder="%" 
                            value={m.percentage} 
                            onChange={e => {
                              let next = [...(formData.materiais || [])];
                              next[i].percentage = e.target.value;
                              setFormData({ ...formData, materiais: next });
                            }} 
                            className="w-16 bg-transparent text-xs font-bold text-accent text-right focus:outline-none" 
                          />
                          <button onClick={() => setFormData({ ...formData, materiais: (formData.materiais || []).filter((_: any, idx: number) => idx !== i) })}>
                            <X size={14} className="text-white/20 hover:text-rose-500" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setFormData({ ...formData, materiais: [...(formData.materiais || []), { item: "", percentage: "" }] })} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase text-white/50 hover:text-white transition-all">
                        + Add Composition Item
                      </button>
                    </div>
                  </div>

                  {/* ELITE UPGRADE: Pricing Variants (Multi-Price by Size) */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Pricing Variants (Size & Bundle Prices)</label>
                    <div className="space-y-4">
                      {(formData.variantes || []).map((v: any, i: number) => (
                        <div key={i} className="grid grid-cols-4 gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-2xl items-center group">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/20 tracking-widest">Name (e.g. 100ml or S)</label>
                            <input 
                              value={v.name} 
                              onChange={e => {
                                let next = [...(formData.variantes || [])];
                                next[i].name = e.target.value;
                                setFormData({ ...formData, variantes: next });
                              }} 
                              className="bg-transparent text-xs font-bold text-white focus:outline-none w-full" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/20 tracking-widest">Price (£)</label>
                            <input 
                              type="number"
                              step="0.01"
                              value={v.price} 
                              onChange={e => {
                                let next = [...(formData.variantes || [])];
                                next[i].price = e.target.value;
                                setFormData({ ...formData, variantes: next });
                              }} 
                              className="bg-transparent text-xs font-bold text-accent focus:outline-none w-full" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/20 tracking-widest">Original (£)</label>
                            <input 
                              type="number"
                              step="0.01"
                              value={v.originalPrice} 
                              onChange={e => {
                                let next = [...(formData.variantes || [])];
                                next[i].originalPrice = e.target.value;
                                setFormData({ ...formData, variantes: next });
                              }} 
                              className="bg-transparent text-xs font-bold text-white/40 focus:outline-none w-full" 
                            />
                          </div>
                          <div className="flex justify-end">
                            <button onClick={() => setFormData({ ...formData, variantes: (formData.variantes || []).filter((_: any, idx: number) => idx !== i) })}>
                              <X size={14} className="text-white/20 hover:text-rose-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setFormData({ ...formData, variantes: [...(formData.variantes || []), { name: "", price: "", originalPrice: "" }] })} 
                        className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase text-accent hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={12} /> Add Price Variation
                      </button>
                    </div>
                  </div>

                  {/* ELITE UPGRADE: Luxury Details */}
                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Model Information</label>
                      <input 
                        placeholder="e.g. Model is 1.88m and wears Size Large"
                        value={formData.detalhesModelo}
                        onChange={e => setFormData({ ...formData, detalhesModelo: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent/30 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Care Instructions</label>
                      <textarea 
                        placeholder="e.g. Dry clean only. Do not bleach."
                        value={formData.instrucoesCuidado}
                        onChange={e => setFormData({ ...formData, instrucoesCuidado: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs text-white/70 focus:outline-none focus:border-accent/30 transition-all min-h-[80px]"
                      />
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
