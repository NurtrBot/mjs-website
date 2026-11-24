"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBannerRow from "@/components/PromoBannerRow";
import IndustrySection from "@/components/IndustrySection";
import ReviewsAndMap from "@/components/ReviewsAndMap";
import ValueProps from "@/components/ValueProps";
import PreFooterBar from "@/components/PreFooterBar";
import ResourceCards from "@/components/ResourceCards";
import ReadyToShipAlt from "@/components/ReadyToShipAlt";
import { BuyItAgain, DueForRestock, AlsoBuy } from "@/components/PersonalStrips";
import Footer from "@/components/Footer";
import MobileCategoryGrid from "@/components/MobileCategoryGrid";

// The interactive home page. app/page.tsx is a thin server wrapper that owns the
// metadata (canonical, hreflang, Open Graph) and renders this component.
export default function HomePage() {
  // Unique key forces all strips to re-mount and re-shuffle on every visit
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey(Date.now());
  }, []);

  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <HeroBanner />
        {/* The page's one H1: the hero slides are artwork, so the heading sits right under them */}
        <div className="max-w-[1400px] mx-auto px-4 pt-4 md:pt-5 -mb-2 md:-mb-3">
          <h1 className="text-center text-[12.5px] sm:text-sm font-semibold tracking-tight text-mjs-gray-500">
            Wholesale janitorial supplies in Southern California
            <span className="hidden sm:inline text-mjs-gray-300"> · </span>
            <span className="hidden sm:inline">Free local delivery from our Anaheim warehouse</span>
          </h1>
        </div>
        <MobileCategoryGrid />
        {/* Signed-in customers with order history get their own strips; everyone else sees the defaults */}
        <BuyItAgain fallback={<FeaturedProducts key={`best-${refreshKey}`} />} />
        <IndustrySection />
        <DueForRestock fallback={<ReadyToShipAlt key={`ready-${refreshKey}`} />} />
        <PromoBannerRow />
        <AlsoBuy />
        <ResourceCards />
        <ReviewsAndMap />
        <ValueProps />
        <PreFooterBar />
      </main>
      <Footer />
    </>
  );
}
