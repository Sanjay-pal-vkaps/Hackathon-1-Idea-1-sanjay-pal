import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing/landing-experience";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingRoleCards } from "@/components/landing/landing-role-cards";
import { LandingVisit } from "@/components/landing/landing-visit";

export const metadata: Metadata = {
  title: "Iturrieta Sagardotegia — Book a table",
  description:
    "Basque cider house hospitality in Aramaio. Book online, manage your visit, or sign in as restaurant staff.",
};

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingExperience />
        <LandingVisit />
        <LandingRoleCards />
      </main>
      <LandingFooter />
    </>
  );
}
