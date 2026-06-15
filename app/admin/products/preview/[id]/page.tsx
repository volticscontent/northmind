"use client";

import { useEffect, useState } from "react";
import { ProductDetail } from "@/components/ProductDetail";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { fetchProductPreview, fetchAllProductsForPreview } from "./actions";

export default function AdminProductPreviewPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (status !== "authenticated") return;
      
      if (params.id === "new") {
        setProduct({
          nome: "New Heritage Piece",
          descricao: "",
          preco: 0,
          fotos: [],
          videos: [],
          publicado: false,
          opcoesTamanho: ["S", "M", "L"],
          opcoesCor: [],
          highlights: []
        });
        setLoading(false);
        return;
      }

      try {
        const [prod, all] = await Promise.all([
          fetchProductPreview(params.id),
          fetchAllProductsForPreview()
        ]);
        
        if (prod) setProduct(prod);
        if (all) setAllProducts(all);
      } catch (error) {
        console.error("Preview fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, session, status]);

  // LIVE STUDIO LISTENER: Listen for updates from the Parent (ProductManager)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "NORTHMIND_PREVIEW_UPDATE") {
        setProduct((prev: any) => ({
          ...prev,
          ...event.data.payload,
          title: event.data.payload.nome || event.data.payload.title || prev?.nome || prev?.title,
          description: event.data.payload.descricao || event.data.payload.description || prev?.descricao || prev?.description,
          price: event.data.payload.preco !== undefined ? event.data.payload.preco : prev?.preco,
          originalPrice: event.data.payload.precoOriginal !== undefined ? event.data.payload.precoOriginal : prev?.precoOriginal,
          images: event.data.payload.fotos || event.data.payload.images || prev?.fotos || prev?.images,
          videos: event.data.payload.videos || prev?.videos,
        }));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!product) return <div className="p-20 text-white">Product not found.</div>;

  return (
    <div className="relative min-h-screen bg-[#0a0a09]">
      <div className="fixed top-0 left-0 right-0 z-[100] bg-accent text-black py-1.5 px-4 text-center font-black uppercase text-[9px] tracking-widest shadow-2xl flex items-center justify-center gap-4">
        <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
        LIVE STUDIO MODE • {product.nome || product.title} • {product.publicado ? "LIVE" : "DRAFT"}
      </div>
      <ProductDetail product={product} allProducts={allProducts} />
    </div>
  );
}
