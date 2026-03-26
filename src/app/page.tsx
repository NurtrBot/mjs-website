import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroBanner from "@/components/HeroBanner";
import DeliveryZone from "@/components/DeliveryZone";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBannerRow from "@/components/PromoBannerRow";
import BrandsBar from "@/components/BrandsBar";
import IndustrySection from "@/components/IndustrySection";
import PromoCards from "@/components/PromoCards";
import Testimonials from "@/components/Testimonials";
import ValueProps from "@/components/ValueProps";
import CTABanner from "@/components/CTABanner";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <HeroBanner />
        <PromoCards />
        <DeliveryZone />
        <FeaturedProducts />
        <IndustrySection />
        <BrandsBar />
        <PromoBannerRow />
        <NewArrivals />
        <Testimonials />
        <CTABanner />
        <ValueProps />
      </main>
      <Footer />
    </>
  );
}
