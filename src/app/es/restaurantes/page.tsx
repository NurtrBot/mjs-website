import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  ChefHat,
  ShieldCheck,
  Truck,
  DollarSign,
  Phone,
  Bath,
  UtensilsCrossed,
  Clock,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Suministros para Restaurantes | Productos de Limpieza al por Mayor | Hablamos Espanol",
  description:
    "Todo lo que su restaurante necesita: desengrasantes, sanitizantes, jabon, guantes, bolsas de basura, toallas y mas. Precios de mayoreo con entrega gratis. Hablamos Espanol.",
  keywords:
    "suministros para restaurantes, productos de limpieza para restaurante, desengrasante para cocina, jabon para restaurante, guantes para cocina",
  openGraph: {
    type: "article",
    title: "Suministros para Restaurantes | Hablamos Espanol",
    description:
      "Todo lo que su restaurante necesita para mantenerse limpio y en cumplimiento. Precios de mayoreo.",
    url: "https://www.mobilejanitorialsupply.com/es/restaurantes",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/es/restaurantes" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mobile Janitorial Supply",
  description:
    "Proveedor de suministros de limpieza al por mayor para restaurantes en el Condado de Orange.",
  url: "https://www.mobilejanitorialsupply.com/es/restaurantes",
  telephone: "(714) 779-2640",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3066 E. La Palma Ave.",
    addressLocality: "Anaheim",
    addressRegion: "CA",
    postalCode: "92806",
  },
};

/* ─── Product Data ─── */

interface Product {
  name: string;
  why: string;
  slug: string;
}

interface ProductArea {
  area: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  products: Product[];
}

const PRODUCT_AREAS: ProductArea[] = [
  {
    area: "Cocina",
    icon: <ChefHat className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Orange X-Treme Desengrasante Industrial",
        why: "Elimina grasa de campanas, freidoras y parrillas sin vapores fuertes",
        slug: "janitors-finest-orange-x-treme-heavy-duty-degreaser-gal-80601ea",
      },
      {
        name: "Jabon para Trastes Green Lemon",
        why: "Formula de alta espuma para lavado manual de ollas y sartenes",
        slug: "green-lemon-scented-dish-wash",
      },
      {
        name: "Sani-10 Sanitizante EPA",
        why: "Registrado por la EPA para superficies en contacto con alimentos",
        slug: "sani-10-epa-sanitizer",
      },
    ],
  },
  {
    area: "Banos",
    icon: <Bath className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "Toallas Multifold Premium 2 Capas (4,000/caja)",
        why: "Dispensado controlado que reduce el desperdicio en banos de alto trafico",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "Jabon de Manos Cherry Rosa",
        why: "Aroma agradable que motiva el lavado de manos — esencial para manipuladores de alimentos",
        slug: "janitors-finest-25630-pink-cherry-hand-soap",
      },
      {
        name: "Bowl Cling Limpiador para Inodoros",
        why: "Formula adherente que limpia y desinfecta sin salpicar",
        slug: "bowl-cling-10-bowl-cleaner",
      },
    ],
  },
  {
    area: "Comedor y Servicio",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    products: [
      {
        name: "Papel Higienico 2 Capas (96 rollos/caja)",
        why: "Rollos de 500 hojas que duran mas, reduciendo el mantenimiento durante horas pico",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
      {
        name: "Desinfectante Strike Bac Limon",
        why: "Limpia y desinfecta mesas, sillas y superficies del comedor",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
    ],
  },
  {
    area: "Seguridad y Desechos",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    products: [
      {
        name: "Guantes de Nitrilo Azul (100/caja)",
        why: "Sin polvo, seguros para alimentos — ideales para preparacion y manejo de comida",
        slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx",
      },
      {
        name: "Bolsas para Basura 40-45 Gal (250/caja)",
        why: "Resistentes de 14 micras para cocinas comerciales y botes de basura grandes",
        slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814",
      },
    ],
  },
];

const VALUE_PROPS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Precios de Mayoreo",
    desc: "Productos de grado comercial a precios de distribuidor. Sin cuotas de membresia.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Entrega Gratis",
    desc: "Entrega gratuita en pedidos de $399+ en Orange County, Los Angeles y el Inland Empire.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Hablamos Espanol",
    desc: "Nuestro equipo habla su idioma. Atendemos a la comunidad hispana con orgullo.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Cumplimiento Sanitario",
    desc: "Productos registrados por la EPA que le ayudan a pasar la inspeccion del departamento de salud.",
  },
];

/* ─── Page ─── */

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBar />
      <Header />
      <CategoryNav />

      <main className="bg-white min-h-screen">
        {/* ── Hero ── */}
        <div className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
            <nav className="flex items-center justify-center gap-2 text-xs text-mjs-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">Espanol</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-mjs-red">Restaurantes</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                <ChefHat className="w-3.5 h-3.5" />
                Hablamos Espanol
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                Suministros para Restaurantes
              </h1>
              <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
                Mantenga su cocina impecable y en cumplimiento. Desengrasantes, sanitizantes,
                jabon, guantes, bolsas de basura, toallas y todo lo que su restaurante, taqueria
                o cocina comercial necesita — a precios de mayoreo.
              </p>
            </div>
          </div>
        </div>

        {/* ── Intro ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-4">
              Su Proveedor de Confianza en el Condado de Orange
            </h2>
            <p className="text-mjs-gray-500 text-base md:text-lg leading-relaxed">
              En Mobile Janitorial Supply entendemos las necesidades de los restaurantes hispanos.
              Ya sea que usted tenga una taqueria, un restaurante familiar, un servicio de catering
              o una cocina comercial, tenemos los productos que necesita para mantener su negocio
              limpio, seguro y en cumplimiento con el departamento de salud. Nuestro equipo habla
              espanol y esta listo para ayudarle a encontrar exactamente lo que busca.
            </p>
          </div>
        </div>

        {/* ── Product Areas ── */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
                Lo Que Su Restaurante Necesita
              </h2>
              <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                Organizado por area para que nunca le falte nada. Haga clic en cualquier producto
                para ver precios y hacer su pedido.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {PRODUCT_AREAS.map((area) => (
                <div
                  key={area.area}
                  className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  <div
                    className={`${area.bgColor} px-6 py-4 border-b border-gray-200 flex items-center gap-3`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${area.color}`}
                    >
                      {area.icon}
                    </div>
                    <h3 className={`text-lg font-bold ${area.color}`}>{area.area}</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {area.products.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/product/${product.slug}`}
                        className="flex items-center justify-between bg-mjs-gray-50 rounded-lg p-3 border border-gray-100 hover:border-mjs-red/30 hover:shadow-sm transition-all group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">
                            {product.name}
                          </div>
                          <div className="text-xs text-mjs-gray-400 mt-0.5">{product.why}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors shrink-0 ml-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Health Compliance ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 md:p-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-3">
                    Cumplimiento con el Departamento de Salud
                  </h3>
                  <p className="text-green-800 leading-relaxed mb-4">
                    Sabemos lo importante que es pasar la inspeccion sanitaria. Nuestros
                    sanitizantes estan registrados por la EPA y cumplen con las normas de la FDA
                    para superficies en contacto con alimentos. El desengrasante Orange X-Treme
                    cumple con los estandares de limpieza para campanas y freidoras. Los guantes
                    de nitrilo son aptos para la manipulacion de alimentos.
                  </p>
                  <p className="text-green-800 leading-relaxed">
                    Si no esta seguro de que productos necesita para cumplir con las regulaciones,
                    llamenos. Nuestro equipo puede orientarle sobre los requisitos especificos
                    para su tipo de establecimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Value Props ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Por Que los Restaurantes Nos Eligen
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Servimos a cientos de restaurantes en todo el sur de California. Aqui le explicamos
              por que se quedan con nosotros.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-mjs-red/10 text-mjs-red flex items-center justify-center mx-auto mb-4">
                  {prop.icon}
                </div>
                <h3 className="text-base font-bold text-mjs-dark mb-2">{prop.title}</h3>
                <p className="text-sm text-mjs-gray-500 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hours & Contact ── */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-mjs-red" />
                <div>
                  <div className="text-sm font-bold text-mjs-dark">Horario</div>
                  <div className="text-sm text-mjs-gray-500">Lunes a Viernes, 6:30 AM — 3:00 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-mjs-red" />
                <div>
                  <div className="text-sm font-bold text-mjs-dark">Telefono</div>
                  <div className="text-sm text-mjs-gray-500">(714) 779-2640</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-mjs-red" />
                <div>
                  <div className="text-sm font-bold text-mjs-dark">Direccion</div>
                  <div className="text-sm text-mjs-gray-500">3066 E. La Palma Ave., Anaheim, CA 92806</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-mjs-red to-mjs-red-dark">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Llamenos Hoy — Hablamos Espanol
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Diganos que tipo de restaurante tiene y le armaremos un programa de suministros
              personalizado con precios de mayoreo y entregas programadas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:+17147792640"
                className="inline-flex items-center gap-2 bg-white text-mjs-red font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (714) 779-2640
              </a>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Solicitar Cotizacion
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
