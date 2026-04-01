"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle2, Film } from "lucide-react";
import { getReviews, canUserReview, addReview } from "@/lib/actions";

interface ProductReviewsProps {
  produtoId: string;
}

export function ProductReviews({ produtoId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [r, allowed] = await Promise.all([
        getReviews(produtoId),
        canUserReview(produtoId)
      ]);
      setReviews(r);
      setCanReview(allowed);
    };
    fetchData();
  }, [produtoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    setIsSubmitting(true);
    try {
      await addReview({ produtoId, rating, texto: comment });
      setComment("");
      setShowForm(false);
      // Refresh reviews
      const r = await getReviews(produtoId);
      setReviews(r);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">
          Customer Reviews ({reviews.length})
        </h2>
        {canReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent/30 pb-0.5 hover:text-white hover:border-white transition-all"
          >
            Write a review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-8 bg-white/5 rounded-2xl border border-white/5 space-y-6 animate-fade-in">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95"
                >
                  <Star
                    size={20}
                    className={`${star <= rating ? "fill-accent text-accent" : "text-white/10"} transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Your Experience</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think about this piece..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 min-h-[120px] transition-all"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 disabled:opacity-50 transition-all border border-white"
            >
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-8 py-3 bg-transparent text-white/40 text-[10px] font-black uppercase tracking-widest rounded-full hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="group">
              <div className="flex items-center bg-white/5 p-4 rounded-2xl md:flex-row gap-8 md:justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white italic">
                    {review.userName}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {new Date(review.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < review.rating ? "fill-accent text-accent" : "text-white/10"}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl">
                {/* MEDIA HUB: Photos & Video */}
                <div className="flex gap-3 shrink-0 flex-wrap md:flex-nowrap">
                  {/* Photo Grid */}
                  {(review.fotos && review.fotos.length > 0) ? (
                    review.fotos.slice(0, 3).map((foto: string, idx: number) => (
                      <div key={idx} className="relative size-24 md:size-32 rounded-2xl overflow-hidden border border-white/10 group-hover:border-accent/30 transition-all duration-500 bg-white/5">
                        <img
                          src={foto}
                          alt={`Review Photo ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ))
                  ) : !review.videoUrl && (
                    /* Luxury Placeholder for Reviews without Media */
                    <div className="relative size-24 md:size-32 rounded-2xl overflow-hidden border border-white/5 bg-black/60 group-hover:border-white/10 transition-all duration-500">
                      <img
                        src="/assets/reviews/placeholder-unboxing.png"
                        alt="Unboxing Detail"
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                      />
                    </div>
                  )}

                  {/* Video Player */}
                  {review.videoUrl && (
                    <div className="relative size-24 md:size-32 rounded-2xl overflow-hidden border border-accent/20 bg-black group-hover:border-accent transition-all duration-500">
                      <video
                        src={review.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-all">
                        <div className="p-1.5 bg-accent rounded-full text-black">
                          <Film size={10} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-16 flex-grow pt-2">
                  <p className="text-xs md:text-[13px] leading-relaxed text-white/90 font-medium italic">
                    "{review.texto}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="size-4 rounded-full flex items-center justify-center">

                    </div>
                    <span className="bg-black p-1 px-4 rounded-full text-[4px] font-black uppercase tracking-[0.1em] text-white/90">
                      North Mind Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl group hover:border-white/10 transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            No reviews yet
          </p>
        </div>
      )}
    </div>
  );
}
