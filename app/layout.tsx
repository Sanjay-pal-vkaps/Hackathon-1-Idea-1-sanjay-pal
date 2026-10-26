import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { PrototypeBanner } from "@/components/ui/prototype-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iturrieta — Reservation System",
  description:
    "Iturrieta restaurant reservation and table management (UI foundation)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-warm-ivory text-charcoal">
        <PrototypeBanner />
        {children}
      </body>
    </html>
  );
}
