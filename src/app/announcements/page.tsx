import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementsPage from "@/components/AnnouncementsPage";

export const metadata: Metadata = {
  title: "Announcements | Latest News & Updates",
  description: "Latest announcements, promotions, and news from Mobile Janitorial Supply. Stay updated on new products, delivery changes, and special offers.",
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/announcements" },
};

export default function Announcements() {
  return (
    <>
      <Header />
      <main>
        <AnnouncementsPage />
      </main>
      <Footer />
    </>
  );
}
