import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HablaYa — Traducción en vivo ES ↔ EN",
  description:
    "App para hispanohablantes: traduce conversaciones en tiempo real con personas de habla inglesa y te dice exactamente qué responder.",
  applicationName: "HablaYa",
  keywords: [
    "traducción en vivo",
    "español inglés",
    "intérprete",
    "qué decir en inglés",
    "HablaYa",
  ],
};

export const viewport: Viewport = {
  themeColor: "#071612",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
