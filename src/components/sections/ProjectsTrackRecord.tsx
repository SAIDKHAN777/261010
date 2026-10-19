"use client";

import React from "react";
import { ClientReviews, type ClientReview } from "@/components/sections/ClientReviews";
import { ClientCompanyLogos, type ClientCompanyLogo } from "@/components/sections/ClientCompanyLogos";

interface ProjectsTrackRecordProps {
  reviews?: ClientReview[];
  logos?: ClientCompanyLogo[];
  liveProjectsCount?: number;
}

export function ProjectsTrackRecord({
  reviews = [],
  logos = [],
  liveProjectsCount = 100,
}: ProjectsTrackRecordProps) {
  return (
    <section id="projects" className="border-t border-white/10 py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
            Proven Performance
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 font-sans">
            Track Record & Production Impact
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl mx-auto">
            Verified engineering metrics and production delivery performance across AI automation, distributed backends, and full-stack systems architectures.
          </p>
        </div>

        {/* Metrics Bar with Crimson Red Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto py-8 text-center">
          {/* Metric 1 - Dynamic live projects count */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-zinc-950/80 shadow-xl hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all text-center group">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              {liveProjectsCount}+
            </div>
            <div className="w-8 h-0.5 bg-red-600 mx-auto mt-2.5 mb-1.5 rounded-full group-hover:w-12 transition-all duration-300" />
            <div className="text-xs sm:text-sm font-sans text-zinc-400 mt-2 font-medium tracking-wide">
              Projects Engineered & Delivered
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-zinc-950/80 shadow-xl hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all text-center group">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              99.8%
            </div>
            <div className="w-8 h-0.5 bg-red-600/70 mx-auto mt-2.5 mb-1.5 rounded-full group-hover:w-12 transition-all duration-300" />
            <div className="text-xs sm:text-sm font-sans text-zinc-400 mt-2 font-medium tracking-wide">
              Client Satisfaction Rate
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-zinc-950/80 shadow-xl hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all text-center group">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              100%
            </div>
            <div className="w-8 h-0.5 bg-red-600/70 mx-auto mt-2.5 mb-1.5 rounded-full group-hover:w-12 transition-all duration-300" />
            <div className="text-xs sm:text-sm font-sans text-zinc-400 mt-2 font-medium tracking-wide">
              Delivery & Uptime Success
            </div>
          </div>
        </div>

        {/* Client / Company Logos Bar (Strictly returns null if empty) */}
        <ClientCompanyLogos logos={logos} />

        {/* Dynamic Client Reviews Slot (Directly Below Metrics: Returns null if 0 reviews) */}
        <div className="mt-8">
          <ClientReviews reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
