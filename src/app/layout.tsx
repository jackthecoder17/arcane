import type { Metadata, Viewport } from "next";
import { Marcellus_SC, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Flared glyphic serif — the closest open font to Riot's Beaufort, used for Arcane's titles.
const marcellus = Marcellus_SC({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arcane — Two Cities. One War.",
  description:
    "A fan-made landing page for Arcane, the animated series set in the worlds of Piltover and Zaun.",
};

export const viewport: Viewport = {
  themeColor: "#0b0910",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${marcellus.variable} ${geistMono.variable} antialiased`}
    >
      <body className="grain min-h-dvh">{children}</body>
    </html>
  );
}
