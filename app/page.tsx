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
import { LandingVisit } from "@/components/landing/landing-visit";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-landing-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iturrieta Sagardotegia — Basque cider house & restaurant",
  description:
    "Natural cider, Basque cuisine, and convivial dining in Aramaio. Reserve your table at Iturrieta sagardotegia.",
  openGraph: {
    title: "Iturrieta Sagardotegia",
    description: "Basque orchard hospitality in Aramaio — reserve your table.",
  },
};

export default function HomePage() {
  return (
    <div className={`landing-page ${cormorant.variable}`}>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStory />
        <LandingCider />
        <LandingExperience />
        <LandingMenu />
        <LandingGallery />
        <LandingVisit />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
