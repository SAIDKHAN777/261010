import React from "react";

interface ProjectCoverSvgProps {
  title: string;
  slug?: string;
  className?: string;
}

/**
 * Deterministic Inline React SVG Architectural Blueprint Cover.
 * Generates technical blueprint diagrams without external assets or HTTP requests.
 */
export function ProjectCoverSvg({
  title,
  slug = "system",
  className = "w-full h-full",
}: ProjectCoverSvgProps) {
  // Deterministic hash based on slug string
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const patternId = `grid-${slug.replace(/[^a-z0-9]/gi, "-")}`;
  const accentColor = "#dc2626";
  const glowColor = "rgba(220, 38, 38, 0.15)";

  const nodePositions = [
    { cx: 80, cy: 60, r: 4 },
    { cx: 160, cy: 110, r: 5 },
    { cx: 240, cy: 70, r: 4 },
    { cx: 320, cy: 130, r: 6 },
    { cx: 400, cy: 80, r: 4 },
    { cx: 200, cy: 180, r: 5 },
    { cx: 280, cy: 210, r: 4 },
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 260"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label={`Architectural blueprint for ${title}`}
      role="img"
    >
      <defs>
        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`glow-${patternId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Deep Obsidian Canvas Background */}
      <rect width="480" height="260" fill="#0A0F1A" />

      {/* Spatial Blueprint Grid */}
      <rect width="480" height="260" fill={`url(#${patternId})`} />

      {/* Atmospheric Radial Depth */}
      <circle cx="240" cy="130" r="140" fill={`url(#glow-${patternId})`} />

      {/* Circuit & Architecture Bus Lines */}
      <path
        d="M 40 60 H 160 L 200 110 H 320 L 400 80 H 440"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      <path
        d="M 80 180 H 200 L 240 140 H 360 L 400 200 H 440"
        stroke="#475569"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M 160 110 V 210 H 280"
        stroke="#334155"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.5"
      />

      {/* Architectural Telemetry Nodes */}
      {nodePositions.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.r * 2}
            fill={accentColor}
            opacity="0.1"
          />
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="#0F1420"
            stroke={accentColor}
            strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Monospace Architecture Header Annotation */}
      <g opacity="0.8">
        <rect
          x="20"
          y="18"
          width="170"
          height="22"
          rx="3"
          fill="#0F172A"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />
        <text
          x="28"
          y="33"
          fill="#94A3B8"
          fontFamily="monospace"
          fontSize="10"
          letterSpacing="0.05em"
        >
          SYS://BLUEPRINT/{slug.toUpperCase().slice(0, 12)}
        </text>
      </g>

      {/* Dimension & Coordinates Stamp */}
      <text
        x="460"
        y="242"
        textAnchor="end"
        fill="#475569"
        fontFamily="monospace"
        fontSize="9"
      >
        HEX-ENG // SPEC-{hash.toString(16).toUpperCase()}
      </text>
    </svg>
  );
}
