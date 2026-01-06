import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedSubscriptions } from "@/components/landing/FeaturedSubscriptions";
import { WhySnowX } from "@/components/landing/WhySnowX";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedSubscriptions />
      <WhySnowX />
    </>
  );
}
