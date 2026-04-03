import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NeuroDx - Clinical Decision Support for Neurological Diagnosis",
  description:
    "AI-powered clinical decision support system for neurological localization, etiology analysis, and differential diagnosis.",
  keywords: [
    "neurology",
    "clinical decision support",
    "diagnosis",
    "medical AI",
    "neurological assessment",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0369a1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
