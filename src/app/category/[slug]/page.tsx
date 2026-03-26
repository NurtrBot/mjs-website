import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

export default async function CategoryRoute({
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
        <CategoryPage slug={slug} />
      </main>
      <Footer />
    </>
  );
}
