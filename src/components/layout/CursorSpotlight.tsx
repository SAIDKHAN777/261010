"use client";

import React, { useEffect } from "react";

export function CursorSpotlight() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      id="cursor-spotlight"
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300 bg-[radial-gradient(700px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(220,38,38,0.14),transparent_75%)]"
      aria-hidden="true"
    />
  );
}
