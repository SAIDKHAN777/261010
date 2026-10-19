"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ArchitectureModal, type ArchitecturePillar } from "./ArchitectureModal";

const PILLARS: ArchitecturePillar[] = [
  {
    id: "rate-limiting",
    number: "01",
    title: "Distributed Rate Limiting & Concurrency Control",
    category: "Core Architecture Pattern",
    overview:
      "A high-efficiency sliding-window rate limiting layer built to protect core services and APIs against concurrency spikes and malicious automated traffic.",
    stack: ["Upstash Redis", "TypeScript", "Node.js", "Next.js Edge"],
    cardA: {
      title: "Engineering Implementation",
      items: [
        "Sub-millisecond sliding-window counters implemented using Redis sorted sets.",
        "Granular limits applied per client IP hash to protect inquiry endpoints and sensitive public resources.",
        "Zero performance degradation on client requests with sub-10ms evaluation latency.",
      ],
    },
    cardB: {
      title: "Reliability & Security",
      items: [
        "Deterministic IP hashing with salted SHA-256 secrets to ensure total visitor privacy without storing raw IPs.",
        "Resilient fail-open strategy on contact notifications to guarantee zero dropped client communications during external network interruptions.",
      ],
    },
  },
  {
    id: "agent-runtimes",
    number: "02",
    title: "Autonomous Agent Runtimes & Grounded Context",
    category: "Core Architecture Pattern",
    overview:
      "Production-grade multi-agent execution framework designed for reliable, deterministic reasoning without hallucinations.",
    stack: ["TypeScript", "Vector Embeddings", "PostgreSQL", "LangChain / SDKs"],
    cardA: {
      title: "Engineering Implementation",
      items: [
        "Strict context bounding ensuring agent actions are grounded in validated domain data.",
        "Deterministic tool-calling protocols with verified JSON schema boundaries.",
        "Asynchronous background execution pipelines capable of handling long-running reasoning tasks.",
      ],
    },
    cardB: {
      title: "Reliability & Safety",
      items: [
        "State persistence across agent steps to allow safe rollback upon tool failure.",
        "Strict human-in-the-loop validation barriers for high-stakes decisions and writes.",
      ],
    },
  },
  {
    id: "hexagonal-pagination",
    number: "03",
    title: "Hexagonal Architecture & Keyset Cursor Pagination",
    category: "Core Architecture Pattern",
    overview:
      "Decoupled software architecture separating domain logic from external frameworks, databases, and third-party APIs.",
    stack: ["Next.js App Router", "Prisma ORM", "PostgreSQL", "Dependency Inversion"],
    cardA: {
      title: "Engineering Implementation",
      items: [
        "Hexagonal Ports & Adapters architecture allowing infrastructure changes without modifying business core rules.",
        "Ultra-fast keyset cursor pagination on PostgreSQL tables to guarantee O(1) query time regardless of database size.",
        "Strict input validation via schema contracts before hitting domain entities.",
      ],
    },
    cardB: {
      title: "Maintainability",
      items: [
        "Zero tight-coupling between user interface and backend services.",
        "100% isolated unit and domain test coverage without requiring live database connections.",
      ],
    },
  },
  {
    id: "rfc-edge-guard",
    number: "04",
    title: "RFC 9457 Problem Details & Tier-1 Edge Guard",
    category: "Core Architecture Pattern",
    overview:
      "Strict international API error standard implementation paired with edge security policies for production resilience.",
    stack: ["RFC 9457 Standards", "Next.js Middleware", "HTTP Security Headers"],
    cardA: {
      title: "Engineering Implementation",
      items: [
        "Machine-readable, standardized error responses formatted strictly according to RFC 9457 Problem Details.",
        "Consistent error structures across every API endpoint with correlated tracing IDs.",
        "Edge middleware layer evaluating incoming requests before execution reaches serverless compute.",
      ],
    },
    cardB: {
      title: "Security & Defense",
      items: [
        "Zero leakage of internal stack traces or database error messages to public clients.",
        "Enterprise Content Security Policy (CSP), HSTS, and strict Cross-Origin security headers enforced at the perimeter.",
      ],
    },
  },
];

export function ArchitectureBlueprint() {
  const [selectedPillar, setSelectedPillar] = useState<ArchitecturePillar | null>(null);

  return (
    <section id="architecture" className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-28 sm:py-36">
        {/* Width-Constrained Container (max-w-xl): Aligns headline with list, leaving generous free space on right */}
        <div className="max-w-xl">
          {/* Headline: Medium-sized modern sans-serif, NO top badge, NO subtitle paragraph */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-8 font-sans">
            System Architecture & Core Engineering
          </h2>

          {/* Compact Vertical List with 4 Single-Line Headlines (Strictly NO emojis) */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 divide-y divide-white/5 overflow-hidden shadow-2xl hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all">
            {PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillar(pillar)}
                className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.04] transition-colors duration-150 group cursor-pointer focus-visible:outline-none focus-visible:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="font-mono text-xs text-zinc-500 shrink-0">
                    {pillar.number}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-white transition-colors truncate font-sans">
                    {pillar.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-zinc-500 group-hover:text-red-400 transition-colors">
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible Executive Architecture Modal */}
      <ArchitectureModal
        pillar={selectedPillar}
        onClose={() => setSelectedPillar(null)}
      />
    </section>
  );
}
