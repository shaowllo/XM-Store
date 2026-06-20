"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, User, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductReviews, addReview, getProductAverageRating } from "@/lib/review-store";
import type { Review } from "@/lib/review-store";

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(() => getProductReviews(productId));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hoverStar, setHoverStar] = useState(0);

  const avgRating = useMemo(() => getProductAverageRating(productId), [reviews]);
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    return dist;
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const newReview = addReview(productId, name.trim(), rating, text.trim());
    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setRating(5);
    setText("");
    setShowForm(false);
  };

  return (
    <section className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" />
              Customer Reviews
            </span>
            <h2 className="mt-2 text-2xl font-bold">Reviews ({reviews.length})</h2>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="rounded-full gap-1.5"
            size="sm"
          >
            <Star className="h-4 w-4" />
            Write a Review
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Rating overview */}
          <div>
            {/* Average rating */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{avgRating || "—"}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{reviews.length} reviews</p>

            {/* Distribution bars */}
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star - 1] || 0;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-right text-muted-foreground">{star}</span>
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400/70 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Review form + list */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review form */}
            {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="rounded-2xl border bg-card p-6 space-y-4"
              >
                <h3 className="text-sm font-semibold">Write Your Review</h3>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Your Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmad"
                    required
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoverStar || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Review</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    required
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="rounded-full">
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Review list */}
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-3 text-muted-foreground/40" />
                <p className="text-sm font-medium">No reviews yet</p>
                <p className="text-xs mt-1">Be the first to review this product</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-2xl border bg-card/50 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-sm font-medium">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.userName}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
