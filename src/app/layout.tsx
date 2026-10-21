import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Every route on this site must be fully static (ADR 0001). Next.js validates this
// at build time, and unlisted dynamic params wait for the complete static result,
// so an unknown /work slug returns a real 404 instead of a 200 shell.
export const ensureStatic = "navigation";

// Self-hosted variable fonts (SIL Open Font License; see src/fonts/*-OFL.txt).
// Builds never fetch from a third party, which keeps CI reproducible.
const geistSans = localFont({
  src: "../fonts/Geist-Variable.woff2",
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
