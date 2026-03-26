import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
