"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroBanner from "@/components/HeroBanner";
import DeliveryZone from "@/components/DeliveryZone";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBannerRow from "@/components/PromoBannerRow";
import IndustrySection from "@/components/IndustrySection";
import PromoCards from "@/components/PromoCards";
import Testimonials from "@/components/Testimonials";
import ValueProps from "@/components/ValueProps";
import CTABanner from "@/components/CTABanner";
import NewArrivals from "@/components/NewArrivals";
import ReadyToShipAlt from "@/components/ReadyToShipAlt";
import Footer from "@/components/Footer";

export default function Home() {
  // Unique key forces all strips to re-mount and re-shuffle on every visit
  const [refreshKey, setRefreshKey] = useState(Date.now());

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
        <PromoCards />
        <DeliveryZone />
        <FeaturedProducts key={`best-${refreshKey}`} />
        <IndustrySection />
        <ReadyToShipAlt key={`ready-${refreshKey}`} />
        <PromoBannerRow />
        <NewArrivals key={`new-${refreshKey}`} />
        <Testimonials />
        <CTABanner />
        <ValueProps />
      </main>
      <Footer />
    </>
  );
}
