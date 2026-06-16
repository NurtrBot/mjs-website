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
  Church,
  UtensilsCrossed,
  SprayCan,
  CalendarClock,
  Users,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Suministros de Limpieza para Iglesias | Precios Especiales | Hablamos Espanol",
  description:
    "Productos de limpieza al por mayor para iglesias y centros comunitarios. Quimicos, papel, bolsas de basura, guantes y equipo. Precios especiales para organizaciones religiosas. Hablamos Espanol.",
  keywords:
    "suministros de limpieza para iglesias, productos de limpieza para iglesia, limpieza iglesia al por mayor, suministros para centros comunitarios",
  openGraph: {
    type: "article",
    title: "Suministros de Limpieza para Iglesias | Hablamos Espanol",
    description:
      "Productos de limpieza al por mayor para iglesias y centros comunitarios con precios especiales.",
    url: "https://www.mobilejanitorialsupply.com/es/iglesias",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/es/iglesias" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mobile Janitorial Supply",
  description:
    "Proveedor de suministros de limpieza al por mayor para iglesias y centros comunitarios en el Condado de Orange.",
  url: "https://www.mobilejanitorialsupply.com/es/iglesias",
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
    area: "Santuario y Salon Principal",
    icon: <Church className="w-5 h-5" />,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    products: [
      {
        name: "Desinfectante Strike Bac Limon",
        why: "Desinfecta bancas, manijas y superficies de alto contacto despues de cada servicio",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
      {
        name: "Limpiador de Vidrios Concentrado 50:1",
        why: "Mantiene ventanas y vitrales limpios y brillantes",
        slug: "window-cleaner-concentrate-50-1",
      },
      {
        name: "Limpiador Neutral de Pisos Limon",
        why: "Seguro para pisos de madera, baldosa y alfombra — no deja residuo",
        slug: "janitors-finest-3158-lemon-neutral-floor-cleaner",
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
        why: "Para banos con alto volumen de uso durante servicios dominicales y eventos",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "Papel Higienico 2 Capas (96 rollos/caja)",
        why: "Cajas grandes que duran semanas — perfecto para iglesias con multiples banos",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
      {
        name: "Jabon de Manos Cherry Rosa",
        why: "Aroma agradable y formula suave para toda la familia",
        slug: "janitors-finest-25630-pink-cherry-hand-soap",
      },
      {
        name: "Bowl Cling Limpiador para Inodoros",
        why: "Limpieza profunda entre servicios para mantener los banos impecables",
        slug: "bowl-cling-10-bowl-cleaner",
      },
    ],
  },
  {
    area: "Cocina y Salon de Eventos",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Orange X-Treme Desengrasante Industrial",
        why: "Para cocinas comerciales de iglesias que preparan comidas comunitarias",
        slug: "janitors-finest-orange-x-treme-heavy-duty-degreaser-gal-80601ea",
      },
      {
        name: "Jabon para Trastes Green Lemon",
        why: "Lava ollas, sartenes y utensilios despues de las cenas de compañerismo",
        slug: "green-lemon-scented-dish-wash",
      },
      {
        name: "Sani-10 Sanitizante EPA",
        why: "Sanitiza mesas y superficies de preparacion para eventos con comida",
        slug: "sani-10-epa-sanitizer",
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
        why: "Para el equipo de limpieza y los voluntarios que preparan alimentos",
        slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx",
      },
      {
        name: "Bolsas para Basura 40-45 Gal (250/caja)",
        why: "Para la limpieza despues de servicios, eventos y actividades comunitarias",
        slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814",
      },
      {
        name: "Cloro Pure Bright",
        why: "Desinfeccion profunda para pisos, cocinas y areas de alto trafico",
        slug: "pure-bright-liquid-bleach-6",
      },
    ],
  },
];

const VALUE_PROPS = [
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Servicio con Corazon",
    desc: "Entendemos la mision de su iglesia. Servimos con el mismo espiritu de comunidad que ustedes.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Precios Especiales",
    desc: "Precios de mayoreo diseñados para organizaciones religiosas y sin fines de lucro.",
  },
  {
    icon: <CalendarClock className="w-6 h-6" />,
    title: "Entregas Programadas",
    desc: "Configuramos entregas recurrentes para que siempre tenga suministros antes del domingo.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Hablamos Espanol",
    desc: "Nuestro equipo bilingue entiende las necesidades de las iglesias hispanas.",
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
              <span className="text-mjs-red">Iglesias</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                <Church className="w-3.5 h-3.5" />
                Hablamos Espanol
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                Suministros de Limpieza para Iglesias
              </h1>
              <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
                Servimos con orgullo a las iglesias de nuestra comunidad. Desde el santuario
                hasta la cocina, le proporcionamos todo lo que necesita para mantener su
                iglesia limpia, acogedora y lista para recibir a su congregacion.
              </p>
            </div>
          </div>
        </div>

        {/* ── Intro ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-4">
              Entendemos las Necesidades de Su Iglesia
            </h2>
            <p className="text-mjs-gray-500 text-base md:text-lg leading-relaxed">
              Las iglesias tienen necesidades unicas. Los fines de semana son los dias de mayor
              actividad, con servicios dominicales, escuela dominical, ensayos del coro y
              actividades juveniles. Durante la semana, hay estudios biblicos, reuniones de
              ministerios y eventos comunitarios. Y las cenas de companerismo y eventos
              especiales requieren una cocina equipada y lista. Nosotros entendemos ese ritmo
              y le ayudamos a estar siempre preparado.
            </p>
          </div>
        </div>

        {/* ── Trusted by Churches ── */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-mjs-gray-400 uppercase tracking-wider mb-3">
                Iglesias que confian en nosotros
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-medium text-mjs-dark">
                <span>Sacred Heart</span>
                <span className="text-mjs-gray-300">|</span>
                <span>Hephatha Lutheran</span>
                <span className="text-mjs-gray-300">|</span>
                <span>St. George Episcopal</span>
                <span className="text-mjs-gray-300">|</span>
                <span>Y muchas mas...</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Areas ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
              Lo Que Su Iglesia Necesita
            </h2>
            <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Organizado por area para facilitar su pedido. Haga clic en cualquier producto
              para ver precios y ordenar directamente.
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

        {/* ── Community Callout ── */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-8 md:p-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-3">
                      Parte de Su Comunidad
                    </h3>
                    <p className="text-amber-800 leading-relaxed mb-4">
                      No somos solo un proveedor — somos parte de la comunidad. Durante mas de
                      30 anos hemos servido a iglesias de todas las denominaciones en el Condado
                      de Orange. Entendemos que muchas iglesias dependen de voluntarios para la
                      limpieza y que los presupuestos son limitados. Por eso ofrecemos precios
                      especiales, productos faciles de usar y entregas programadas para que sus
                      voluntarios tengan todo lo que necesitan sin complicaciones.
                    </p>
                    <p className="text-amber-800 leading-relaxed">
                      Podemos configurar un programa de entregas recurrentes — por ejemplo,
                      cada dos semanas o una vez al mes — para que su iglesia siempre este
                      abastecida. Solo llamenos y con gusto le armamos un plan a la medida.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Value Props ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-3">
              Por Que las Iglesias Nos Eligen
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Servimos a docenas de iglesias y centros comunitarios en todo el sur de California.
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
              Precios especiales para iglesias y organizaciones religiosas. Diganos el tamano
              de su congregacion y le ayudaremos a armar un programa de suministros a su medida.
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
