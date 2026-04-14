import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { RoleCards } from "@/components/RoleCards";
import { FeatureGrid } from "@/components/FeatureGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustAndStats } from "@/components/TrustAndStats";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <RoleCards />
      <FeatureGrid />
      <HowItWorks />
      <TrustAndStats />
      <Footer />
    </main>
  );
}
