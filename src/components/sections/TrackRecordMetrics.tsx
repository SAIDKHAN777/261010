import React from "react";

interface TrackRecordMetricsProps {
  liveProjectsCount?: number;
}

export function TrackRecordMetrics({ liveProjectsCount = 100 }: TrackRecordMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 pt-12 border-t border-white/10 text-center">
      {/* Metric 1 */}
      <div className="p-6 rounded-2xl border border-white/10 bg-surface-base shadow-xl text-center">
        <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
          {liveProjectsCount}+
        </div>
        <div className="text-xs sm:text-sm font-sans text-zinc-400 mt-2 font-medium tracking-wide">
          Projects Engineered & Delivered
        </div>
      </div>

      {/* Metric 2 */}
      <div className="p-6 rounded-2xl border border-white/10 bg-surface-base shadow-xl text-center">
        <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
          99.8%
        </div>
        <div className="text-xs sm:text-sm font-sans text-zinc-400 mt-2 font-medium tracking-wide">
          Client Satisfaction Rate
        </div>
      </div>

      {/* Metric 3 */}
      <div className="p-6 rounded-2xl border border-white/10 bg-surface-base shadow-xl text-center">
        <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
          100%
        </div>
        <div className="text-xs sm:text-sm font-sans text-zinc-400 mt-2 font-medium tracking-wide">
          Delivery & Uptime Success
        </div>
      </div>
    </div>
  );
}
