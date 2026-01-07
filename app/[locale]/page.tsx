import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedSubscriptions } from "@/components/landing/FeaturedSubscriptions";
import { WhySnowX } from "@/components/landing/WhySnowX";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><FeaturedSubscriptions /></ScrollReveal>
      <ScrollReveal><WhySnowX /></ScrollReveal>
    </main>
  );
}
