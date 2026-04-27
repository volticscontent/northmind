"use client";

import { useState, useEffect } from "react";
import { 
  Star, Trash2, Edit2, X, Save, 
  MessageSquare, Film, Image as ImageIcon, 
  Filter, Search, Loader2, CheckCircle2
} from "lucide-react";
import { getAdminReviews, updateReview, deleteReview } from "@/lib/actions";
import { MediaUpload } from "./MediaUpload";

export function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const data = await getAdminReviews();
    setReviews(data);
    setLoading(false);
  }

  async function handleUpdate() {
    if (!editingReview) return;
    setIsSubmitting(true);
    try {
      await updateReview(editingReview.id, {
        texto: editingReview.texto,
        rating: editingReview.rating,
        fotos: editingReview.fotos,
        videoUrl: editingReview.videoUrl
      });
      setEditingReview(null);
      await fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Error updating review");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review forever?")) return;
    try {
      await deleteReview(id);
      await fetchReviews();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredReviews = reviews.filter(r => 
    r.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.produto?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Loading Experience Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between pb-8 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Social Proof Hub</h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Manage customer feedback and unboxing media</p>
        </div>
        
        <div className="relative group w-80">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-xs text-white focus:outline-none focus:border-accent/40 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all flex items-start justify-between gap-8">
            <div className="space-y-4 flex-grow">
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className={i < review.rating ? "fill-accent text-accent" : "text-white/10"} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">{review.userName || 'Anonymous'}</span>
                <span className="text-[9px] text-white/20 font-bold uppercase">{review.produto?.nome}</span>
              </div>
              
              <p className="text-xs text-white/60 leading-relaxed max-w-3xl italic">&quot;{review.texto}&quot;</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={14} className={review.fotos?.length > 0 ? "text-emerald-500" : "text-white/10"} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{review.fotos?.length || 0}/3 Photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film size={14} className={review.videoUrl ? "text-accent" : "text-white/10"} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{review.videoUrl ? '1' : '0'}/1 Video</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setEditingReview(review)}
                className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(review.id)}
                className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingReview && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#050505] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
            <header className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white">Refine Feedback</h3>
                  <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">Update content and add unboxing media</p>
                </div>
              </div>
              <button onClick={() => setEditingReview(null)} className="p-3 hover:bg-white/5 rounded-full transition-all">
                <X size={20} className="text-white/20 hover:text-white" />
              </button>
            </header>

            <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar max-h-[70vh]">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Rating Score</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setEditingReview({...editingReview, rating: s})} className="transition-transform active:scale-95">
                      <Star size={20} className={s <= editingReview.rating ? "fill-accent text-accent" : "text-white/10"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Deposition Text</label>
                <textarea 
                  value={editingReview.texto}
                  onChange={(e) => setEditingReview({...editingReview, texto: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-accent/40 min-h-[120px] resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 gap-8">
                <MediaUpload 
                  label="Unboxing Photos (Up to 3)" 
                  value={editingReview.fotos || []} 
                  onChange={(urls) => setEditingReview({...editingReview, fotos: urls as string[]})}
                  multiple
                  maxFiles={3}
                />
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Unboxing Video (MP4 URL)</label>
                  <div className="relative">
                    <Film size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      placeholder="https://.../video.mp4"
                      value={editingReview.videoUrl || ""}
                      onChange={(e) => setEditingReview({...editingReview, videoUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs text-white focus:outline-none focus:border-accent/40"
                    />
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-10 border-t border-white/5 bg-black/50 backdrop-blur-md flex justify-end">
              <button 
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex items-center gap-4 px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-luxury rounded-2xl hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? "Syncing..." : "Commit Changes"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
