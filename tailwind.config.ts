import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          deep: "#0a0a0a", // Deep pitch black / obsidian
          subtle: "#121212",
          muted: "#18181b",
        },
        surface: {
          base: "#0f0f0f",
          elevated: "#171717",
          higher: "#202022",
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(220, 38, 38, 0.35)",
        },
        accent: {
          crimson: {
            DEFAULT: "#dc2626",
            subtle: "rgba(220, 38, 38, 0.12)",
            glow: "rgba(220, 38, 38, 0.35)",
            hover: "#b91c1c",
          },
          // Legacy aliases pointing strictly to crimson to eradicate green and cyan
          emerald: {
            DEFAULT: "#dc2626",
            subtle: "rgba(220, 38, 38, 0.12)",
            glow: "rgba(220, 38, 38, 0.35)",
            hover: "#b91c1c",
          },
          cyan: {
            DEFAULT: "#dc2626",
            subtle: "rgba(220, 38, 38, 0.12)",
            glow: "rgba(220, 38, 38, 0.35)",
            hover: "#b91c1c",
          },
        },
        telemetry: {
          muted: "#a1a1aa",
          dim: "#71717a",
          highlight: "#f4f4f5",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace",
        ],
      },
      boxShadow: {
        "tactile-card": "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)",
        "tactile-elevated": "0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 2px 6px -2px rgba(0, 0, 0, 0.7)",
        "subtle-emerald": "0 0 20px -4px rgba(220, 38, 38, 0.35)",
        "subtle-cyan": "0 0 20px -4px rgba(220, 38, 38, 0.35)",
        "subtle-crimson": "0 0 25px rgba(220, 38, 38, 0.35)",
        "crimson-glow": "0 0 35px rgba(220, 38, 38, 0.25)",
      },
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
