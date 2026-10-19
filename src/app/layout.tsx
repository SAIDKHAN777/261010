import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";
import { ToastProvider } from "@/components/ui/toast";
import { CursorSpotlight } from "@/components/layout/CursorSpotlight";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
  description: SITE_CONFIG.tagline,
  metadataBase: new URL(SITE_CONFIG.domain),
  authors: [{ name: SITE_CONFIG.name }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.domain,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.tagline,
    siteName: `${SITE_CONFIG.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.tagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas-deep text-slate-100 antialiased selection:bg-red-600/30 selection:text-white">
        <CursorSpotlight />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
