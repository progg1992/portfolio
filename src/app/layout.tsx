import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { indexable, siteUrl } from "@/lib/site";
import "./globals.css";

// Every route on this site must be fully static (ADR 0001). Next.js validates this
// at build time, and unlisted dynamic params wait for the complete static result,
// so an unknown /work slug returns a real 404 instead of a 200 shell.
export const ensureStatic = "navigation";

// Self-hosted variable fonts (SIL Open Font License; see src/fonts/*-OFL.txt).
// Builds never fetch from a third party, which keeps CI reproducible.
const geistSans = localFont({
  src: "../fonts/Geist-Variable-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable-latin.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pierce Rogg",
    template: "%s | Pierce Rogg",
  },
  description: "Technical project manager, principal technologist, and systems operations leader.",
  metadataBase: new URL(siteUrl),
  openGraph: { type: "website", siteName: "Pierce Rogg", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  // Belt and braces with the X-Robots-Tag header in next.config.ts (PTR-13).
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-control bg-cyan px-4 py-3 font-semibold text-obsidian focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
