import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ProductDetailPage from "@/components/ProductDetailPage";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialProduct = getProductBySlug(slug) || null;

  return (
    <>
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        <ProductDetailPage slug={slug} initialProduct={initialProduct} />
      </main>
      <Footer />
    </>
  );
}
