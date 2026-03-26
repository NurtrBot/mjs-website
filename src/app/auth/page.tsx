import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import AuthPage from "@/components/AuthPage";
import Footer from "@/components/Footer";

export default function Auth() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <AuthPage />
      </main>
      <Footer />
    </>
  );
}
