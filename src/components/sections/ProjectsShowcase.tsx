"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCoverSvg } from "@/components/projects/ProjectCoverSvg";
import { ProjectModal, type ProjectData } from "@/components/projects/ProjectModal";
import {
  ExternalLink,
  GitBranch,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const VERIFIED_FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: "proj-1",
    slug: "autonomous-ai-agent-framework",
    title: "Autonomous AI Agent Framework",
    summary:
      "Deterministic LLM reasoning engine dynamically grounded against verified system records. Zero hallucination invariants with incremental SSE streaming chunk serialization.",
    description:
      "Architected a production-grade multi-agent autonomous runtime. Equipped with single-source grounding pipelines, deterministic persona token resolution, and real-time Server-Sent Events (SSE) streaming protocols. Includes abort controller signal cancellation and 30-second upstream timeout guards.",
    techStack: ["Next.js 15", "TypeScript", "Gemini 2.0", "SSE", "Upstash Redis"],
    featured: true,
  },
  {
    id: "proj-2",
    slug: "ecommerce-concurrency-backend",
    title: "Distributed Rate Limiting & Concurrency Engine",
    summary:
      "High-throughput distributed sliding-window rate limiting engine deployed across Upstash Redis with deterministic SHA-256 IP identity salt and graceful degradation paths.",
    description:
      "Built resilient concurrency controls using Redis Sorted Sets with millisecond precision. Designed fail-closed circuits for resource-intensive operations and fail-open paths for critical communications. All visitor IPs are salted with 32-character secrets and hashed via SHA-256 to ensure complete privacy.",
    techStack: ["PostgreSQL", "Prisma ORM", "Upstash Redis", "Docker", "Node.js"],
    featured: true,
  },
  {
    id: "proj-3",
    slug: "madrasa-management-erp",
    title: "Madrasa Enterprise Management ERP",
    summary:
      "Complete multi-tenant institutional resource platform with compound keyset cursor pagination, strict role-based access control, and financial auditing.",
    description:
      "Engineered an enterprise-grade ERP system tailored for institutional management. Implemented keyset cursor pagination over compound PostgreSQL B-tree indices to eliminate offset degradation at scale. Features clean Hexagonal separation between domain logic and infrastructure adapters.",
    techStack: ["React", "Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
    featured: true,
  },
  {
    id: "proj-4",
    slug: "personal-portfolio-aip-backend",
    title: "AI Systems Architecture & High-Conversion Platform",
    summary:
      "Unified machine-readable error communication conforming strictly to IETF RFC 9457, edge middleware auth gates, and dark quiet-luxury frontend design.",
    description:
      "Handcrafted personal systems architecture website. Features zero-drift backend immutability, automated Vitest pure-logic test suites, sliding-window anti-spam protection, and deep-dive technical modals. Strictly conforms to human-crafted spatial cadence and anti-artificial UI directives.",
    techStack: ["Next.js 15", "React 19", "Tailwind CSS", "Vitest", "Supabase"],
    featured: true,
  },
];

interface ProjectsShowcaseProps {
  initialProjects?: ProjectData[];
  initialNextPageToken?: string | null;
}

export function ProjectsShowcase({
  initialProjects = [],
  initialNextPageToken = null,
}: ProjectsShowcaseProps) {
  // Use initialProjects if populated, else use verified architectural projects
  const activeProjects =
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : VERIFIED_FALLBACK_PROJECTS;

  const [projects, setProjects] = useState<ProjectData[]>(activeProjects);
  const [nextPageToken, setNextPageToken] = useState<string | null>(initialNextPageToken);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Extract all unique tech stack tags from current projects
  const allTechTags = Array.from(
    new Set(projects.flatMap((p) => p.techStack || []))
  );

  const filteredProjects = filterTag
    ? projects.filter((p) => p.techStack.includes(filterTag))
    : projects;

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);

    try {
      const url = new URL("/api/v1/projects", window.location.origin);
      url.searchParams.set("page_size", "6");
      url.searchParams.set("page_token", nextPageToken);
      if (filterTag) {
        url.searchParams.set("tech_stack", filterTag);
      }

      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [...prev, ...data.items]);
        setNextPageToken(data.next_page_token);
      }
    } catch (err) {
      console.error("[Projects] Failed to load additional projects:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section id="projects" className="border-t border-white/10 py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/5 text-zinc-400 text-xs px-2.5 py-1 rounded-full font-medium mb-3 border border-white/5 font-sans">
              Verified Artifacts
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 font-sans">
              Engineered Projects & Systems
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans font-normal">
              Autonomous AI agent frameworks, high-throughput distributed backends, and enterprise resource architectures engineered by Said Khan.
            </p>
          </div>

          {/* Dynamic Technology Stack Filter Chips */}
          {allTechTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-end">
              <button
                type="button"
                onClick={() => setFilterTag(null)}
                className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors ${
                  filterTag === null
                    ? "bg-white text-zinc-950 font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                ALL ({projects.length})
              </button>
              {allTechTags.slice(0, 5).map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setFilterTag(filterTag === tech ? null : tech)}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors ${
                    filterTag === tech
                      ? "bg-white text-zinc-950 font-semibold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col group overflow-hidden border-white/10 hover:border-white/20 transition-all duration-200 bg-surface-base rounded-2xl shadow-2xl"
            >
              {/* Visual Architectural Cover (Inline SVG Fallback) */}
              <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-canvas-subtle border-b border-white/10">
                {project.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <ProjectCoverSvg title={project.title} slug={project.slug} />
                )}

                {project.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="crimson" className="shadow-md">
                      <ShieldCheck className="h-3 w-3" />
                      Featured Architecture
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="text-[10px] font-mono text-telemetry-dim uppercase tracking-wider mb-1">
                  SPEC://{project.slug}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors font-sans">
                  {project.title}
                </h3>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 font-sans">
                  {project.summary}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-md font-medium font-sans"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                  className="gap-1.5 text-xs text-red-400 hover:text-red-300 p-0 h-auto font-sans"
                >
                  <span>Inspect Architecture Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>

                <div className="flex items-center gap-1">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                      aria-label={`Repository for ${project.title}`}
                    >
                      <GitBranch className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                      aria-label={`Live site for ${project.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Keyset Cursor Pagination Trigger */}
        {nextPageToken && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={handleLoadMore}
              isLoading={loadingMore}
              className="gap-2 font-mono text-xs"
            >
              <span>Load Subsequent Artifacts</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Accessible Same-Page Details Modal */}
      <ProjectModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
