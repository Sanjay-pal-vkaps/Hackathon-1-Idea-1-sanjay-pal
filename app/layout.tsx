import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Iturrieta Sagardotegia",
    template: "%s · Iturrieta",
  },
  description:
    "Basque cider house reservations and restaurant operations — book a table or sign in as staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-warm-ivory text-charcoal">
        {children}
      </body>
    </html>
  );
}
