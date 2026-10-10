import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
        display: ["var(--font-syne)", "Syne", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        crimson: {
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
        },
      },
      dropShadow: {
        hero: "0 2px 8px rgba(0, 0, 0, 0.95)",
        crisp: "0 4px 12px rgba(0, 0, 0, 0.85)",
      },
    },
  },
  plugins: [],
};

export default config;
