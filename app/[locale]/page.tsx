import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedSubscriptions } from "@/components/landing/FeaturedSubscriptions";
import { HowItWorks } from "@/components/landing/HowItWorks";

// ISR: Regenerate homepage every hour
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedSubscriptions />
      <HowItWorks />
    </main>
  );
}
