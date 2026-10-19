import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck } from "lucide-react";

export interface ClientReview {
  id: string;
  clientName: string;
  titleOrCompany: string;
  rating?: number;
  reviewQuote: string;
  verified?: boolean;
}

interface ClientReviewsProps {
  reviews?: ClientReview[];
}

export function ClientReviews({ reviews = [] }: ClientReviewsProps) {
  // Strict condition: If reviews array is empty (0 reviews), return null (completely hidden, zero empty-state boxes or placeholders)
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-16 md:py-24 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
            Client Feedback
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3 font-sans">
            Client Testimonials & Reviews
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Verified feedback from engineering leaders, enterprise partners, and founders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="p-6 bg-surface-base border-surface-border flex flex-col justify-between shadow-tactile-card"
            >
              <div className="space-y-3">
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  {review.verified !== false && (
                    <Badge variant="crimson" className="text-[10px] gap-1 py-0">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Client
                    </Badge>
                  )}
                </div>

                {/* Review Quote */}
                <p className="text-sm text-zinc-200 leading-relaxed italic">
                  &ldquo;{review.reviewQuote}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-4 mt-4 border-t border-surface-border/60">
                <p className="text-sm font-semibold text-white font-sans">{review.clientName}</p>
                <p className="text-xs font-mono text-telemetry-dim">
                  {review.titleOrCompany}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
