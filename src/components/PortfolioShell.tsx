"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ArchitectureBlueprint } from "@/components/sections/ArchitectureBlueprint";
import { ProjectsTrackRecord } from "@/components/sections/ProjectsTrackRecord";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import type { ClientReview } from "@/components/sections/ClientReviews";
import type { ClientCompanyLogo } from "@/components/sections/ClientCompanyLogos";
import type { ProjectData } from "@/components/projects/ProjectModal";

export interface PortfolioShellProps {
  initialProjects?: ProjectData[];
  initialNextPageToken?: string | null;
  totalDownloads?: number;
  reviews?: ClientReview[];
  logos?: ClientCompanyLogo[];
  liveProjectsCount?: number;
}

export function PortfolioShell({
  reviews = [],
  logos = [],
  liveProjectsCount = 100,
}: PortfolioShellProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-canvas-deep">
      {/* Top Fixed Navigation: Edge-to-Edge with 4 Center Links & Corner Action */}
      <Navbar />

      {/* Main Conversion Flow: Hero (Overview) -> Architecture Blueprint -> Projects Track Record -> Contact Inquiry */}
      <main className="flex-1">
        <Hero />
        <ArchitectureBlueprint />
        <ProjectsTrackRecord
          reviews={reviews}
          logos={logos}
          liveProjectsCount={liveProjectsCount}
        />
        <ContactSection />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
