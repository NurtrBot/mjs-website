import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import ResetPasswordPage from "@/components/ResetPasswordPage";
import Footer from "@/components/Footer";

export const metadata = { title: "Reset Password | Mobile Janitorial Supply", robots: { index: false } };

export default function Reset() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Suspense fallback={null}>
          <ResetPasswordPage />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
