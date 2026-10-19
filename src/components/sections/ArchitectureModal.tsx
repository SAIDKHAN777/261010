"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ArchitecturePillar {
  id: string;
  number: string;
  title: string;
  category: string;
  overview: string;
  stack: string[];
  cardA: {
    title: string;
    items: string[];
  };
  cardB: {
    title: string;
    items: string[];
  };
}

interface ArchitectureModalProps {
  pillar: ArchitecturePillar | null;
  onClose: () => void;
}

export function ArchitectureModal({ pillar, onClose }: ArchitectureModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Accessible Escape key listener
  useEffect(() => {
    if (!pillar) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pillar, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (pillar) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [pillar]);

  // Active mousemove tracking inside modal dialog
  useEffect(() => {
    if (!pillar) return;

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [pillar]);

  if (!pillar) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="architecture-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Deep obsidian frosted backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Interactive Crimson Mouse Cursor Spotlight on top of backdrop */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 bg-[radial-gradient(700px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(220,38,38,0.18),transparent_75%)]"
        aria-hidden="true"
      />

      {/* Enhanced modal container with balanced crimson ambient glow */}
      <div
        ref={modalRef}
        className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-red-500/25 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_70px_rgba(220,38,38,0.22)] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Interactive Mouse Cursor Spotlight inside modal to illuminate cards */}
        <div
          className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(220,38,38,0.14),transparent_70%)]"
          aria-hidden="true"
        />

        {/* Minimal, elegant 'X' close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 z-30"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Styling */}
        <div className="relative z-10">
          {/* Top Pill Badge with Crimson Accent */}
          <div className="inline-flex items-center bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium mb-3 border border-red-500/20 font-sans">
            {pillar.category}
          </div>

          {/* Modal Title: Clean, modern bold Sans-Serif font */}
          <h2
            id="architecture-modal-title"
            className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight pr-10"
          >
            {pillar.title}
          </h2>
        </div>

        {/* Overview */}
        <div className="mt-4 relative z-10">
          <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-900/60 p-4 rounded-xl border border-white/5">
            {pillar.overview}
          </p>
        </div>

        {/* Technology Stack */}
        <div className="mt-6 relative z-10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5 font-sans">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {pillar.stack.map((item) => (
              <span
                key={item}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-md font-medium font-sans"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Two-Column Structured Card Layout (Subtle crimson border highlights on hover) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {/* Card A: Engineering Implementation */}
          <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5 flex flex-col hover:border-red-500/35 hover:shadow-[0_0_25px_rgba(220,38,38,0.1)] transition-all">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 mb-3.5 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{pillar.cardA.title}</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans flex-1">
              {pillar.cardA.items.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-zinc-500 font-mono mt-0.5 select-none shrink-0">
                    —
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card B: Reliability & Security */}
          <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5 flex flex-col hover:border-red-500/35 hover:shadow-[0_0_25px_rgba(220,38,38,0.1)] transition-all">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 mb-3.5 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{pillar.cardB.title}</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans flex-1">
              {pillar.cardB.items.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-zinc-500 font-mono mt-0.5 select-none shrink-0">
                    —
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
