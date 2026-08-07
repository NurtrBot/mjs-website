import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import AssistantPage from "@/components/AssistantPage";

export const metadata: Metadata = {
  title: "AI Supply Advisor | Find Exactly What You Need",
  description:
    "Chat with our AI supply advisor to find products, build supply lists, and get expert recommendations for your facility. Powered by Mobile Janitorial Supply.",
  openGraph: {
    title: "AI Supply Advisor | Mobile Janitorial Supply",
    description: "Chat with our AI to find the right janitorial products for any job.",
    url: "https://www.mobilejanitorialsupply.com/assistant",
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/assistant",
  },
};

export default function Page() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main><AssistantPage /></main>
      <Footer />
    </>
  );
}
