"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/#overview" },
    { label: "Architecture", href: "/#architecture" },
    { label: "Projects", href: "/#projects" },
    { label: "About Me", href: "/about" },
  ];

  return (
    <header className="w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      {/* Far-Left Brand (Corner Aligned): No icon, no glyphs, no hyphens */}
      <Link
        href="/#overview"
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded transition-colors group flex flex-col text-left"
      >
        <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
          Said Khan
        </span>
        <span className="text-xs sm:text-sm font-medium text-zinc-400 mt-0.5 font-sans">
          AI Solutions Architect
        </span>
      </Link>

      {/* Center Navigation: Exactly 4 Links (Overview, Architecture, Projects, About Me) */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors font-sans"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Far-Right Action Button (Corner Aligned): Crimson Red CTA */}
      <div className="hidden sm:flex items-center">
        <Link href="/#contact" className="inline-flex">
          <Button
            variant="primary"
            size="sm"
            className="rounded-none bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-[0.98]"
          >
            Consultation
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="flex md:hidden items-center">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-none bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-white/10 bg-black/95 backdrop-blur-md px-6 py-4 space-y-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-sans tracking-wide text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-white/10">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex"
            >
              <Button
                variant="primary"
                size="sm"
                className="rounded-none w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] text-xs"
              >
                Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
