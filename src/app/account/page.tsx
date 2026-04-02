import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import AccountDashboard from "@/components/AccountDashboard";
import Footer from "@/components/Footer";

export default function Account() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <AccountDashboard />
      </main>
      <Footer />
    </>
  );
}
