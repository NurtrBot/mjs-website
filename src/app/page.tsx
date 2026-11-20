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
import CTABanner from "@/components/CTABanner";
import ResourceCards from "@/components/ResourceCards";
import ReadyToShipAlt from "@/components/ReadyToShipAlt";
import { BuyItAgain, DueForRestock, AlsoBuy } from "@/components/PersonalStrips";
import Footer from "@/components/Footer";
import MobileCategoryGrid from "@/components/MobileCategoryGrid";

export default function Home() {
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
        <MobileCategoryGrid />
        {/* Signed-in customers with order history get their own strips; everyone else sees the defaults */}
        <BuyItAgain fallback={<FeaturedProducts key={`best-${refreshKey}`} />} />
        <IndustrySection />
        <DueForRestock fallback={<ReadyToShipAlt key={`ready-${refreshKey}`} />} />
        <AlsoBuy />
        <PromoBannerRow />
        <ResourceCards />
        <ReviewsAndMap />
        <CTABanner />
        <ValueProps />
      </main>
      <Footer />
    </>
  );
}
