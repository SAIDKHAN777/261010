'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { ClientLogoItem, DEFAULT_CLIENT_LOGOS } from '@/lib/clientsData';

interface TrustBarCarouselProps {
  className?: string;
}

export default function TrustBarCarousel({ className = '' }: TrustBarCarouselProps) {
  const [clients, setClients] = useState<ClientLogoItem[]>(DEFAULT_CLIENT_LOGOS);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [scrollX, setScrollX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollXRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Load client logos from API / database
  useEffect(() => {
    let isMounted = true;
    async function loadClients() {
      try {
        const res = await fetch('/api/clients');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) setClients(json.data);
          }
        }
      } catch (e) {
        console.warn('[TrustBarCarousel] API fetch fallback to default:', e);
      }
    }
    loadClients();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update container width on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || window.innerWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isMobile = containerWidth < 768;
  const isTablet = containerWidth >= 768 && containerWidth < 1024;

  // Geometry: spacious card dimensions matching user reference image (media_1791602942301_0dcc2448.png)
  const cardWidth = isMobile ? 115 : isTablet ? 135 : 155;
  const cardHeight = isMobile ? 145 : isTablet ? 165 : 185;
  const cardGap = isMobile ? 10 : isTablet ? 14 : 18;
  const itemStep = cardWidth + cardGap; // Exact distance between card centers (NO overlapping!)

  // Repeat items 3 times for a seamless infinite looping track
  const loopItems = useMemo(() => {
    if (clients.length === 0) return [];
    return [...clients, ...clients, ...clients].map((item, idx) => ({
      ...item,
      loopKey: `${item.id}-${idx}`,
    }));
  }, [clients]);

  const totalTrackWidth = loopItems.length * itemStep;

  // 60FPS continuous auto-scroll loop (stops completely when hovered so user can inspect!)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Pause completely when mouse is hovering any card or dragging
      if (!isDraggingRef.current && !isPaused && totalTrackWidth > 0) {
        const speedPxPerSec = 50; // Fluid 50px/sec scroll
        setScrollX((prev) => (prev + dt * speedPxPerSec) % totalTrackWidth);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, totalTrackWidth]);

  // Touch and mouse drag handlers for interactive scrubbing
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollXRef.current = scrollX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || totalTrackWidth <= 0) return;
    const dx = e.clientX - dragStartXRef.current;
    const newScroll = (dragStartScrollXRef.current - dx) % totalTrackWidth;
    setScrollX(newScroll < 0 ? newScroll + totalTrackWidth : newScroll);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartScrollXRef.current = scrollX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || totalTrackWidth <= 0) return;
    const dx = e.touches[0].clientX - dragStartXRef.current;
    const newScroll = (dragStartScrollXRef.current - dx) % totalTrackWidth;
    setScrollX(newScroll < 0 ? newScroll + totalTrackWidth : newScroll);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const halfWidth = containerWidth / 2;
  const maxRenderDistance = halfWidth + cardWidth;
  const curveHeight = isMobile ? 24 : 36;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setHoveredKey(null);
        setIsPaused(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full overflow-visible select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Prominent Top Label: TRUSTED BY */}
      <div className="flex items-center justify-center mb-1 pointer-events-none">
        <h3 className="font-sans font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.22em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
          TRUSTED BY
        </h3>
      </div>

      {/* 3D Cylindrical Arc Carousel Track (Exact match to media_1791602942301_0dcc2448.png) */}
      <div
        className="relative w-full flex items-center justify-center py-0 pointer-events-none"
        style={{
          height: `${cardHeight + 15}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {loopItems.map((item, idx) => {
          if (totalTrackWidth <= 0) return null;

          // Exact pixel distance from dead-center of container
          let centerOffset =
            ((idx * itemStep - scrollX) % totalTrackWidth + totalTrackWidth) % totalTrackWidth -
            totalTrackWidth / 2;

          // Wrap around for seamless infinite track
          if (centerOffset < -totalTrackWidth / 2) centerOffset += totalTrackWidth;
          if (centerOffset > totalTrackWidth / 2) centerOffset -= totalTrackWidth;

          // Culling: only render cards within visible viewport margin
          if (Math.abs(centerOffset) > maxRenderDistance) return null;

          // Normalized horizontal position from -1 (left edge) to +1 (right edge)
          const normX = centerOffset / Math.max(halfWidth, 1);
          const absNorm = Math.abs(normX);

          // 3D Smile Arc (Curvature mathematics from user reference image):
          // In the center (normX = 0), card is lower (offsetY = 0)
          // Toward edges (normX = ±1), cards curve smoothly UPWARDS!
          const offsetY = -(Math.pow(absNorm, 1.6) * curveHeight);

          // 3D Perspective Rotation:
          const rotateY = -normX * 14;
          const rotateZ = normX * 3;
          const translateZ = -(absNorm * 34);
          const baseScale = Math.max(0.86, 1.02 - absNorm * 0.08);
          const zIndex = Math.round(30 - absNorm * 15);

          // Smooth edge fade
          const opacity = absNorm > 0.95 ? Math.max(0, (1.2 - absNorm) / 0.25) : 1;

          return (
            /* Outer Anchor: 3D Positioning along the track */
            <div
              key={item.loopKey}
              onMouseEnter={() => {
                setHoveredKey(item.loopKey);
                setIsPaused(true);
              }}
              onMouseLeave={() => {
                setHoveredKey(null);
                setIsPaused(false);
              }}
              onClick={() => setActiveCardId((prev) => (prev === item.id ? null : item.id))}
              className="trust-card-wrapper group cursor-pointer select-none pointer-events-auto"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: `translate(-50%, -50%) translateX(${centerOffset}px) translateY(${offsetY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${baseScale})`,
                zIndex,
                opacity,
                pointerEvents: 'auto',
                transition: isDraggingRef.current
                  ? 'none'
                  : 'transform 0.25s ease-out, opacity 0.2s ease-out',
                willChange: 'transform, opacity',
              }}
            >
              {/* Inner Card: Physical Swell & Pop ("chobi fule uthbe") via globals.css */}
              <div
                className="trust-card-inner w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-zinc-950 relative shadow-[0_16px_40px_rgba(0,0,0,0.85)]"
              >
                {/* Full-Bleed Photograph / Visual Asset */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="trust-card-image w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center p-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-rose-400" />
                    </div>
                  </div>
                )}

                {/* Bottom Elegant Glassmorphic Branding Banner */}
                <div className="absolute inset-x-0 bottom-0 pt-8 pb-2.5 px-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end pointer-events-none">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-white uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      {item.name}
                    </h4>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-300 font-light truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                    {item.tagline}
                  </p>
                </div>

                {/* Top Category Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-mono text-zinc-200 pointer-events-none">
                  {item.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
