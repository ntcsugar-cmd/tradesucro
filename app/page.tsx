import { Navbar } from "@/components/market/Navbar";
import { TickerTape } from "@/components/market/TickerTape";
import { Hero } from "@/components/market/Hero";
import { MarketDashboard } from "@/components/market/MarketDashboard";
import { SearchOffers } from "@/components/market/SearchOffers";
import { SellOffers } from "@/components/market/SellOffers";
import { BuyRequirements } from "@/components/market/BuyRequirements";
import { WhyChoose } from "@/components/market/WhyChoose";
import { FeaturedMills } from "@/components/market/FeaturedMills";
import { IndustryNews } from "@/components/market/IndustryNews";
import { Stats } from "@/components/market/Stats";
import { Footer } from "@/components/market/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <TickerTape />
      <Hero />
      <MarketDashboard />
      <SearchOffers />
      <SellOffers />
      <BuyRequirements />
      <WhyChoose />
      <FeaturedMills />
      <Stats />
      <IndustryNews />
      <Footer />
    </main>
  );
}
