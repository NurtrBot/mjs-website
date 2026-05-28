import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | Call, Email, or Visit Our Anaheim Warehouse",
  description: "Contact Mobile Janitorial Supply: (714) 779-2640, orders@mobilejanitorialsupply.com, or visit us at 3066 E. La Palma Ave., Anaheim, CA 92806. Open Mon-Fri 6:30 AM - 3:00 PM.",
  keywords: "contact Mobile Janitorial Supply, janitorial supply Anaheim, cleaning supply phone number, order janitorial supplies, MJS contact, 714 supply contact",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/contact" },
};

export default function Contact() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ContactPage />
      </main>
      <Footer />
    </>
  );
}
