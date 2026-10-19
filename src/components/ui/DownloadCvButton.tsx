"use client";

import React from "react";
import { FileText } from "lucide-react";

export function DownloadCvButton() {
  const handleDownload = () => {
    // Non-blocking telemetry tracking to increment download_stats in Supabase PostgreSQL
    fetch("/api/v1/analytics/cv-download", {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Non-blocking telemetry
    });
  };

  return (
    <a
      href="/api/v1/cv/download"
      download="/cv.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-none border border-red-500/40 bg-zinc-900/80 hover:bg-red-600 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white text-xs sm:text-sm font-semibold px-4 py-2 transition-all cursor-pointer group active:scale-[0.98]"
    >
      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 group-hover:text-white transition-colors" />
      <span>Download CV</span>
    </a>
  );
}
