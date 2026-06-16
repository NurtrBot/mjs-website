import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Truck,
  DollarSign,
  Phone,
  Bath,
  Clock,
  Sparkles,
  HeartHandshake,
  GraduationCap,
  Baby,
  SprayCan,
  HandMetal,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Productos de Limpieza para Escuelas | Precios de Mayoreo | Hablamos Espanol",
  description:
    "Suministros de limpieza para escuelas, guarderias y centros educativos. Desinfectantes, papel, jabon, guantes y equipo al por mayor. Entrega gratis en pedidos de $399+. Hablamos Espanol.",
  keywords:
    "productos de limpieza para escuelas, suministros janitorial escuelas, limpieza para guarderias, desinfectante para escuelas",
  openGraph: {
    type: "article",
    title: "Productos de Limpieza para Escuelas | Hablamos Espanol",
    description:
      "Suministros de limpieza al por mayor para escuelas, guarderias y centros educativos.",
    url: "https://www.mobilejanitorialsupply.com/es/escuelas",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/es/escuelas" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mobile Janitorial Supply",
  description:
    "Proveedor de suministros de limpieza al por mayor para escuelas y centros educativos en el Condado de Orange.",
  url: "https://www.mobilejanitorialsupply.com/es/escuelas",
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
    area: "Salones y Areas Comunes",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "Desinfectante Strike Bac Limon",
        why: "Elimina el 99.9% de germenes en escritorios, mesas y superficies de uso comun",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
      {
        name: "Sani-10 Sanitizante EPA",
        why: "Registrado por la EPA — seguro para usar en areas donde los ninos comen y juegan",
        slug: "sani-10-epa-sanitizer",
      },
      {
        name: "Limpiador de Vidrios Concentrado 50:1",
        why: "Limpia ventanas, espejos y superficies de vidrio sin dejar rayas",
        slug: "window-cleaner-concentrate-50-1",
      },
    ],
  },
  {
    area: "Banos Escolares",
    icon: <Bath className="w-5 h-5" />,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    products: [
      {
        name: "Toallas Multifold Premium 2 Capas (4,000/caja)",
        why: "Ideales para banos de alto trafico — dispensado controlado para reducir desperdicio",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "Papel Higienico 2 Capas (96 rollos/caja)",
        why: "Rollos de 500 hojas que duran mas tiempo en banos con uso constante",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
      {
        name: "Jabon de Manos Cherry Rosa",
        why: "Formula suave con aroma agradable — perfecto para manos pequenas",
        slug: "janitors-finest-25630-pink-cherry-hand-soap",
      },
      {
        name: "Bowl Cling Limpiador para Inodoros",
        why: "Formula adherente que limpia profundamente sin salpicar",
        slug: "bowl-cling-10-bowl-cleaner",
      },
    ],
  },
  {
    area: "Cafeteria y Cocina",
    icon: <Baby className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Orange X-Treme Desengrasante Industrial",
        why: "Para cocinas escolares — elimina grasa acumulada de equipos y superficies",
        slug: "janitors-finest-orange-x-treme-heavy-duty-degreaser-gal-80601ea",
      },
      {
        name: "Jabon para Trastes Green Lemon",
        why: "Lava platos, charolas y utensilios de cafeteria de forma eficiente",
        slug: "green-lemon-scented-dish-wash",
      },
    ],
  },
  {
    area: "Seguridad y Limpieza General",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    products: [
      {
        name: "Guantes de Nitrilo Azul (100/caja)",
        why: "Sin polvo ni latex — seguros para personal con alergias",
        slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx",
      },
      {
        name: "Bolsas para Basura 40-45 Gal (250/caja)",
        why: "Resistentes para cafeterias, salones y areas exteriores",
        slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814",
      },
      {
        name: "Cloro Pure Bright",
        why: "Desinfeccion profunda para superficies, pisos y areas de juego",
        slug: "pure-bright-liquid-bleach-6",
      },
      {
        name: "Limpiador Neutral de Pisos Limon",
        why: "Formula neutra segura para todo tipo de pisos — no deja residuo resbaloso",
        slug: "janitors-finest-3158-lemon-neutral-floor-cleaner",
      },
    ],
  },
];

const VALUE_PROPS = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Seguridad Infantil",
    desc: "Productos registrados por la EPA y formulados para ser seguros en entornos con ninos.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Precios para Distritos",
    desc: "Precios de mayoreo ideales para presupuestos escolares. Compramos en volumen para que usted ahorre.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Entrega Gratis",
    desc: "Entrega gratuita en pedidos de $399+ en Orange County, Los Angeles y el Inland Empire.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Hablamos Espanol",
    desc: "Nuestro equipo bilingue esta listo para atenderle en su idioma.",
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
              <span className="text-mjs-red">Escuelas</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                Hablamos Espanol
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                Productos de Limpieza para Escuelas
              </h1>
              <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
                La seguridad de los ninos es nuestra prioridad. Ofrecemos desinfectantes
                registrados por la EPA, productos de papel en volumen, jabon, guantes y todo lo
                que su escuela o guarderia necesita — a precios accesibles.
              </p>
            </div>
          </div>
        </div>

        {/* ── Intro ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-4">
              Limpieza Profesional para Entornos Educativos
            </h2>
            <p className="text-mjs-gray-500 text-base md:text-lg leading-relaxed">
              Las escuelas, guarderias y centros educativos tienen necesidades unicas de limpieza.
              Los ninos tocan todo, comparten espacios y son mas vulnerables a los germenes. Por
              eso es fundamental utilizar productos que desinfecten de verdad, que sean seguros
              para los mas pequenos y que rindan lo suficiente para cubrir espacios grandes. En
              Mobile Janitorial Supply trabajamos con escuelas de todo el Condado de Orange para
              proporcionarles exactamente eso.
            </p>
          </div>
        </div>

        {/* ── Product Areas ── */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
                Lo Que Su Escuela Necesita
              </h2>
              <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                Desde los salones de clase hasta la cafeteria, tenemos cada area cubierta.
                Haga clic en cualquier producto para ver precios y ordenar.
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

        {/* ── Child Safety Callout ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 md:p-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3">
                    La Seguridad de los Ninos es Nuestra Prioridad
                  </h3>
                  <p className="text-blue-800 leading-relaxed mb-4">
                    Todos nuestros desinfectantes estan registrados por la EPA, lo que significa
                    que han sido evaluados y aprobados para su eficacia y seguridad. El Sani-10
                    es seguro para superficies donde los ninos comen y juegan. El Strike Bac
                    elimina germenes en escritorios y mesas sin dejar residuos daninos.
                  </p>
                  <p className="text-blue-800 leading-relaxed">
                    Tambien ofrecemos precios especiales por volumen para distritos escolares.
                    Si su escuela o distrito necesita una cotizacion para multiples planteles,
                    estamos listos para ayudarle a armar un programa que se ajuste a su
                    presupuesto.
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
              Por Que las Escuelas Nos Eligen
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Trabajamos con escuelas publicas, privadas, guarderias y centros de cuidado infantil
              en todo el sur de California.
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
              Cotizaciones especiales para escuelas y distritos escolares. Diganos cuantos
              planteles tiene y le preparamos un programa de suministros a la medida.
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
