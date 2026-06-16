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
  Building2,
  Coffee,
  SprayCan,
  Trash2,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Suministros de Limpieza para Oficinas | Mayoreo | Hablamos Espanol",
  description:
    "Productos de limpieza para oficinas y edificios comerciales. Papel higienico, toallas, desinfectante, jabon, bolsas de basura y suministros de comedor al por mayor. Hablamos Espanol.",
  keywords:
    "suministros de limpieza para oficinas, productos janitorial oficinas, limpieza comercial oficinas, papel para oficina al por mayor",
  openGraph: {
    type: "article",
    title: "Suministros de Limpieza para Oficinas | Hablamos Espanol",
    description:
      "Productos de limpieza al por mayor para oficinas y edificios comerciales.",
    url: "https://www.mobilejanitorialsupply.com/es/oficinas",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: { canonical: "https://www.mobilejanitorialsupply.com/es/oficinas" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mobile Janitorial Supply",
  description:
    "Proveedor de suministros de limpieza al por mayor para oficinas y edificios comerciales en el Condado de Orange.",
  url: "https://www.mobilejanitorialsupply.com/es/oficinas",
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
    area: "Banos",
    icon: <Bath className="w-5 h-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    products: [
      {
        name: "Toallas Multifold Premium 2 Capas (4,000/caja)",
        why: "Dispensado controlado que reduce el desperdicio en banos de oficina",
        slug: "janitors-finest-5300-premium-2-ply-white-multifold-towels-16-packs-250-sheets-4000-towels",
      },
      {
        name: "Papel Higienico 2 Capas (96 rollos/caja)",
        why: "Rollos de 500 hojas — menos cambios, menos mantenimiento",
        slug: "janitors-finest-2-ply-toilet-tissue-4-3-x-3-5-500-sheets-per-roll-96-rolls-per-case-5602",
      },
      {
        name: "Jabon de Manos Cherry Rosa",
        why: "Aroma profesional y formula suave para el uso diario de los empleados",
        slug: "janitors-finest-25630-pink-cherry-hand-soap",
      },
      {
        name: "Bowl Cling Limpiador para Inodoros",
        why: "Formula adherente que limpia y desodoriza sin salpicar",
        slug: "bowl-cling-10-bowl-cleaner",
      },
    ],
  },
  {
    area: "Areas Comunes",
    icon: <Trash2 className="w-5 h-5" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    products: [
      {
        name: "Bolsas para Basura 40-45 Gal (250/caja)",
        why: "Para botes grandes en pasillos, recepciones y areas de copiado",
        slug: "janitors-finest-can-liners-clear-40-x-48-14-micron-40-45-gallon-250-cs-cl404814",
      },
      {
        name: "Limpiador de Vidrios Concentrado 50:1",
        why: "Deja ventanas, puertas de vidrio y espejos impecables sin rayas",
        slug: "window-cleaner-concentrate-50-1",
      },
      {
        name: "Desinfectante Strike Bac Limon",
        why: "Desinfecta manijas, barandales, elevadores y superficies de alto contacto",
        slug: "strike-bac-lemon-odor-disinfectant-cleaner-gallon-91101ea",
      },
    ],
  },
  {
    area: "Comedor y Break Room",
    icon: <Coffee className="w-5 h-5" />,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    products: [
      {
        name: "Jabon para Trastes Green Lemon",
        why: "Para el lavado manual de tazas, platos y utensilios del comedor",
        slug: "green-lemon-scented-dish-wash",
      },
      {
        name: "Sani-10 Sanitizante EPA",
        why: "Sanitiza superficies de preparacion de alimentos en el area de comedor",
        slug: "sani-10-epa-sanitizer",
      },
    ],
  },
  {
    area: "Limpieza General",
    icon: <SprayCan className="w-5 h-5" />,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    products: [
      {
        name: "Limpiador Neutral de Pisos Limon",
        why: "Seguro para todo tipo de pisos — no deja residuo resbaloso ni opaco",
        slug: "janitors-finest-3158-lemon-neutral-floor-cleaner",
      },
      {
        name: "Guantes de Nitrilo Azul (100/caja)",
        why: "Proteccion para el personal de limpieza al manejar quimicos",
        slug: "life-guard-blue-nitrile-exam-gloves-powder-free-medium-5-mil-100-bx",
      },
      {
        name: "Cloro Pure Bright",
        why: "Desinfeccion profunda para pisos de banos, cocinas y areas de servicio",
        slug: "pure-bright-liquid-bleach-6",
      },
    ],
  },
];

const VALUE_PROPS = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Oficinas Presentables",
    desc: "Productos profesionales que mantienen sus oficinas limpias e impecables para clientes y empleados.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Precios de Mayoreo",
    desc: "Compre en volumen y ahorre. Sin cuotas de membresia ni cargos ocultos.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Entrega Gratis",
    desc: "Entrega gratuita en pedidos de $399+ en Orange County, Los Angeles y el Inland Empire.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Hablamos Espanol",
    desc: "Nuestro equipo bilingue le atiende en su idioma. Estamos aqui para ayudarle.",
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
              <span className="text-mjs-red">Oficinas</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-mjs-red/10 border border-mjs-red/20 text-mjs-red px-3 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Hablamos Espanol
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                Suministros de Limpieza para Oficinas
              </h1>
              <p className="text-lg md:text-xl text-mjs-gray-300 leading-relaxed max-w-2xl mx-auto">
                Mantenga sus oficinas presentables y limpias. Papel higienico, toallas,
                desinfectante, jabon, bolsas de basura y todo lo que necesita para edificios
                comerciales — a precios de mayoreo con entrega gratis.
              </p>
            </div>
          </div>
        </div>

        {/* ── Intro ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark mb-4">
              Su Aliado en Limpieza Comercial
            </h2>
            <p className="text-mjs-gray-500 text-base md:text-lg leading-relaxed">
              Ya sea que usted administre un edificio de oficinas, un consultorio medico, un
              centro de negocios o un espacio de coworking, sabemos que la imagen lo es todo.
              Un espacio de trabajo limpio mejora la productividad, reduce las enfermedades y
              deja una buena impresion en sus clientes. En Mobile Janitorial Supply le
              proporcionamos todos los productos que necesita para mantener cada rincon de su
              oficina en perfectas condiciones.
            </p>
          </div>
        </div>

        {/* ── Product Areas ── */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-mjs-dark mb-3">
                Lo Que Su Oficina Necesita
              </h2>
              <p className="text-mjs-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                Organizado por area para que su equipo de limpieza tenga todo lo necesario.
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

        {/* ── Professional Image Callout ── */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-200 p-8 md:p-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mjs-red/10 text-mjs-red flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-mjs-dark mb-3">
                    La Imagen Profesional de Su Negocio
                  </h3>
                  <p className="text-mjs-gray-500 leading-relaxed mb-4">
                    Los banos limpios, los pisos brillantes y las areas comunes bien mantenidas
                    reflejan la calidad de su negocio. Cuando un cliente visita su oficina, la
                    primera impresion cuenta. Nosotros le ayudamos a que esa impresion siempre
                    sea positiva con productos de alta calidad a precios accesibles.
                  </p>
                  <p className="text-mjs-gray-500 leading-relaxed">
                    Podemos programar entregas recurrentes para que nunca se quede sin suministros.
                    Solo diganos con que frecuencia necesita reabastecer y nosotros nos encargamos
                    del resto.
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
              Por Que Elegirnos para Su Oficina
            </h2>
            <p className="text-mjs-gray-500 max-w-2xl mx-auto">
              Cientos de oficinas y edificios comerciales confian en nosotros para mantener
              sus espacios impecables.
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
              Diganos el tamano de su oficina y le recomendaremos los productos ideales con
              precios de mayoreo. Tambien podemos programar entregas recurrentes.
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
