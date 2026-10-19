"use client";

import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCoverSvg } from "./ProjectCoverSvg";
import { ExternalLink, GitBranch, Calendar, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  coverImageUrl?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  createdAt?: string | Date;
}

interface ProjectModalProps {
  project: ProjectData | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={project.title}
      description={`SPEC: ${project.slug}`}
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Cover Preview */}
        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden border border-surface-border">
          {project.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ProjectCoverSvg title={project.title} slug={project.slug} />
          )}
          {project.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="crimson" className="shadow-lg backdrop-blur-md">
                <ShieldCheck className="h-3 w-3" />
                Featured Architecture
              </Badge>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-telemetry-dim mb-2 font-sans">
            Executive Summary
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed bg-surface-elevated/40 p-3.5 rounded border border-surface-border/50 font-sans">
            {project.summary}
          </p>
        </div>

        {/* Deep Architecture Description */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-telemetry-dim mb-2 font-sans">
            System Design & Architecture Details
          </h3>
          <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-normal font-sans">
            {project.description}
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-telemetry-dim mb-2.5">
            Technology Stack & Runtime
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="crimson">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Controls & External URLs */}
        <div className="pt-4 border-t border-surface-border/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            {project.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {formatDate(project.createdAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <GitBranch className="h-3.5 w-3.5" />
                  Source Repository
                </Button>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="primary" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live Deployment
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
