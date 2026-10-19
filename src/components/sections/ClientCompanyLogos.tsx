"use client";

import React from "react";

export interface ClientCompanyLogo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface ClientCompanyLogosProps {
  logos?: ClientCompanyLogo[];
}

/**
 * ClientCompanyLogos
 * High-trust B2B social proof presentation component.
 * Strictly returns null if logos array is undefined or empty (0% DOM footprint when empty).
 */
export function ClientCompanyLogos({ logos = [] }: ClientCompanyLogosProps) {
  // Strict conditional visibility: If no logos are provided, return null
  if (!logos || logos.length === 0) {
    return null;
  }

  return (
    <div className="mt-14 pt-10 border-t border-white/10">
      {/* Header Title: 'TRUSTED BY INNOVATIVE TEAMS & CLIENTS' */}
      <h3 className="text-xs font-semibold tracking-widest text-zinc-500 mb-6 text-center font-sans uppercase">
        TRUSTED BY INNOVATIVE TEAMS & CLIENTS
      </h3>

      {/* Logo Row: Centered horizontal flex row with generous spacing */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="flex items-center justify-center cursor-pointer"
          >
            <img
              src={logo.logoUrl}
              alt={logo.name}
              title={logo.name}
              className="h-14 sm:h-16 max-h-16 w-auto object-contain filter drop-shadow-[0_0_1px_rgba(255,255,255,0.45)] hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.4)] hover:scale-105 transition-all duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
