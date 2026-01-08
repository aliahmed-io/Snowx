import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedSubscriptions } from "@/components/landing/FeaturedSubscriptions";
import { WhySnowX } from "@/components/landing/WhySnowX";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <FeaturedSubscriptions />
      <WhySnowX />
    </main>
  );
}
