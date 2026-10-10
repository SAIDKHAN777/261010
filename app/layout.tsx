import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne, Playfair_Display, DM_Sans } from "next/font/google";
import CursorGlow from "@/components/CursorGlow";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Said Khan | AI Solutions Architect & Full-Stack Engineer",
  description:
    "Interactive scroll-driven portfolio of Said Khan featuring 60FPS frame scrubbing, autonomous multi-agent systems, and high-performance full-stack architectures.",
  authors: [{ name: "Said Khan" }],
  keywords: [
    "Said Khan",
    "AI Solutions Architect",
    "AI Automation Expert",
    "Full-Stack Developer",
    "Next.js 15",
    "React 19",
    "Multi-Agent Systems",
  ],
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} ${playfair.variable} ${dmSans.variable} dark`}
    >
      <body className="bg-[#050505] text-white selection:bg-[#e11d48] selection:text-white font-sans antialiased min-h-screen">
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
