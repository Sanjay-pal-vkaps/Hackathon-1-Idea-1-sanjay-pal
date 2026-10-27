import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { LandingCider } from "@/components/landing/landing-cider";
import { LandingExperience } from "@/components/landing/landing-experience";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingGallery } from "@/components/landing/landing-gallery";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMenu } from "@/components/landing/landing-menu";
import { LandingStory } from "@/components/landing/landing-story";
import { LandingTxotx } from "@/components/landing/landing-txotx";
import { LandingVisit } from "@/components/landing/landing-visit";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-landing-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iturrieta Sagardotegia — Basque Cider House & Restaurant in Aramaio",
  description:
    "Authentic Basque cider house in Aramaio, Álava. 100% organic natural cider, the traditional Txotx ritual, charcoal-grilled txuletoia, and warm hospitality.",
  openGraph: {
    title: "Iturrieta Sagardotegia · Aramaio, Basque Country",
    description: "Organic cider, traditional Txotx, and Basque cuisine in the mountains of Aramaio. Reserve your table.",
  },
};

export default function HomePage() {
  return (
    <div className={`landing-page ${cormorant.variable}`}>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStory />
        <LandingTxotx />
        <LandingCider />
        <LandingMenu />
        <LandingExperience />
        <LandingGallery />
        <LandingVisit />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
