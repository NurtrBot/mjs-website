import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";

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
