import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ProductDetailPage from "@/components/ProductDetailPage";
import Footer from "@/components/Footer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ProductDetailPage slug={slug} />
      </main>
      <Footer />
    </>
  );
}
