'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const mouseRef = useRef({ x: -500, y: -500 });
  const posRef = useRef({ x: -500, y: -500 });
  const glowElRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse / desktop)
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!visible) {
        setVisible(true);
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // 60FPS fluid Lerp animation loop for organic, soft trailing light
    const render = () => {
      const mouse = mouseRef.current;
      const pos = posRef.current;

      pos.x += (mouse.x - pos.x) * 0.2;
      pos.y += (mouse.y - pos.y) * 0.2;

      if (glowElRef.current) {
        glowElRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* ==============================================================
          AMBIENT SPOTLIGHT / CURSOR GLOW
          Matches the background's crimson/rose smoke atmospheric tone.
          Seamlessly blends with the obsidian black and neon smoke.
          ============================================================== */}
      <div
        ref={glowElRef}
        className="fixed top-0 left-0 -ml-[370px] -mt-[370px] w-[740px] h-[740px] pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle 370px at center, rgba(225, 29, 72, 0.24) 0%, rgba(244, 63, 94, 0.15) 25%, rgba(190, 18, 60, 0.08) 50%, rgba(136, 19, 55, 0.03) 70%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
