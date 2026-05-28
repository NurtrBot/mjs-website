import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategoryPage from "@/components/CategoryPage";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.mobilejanitorialsupply.com";

/* ─────────────────────────────────────────────────────────────
   Category SEO data — hand-crafted metadata for each category.
   Each entry is optimized for the specific search terms people
   use when looking for these products.
   ───────────────────────────────────────────────────────────── */
const categorySeo: Record<string, { title: string; description: string; keywords: string; h1: string }> = {
  "paper-products": {
    title: "Paper Products | Commercial Towels, Toilet Tissue & Dispensers",
    description: "Shop bulk paper products at wholesale prices: multifold & roll paper towels, 2-ply toilet tissue, jumbo roll bath tissue, facial tissue, seat covers, and dispensers. Free 1-3 day delivery in SoCal.",
    keywords: "commercial paper towels, wholesale toilet tissue, multifold towels, paper towel dispenser, bulk bathroom tissue, jumbo roll tissue, c-fold towels, commercial restroom supplies",
    h1: "Paper Products",
  },
  "cleaning-chemicals": {
    title: "Cleaning Chemicals | Wholesale Degreasers, Disinfectants & Floor Care",
    description: "Professional-grade cleaning chemicals at wholesale prices: degreasers, disinfectants, floor strippers & finishes, glass cleaners, hand soap, dish soap, and carpet care. Free local delivery.",
    keywords: "wholesale cleaning chemicals, commercial degreaser, floor stripper, disinfectant cleaner, glass cleaner concentrate, bulk hand soap, janitorial chemicals, floor finish, carpet shampoo",
    h1: "Cleaning Chemicals",
  },
  "trash-liners": {
    title: "Trash Liners & Can Liners | 7-60 Gallon — Clear, Black & Compostable",
    description: "Wholesale trash liners in every size: 7-10, 12-16, 20-30, 33, 40-45, 56, and 60 gallon. Clear high-density, black low-density, drawstring, and compostable options. Free local delivery.",
    keywords: "wholesale trash bags, commercial can liners, clear trash liners, black garbage bags, 33 gallon trash bags, 40-45 gallon liners, compostable trash bags, bulk trash liners, janitorial trash bags",
    h1: "Trash Liners",
  },
  "gloves-safety": {
    title: "Gloves & Safety | Nitrile, Vinyl & Latex Gloves + PPE",
    description: "Disposable gloves at wholesale: nitrile (blue, black, orange diamond 8mil), vinyl, and latex in S-XL. Plus face masks, N95 respirators, aprons, shoe covers, and safety PPE. Free local delivery.",
    keywords: "wholesale nitrile gloves, disposable gloves bulk, black nitrile gloves, vinyl gloves, latex gloves, N95 respirator, face masks, safety PPE, exam gloves, 8 mil diamond gloves",
    h1: "Gloves & Safety",
  },
  "packaging-film": {
    title: "Packaging Film & Shipping Supplies | Stretch Wrap, Bubble Wrap & Tape",
    description: "Wholesale packaging supplies: stretch wrap (hand & machine grade, colored), bubble cushioning wrap, carton sealing tape, packing peanuts, and steel strapping. Free local delivery in SoCal.",
    keywords: "stretch wrap wholesale, bubble wrap bulk, packing tape, shipping supplies, machine stretch film, colored stretch wrap, bundling film, packing peanuts, steel strapping, packaging materials",
    h1: "Packaging & Film",
  },
  breakroom: {
    title: "Breakroom Supplies | Cups, Plates, Cutlery, Napkins & Food Service",
    description: "Wholesale breakroom and food service supplies: paper hot cups, plastic cold cups, plates, forks/spoons/knives, napkins, food storage bags, and eco-friendly dinnerware. Free local delivery.",
    keywords: "breakroom supplies wholesale, paper cups bulk, disposable plates, plastic cutlery, commercial napkins, food service disposables, paper hot cups, break room essentials",
    h1: "Breakroom",
  },
  equipment: {
    title: "Equipment & Tools | Mops, Brooms, Vacuums, Floor Machines & More",
    description: "Commercial janitorial equipment: floor machines, wet/dry vacuums, mops & buckets, brooms, dust mops, spray bottles, microfiber systems, carpet extractors, and air movers. Wholesale prices.",
    keywords: "commercial floor machine, janitorial equipment, mop bucket wringer, wet dry vacuum, dust mop, microfiber mop system, carpet extractor, brooms dustpans, spray bottles, cleaning equipment",
    h1: "Equipment & Tools",
  },
  "floor-care": {
    title: "Floor Care | Pads, Chemicals, Machines & Carpet Equipment",
    description: "Complete floor care supplies: stripping pads, buffing pads, floor strippers & finishes, neutral cleaners, carpet shampoo, extraction equipment, bonnets, and floor machines. Wholesale prices.",
    keywords: "floor care supplies, floor stripping pads, buffing pads, floor stripper, floor finish wax, carpet extraction, floor machine, carpet bonnet, floor sealer, spray buff",
    h1: "Floor Care",
  },
  "car-detailing": {
    title: "Car Detailing Supplies | Wash, Wax, Glass Care & Air Fresheners",
    description: "Professional car detailing products: Platinum Knight ceramic shampoo, wash & foam, carnauba wax, glass cleaner, detailing buckets, and Wonder Wafers air fresheners in bulk. Wholesale prices.",
    keywords: "car detailing supplies, auto detailing products, ceramic car shampoo, carnauba wax, car wash supplies, Wonder Wafers air freshener, glass cleaner automotive, detailing bucket, mobile detailing supplies",
    h1: "Car Detailing",
  },
};

/* ─────────────────────────────────────────────────────────────
   generateMetadata — unique title, description, OpenGraph,
   and keywords for each category page.
   ───────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = categorySeo[slug];

  if (!seo) {
    const fallbackName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${fallbackName} | Mobile Janitorial Supply`,
      description: `Shop ${fallbackName} at wholesale prices. Free 1-3 day local delivery in Southern California.`,
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/category/${slug}`,
      siteName: "Mobile Janitorial Supply",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`,
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Category JSON-LD — CollectionPage + BreadcrumbList schema.
   Tells Google this is a product listing page with structured
   navigation context.
   ───────────────────────────────────────────────────────────── */
function CategoryJsonLd({ slug }: { slug: string }) {
  const seo = categorySeo[slug];
  if (!seo) return null;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.h1,
    description: seo.description,
    url: `${SITE_URL}/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Mobile Janitorial Supply",
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: seo.h1,
        item: `${SITE_URL}/category/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page Component
   ───────────────────────────────────────────────────────────── */
export default async function CategoryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <CategoryJsonLd slug={slug} />
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
