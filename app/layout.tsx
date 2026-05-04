import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ISO IMS Portal — Operon Middle East",
    template: "%s — ISO IMS Portal",
  },
  description:
    "Operon Middle East ISO Integrated Management System Portal — access policies, procedures, work instructions, forms, and non-conformance reports.",
  icons: {
    icon: "/operon-logo-green.png",
    shortcut: "/operon-logo-green.png",
    apple: "/operon-logo-green.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
