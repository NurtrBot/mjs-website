import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Phone, Truck, DollarSign, Clock, Globe, ArrowRight, Building2, UtensilsCrossed, GraduationCap, Church } from "lucide-react";

export const metadata: Metadata = {
  title: "Bienvenidos | Suministros de Limpieza al por Mayor | Hablamos Español",
  description:
    "Mobile Janitorial Supply — su proveedor de confianza de productos de limpieza al por mayor en el Sur de California. Químicos, papel, guantes, bolsas, equipo y más. Entrega gratis en pedidos de $399+. Hablamos Español.",
  keywords:
    "suministros de limpieza, productos de limpieza al por mayor, tienda de limpieza, hablamos español, janitorial supply español, limpieza comercial, productos de limpieza Orange County",
  openGraph: {
    type: "website",
    title: "Mobile Janitorial Supply | Hablamos Español",
    description: "Productos de limpieza al por mayor. Entrega gratis. Hablamos Español.",
    url: "https://www.mobilejanitorialsupply.com/es",
    siteName: "Mobile Janitorial Supply",
  },
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/es",
    languages: {
      en: "https://www.mobilejanitorialsupply.com",
      es: "https://www.mobilejanitorialsupply.com/es",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mobile Janitorial Supply",
  description: "Proveedor de suministros de limpieza al por mayor en el Sur de California. Hablamos Español.",
  url: "https://www.mobilejanitorialsupply.com/es",
  telephone: "+1-714-779-2640",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3066 E. La Palma Ave.",
    addressLocality: "Anaheim",
    addressRegion: "CA",
    postalCode: "92806",
    addressCountry: "US",
  },
  availableLanguage: ["English", "Spanish"],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "06:30",
    closes: "15:00",
  },
};

const CITIES = [
  { name: "Anaheim", href: "/es/anaheim", desc: "Nuestra ciudad — visite nuestro almacén", badge: "Local" },
  { name: "Santa Ana", href: "/es/santa-ana", desc: "A solo 10 minutos de nuestro almacén" },
  { name: "Garden Grove", href: "/es/garden-grove", desc: "A solo 5 minutos de nuestro almacén" },
  { name: "Fullerton", href: "/es/fullerton", desc: "A solo 10 minutos de nuestro almacén" },
  { name: "Fountain Valley", href: "/es/fountain-valley", desc: "A solo 15 minutos de nuestro almacén" },
];

const INDUSTRIES = [
  { name: "Restaurantes", href: "/es/restaurantes", icon: <UtensilsCrossed className="w-5 h-5" />, desc: "Desengrasantes, sanitizantes, guantes y más" },
  { name: "Escuelas", href: "/es/escuelas", icon: <GraduationCap className="w-5 h-5" />, desc: "Productos seguros para niños a precios de mayoreo" },
  { name: "Oficinas", href: "/es/oficinas", icon: <Building2 className="w-5 h-5" />, desc: "Todo para mantener sus oficinas impecables" },
  { name: "Iglesias", href: "/es/iglesias", icon: <Church className="w-5 h-5" />, desc: "Precios especiales para organizaciones religiosas" },
];

const CATEGORIES = [
  { name: "Químicos de Limpieza", href: "/category/cleaning-chemicals" },
  { name: "Productos de Papel", href: "/category/paper-products" },
  { name: "Bolsas de Basura", href: "/category/trash-liners" },
  { name: "Guantes y Seguridad", href: "/category/gloves-safety" },
  { name: "Equipo y Herramientas", href: "/category/equipment" },
  { name: "Cuidado de Pisos", href: "/category/floor-care" },
  { name: "Empaque y Película", href: "/category/packaging-film" },
  { name: "Comedor y Cocina", href: "/category/breakroom" },
  { name: "Detallado de Autos", href: "/category/car-detailing" },
];

export default function SpanishHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        {/* Hero */}
        <div className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark">
          <div className="max-w-[1400px] mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6">
              <Globe className="w-4 h-4 text-mjs-gold" />
              <span className="text-sm font-bold text-white">Hablamos Español</span>
              <span className="text-xs text-white/50">|</span>
              <span className="text-xs text-white/70">We speak Spanish</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
              Bienvenidos a<br />
              <span className="text-mjs-red">Mobile Janitorial Supply</span>
            </h1>
            <p className="text-lg md:text-xl text-mjs-gray-300 max-w-2xl mx-auto mb-8">
              Su proveedor de confianza de productos de limpieza al por mayor en el Sur de California.
              Más de 10,000 productos a precios de mayoreo con entrega gratis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-mjs-red hover:bg-mjs-red-dark text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-red-500/20"
              >
                Comprar Ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:7147792640"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-base transition-all"
              >
                <Phone className="w-5 h-5" />
                (714) 779-2640
              </a>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Truck className="w-5 h-5" />, title: "Entrega GRATIS", desc: "En pedidos de $399+" },
                { icon: <DollarSign className="w-5 h-5" />, title: "Precios de Mayoreo", desc: "Ahorre hasta 30%" },
                { icon: <Globe className="w-5 h-5" />, title: "Hablamos Español", desc: "Servicio en su idioma" },
                { icon: <MapPin className="w-5 h-5" />, title: "Almacén Local", desc: "Anaheim, California" },
              ].map((v) => (
                <div key={v.title} className="flex items-center gap-3 p-3 rounded-xl bg-mjs-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-mjs-red/10 text-mjs-red flex items-center justify-center shrink-0">{v.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-mjs-dark">{v.title}</div>
                    <div className="text-[11px] text-mjs-gray-400">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark text-center mb-2">
            Nuestros Productos
          </h2>
          <p className="text-mjs-gray-500 text-center mb-8 max-w-xl mx-auto">
            Todo lo que necesita para la limpieza comercial, industrial y residencial.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg hover:border-mjs-red/30 transition-all group"
              >
                <div className="text-sm font-bold text-mjs-dark group-hover:text-mjs-red transition-colors">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Cities We Serve */}
        <div className="bg-mjs-gray-50 border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-mjs-dark text-center mb-2">
              Ciudades que Servimos
            </h2>
            <p className="text-mjs-gray-500 text-center mb-8 max-w-xl mx-auto">
              Entrega gratis en todo el Condado de Orange, Los Ángeles, Inland Empire y San Diego.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CITIES.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-mjs-red/30 transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-mjs-dark group-hover:text-mjs-red transition-colors">{city.name}</span>
                      {city.badge && (
                        <span className="text-[9px] font-bold bg-mjs-red text-white px-2 py-0.5 rounded-full">{city.badge}</span>
                      )}
                    </div>
                    <div className="text-xs text-mjs-gray-400 mt-0.5">{city.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-mjs-gray-300 group-hover:text-mjs-red transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="bg-mjs-dark">
          <div className="max-w-[1400px] mx-auto px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-2">
              Industrias que Servimos
            </h2>
            <p className="text-mjs-gray-400 text-center mb-8 max-w-xl mx-auto">
              Productos especializados para cada tipo de negocio.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INDUSTRIES.map((ind) => (
                <Link
                  key={ind.href}
                  href={ind.href}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-mjs-red/20 text-mjs-red flex items-center justify-center mb-3">{ind.icon}</div>
                  <div className="text-base font-bold text-white group-hover:text-mjs-red transition-colors">{ind.name}</div>
                  <div className="text-xs text-mjs-gray-400 mt-1">{ind.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact / Visit */}
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="bg-mjs-gray-50 rounded-2xl border border-gray-200 p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-mjs-dark mb-3">Visítenos o Llámenos</h2>
                <p className="text-sm text-mjs-gray-500 mb-6">
                  Nuestro equipo bilingüe está listo para ayudarle a encontrar los productos correctos para su negocio.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-mjs-red mt-0.5 shrink-0" />
                    <div className="text-sm text-mjs-gray-600">3066 E. La Palma Ave., Anaheim, CA 92806</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-mjs-red shrink-0" />
                    <a href="tel:7147792640" className="text-sm text-mjs-gray-600 hover:text-mjs-red transition-colors">(714) 779-2640</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-mjs-red shrink-0" />
                    <div className="text-sm text-mjs-gray-600">Lunes a Viernes, 6:30 AM — 3:00 PM</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:7147792640"
                  className="flex items-center justify-center gap-2 bg-mjs-red hover:bg-mjs-red-dark text-white font-bold py-4 rounded-xl text-base transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Llámenos Hoy
                </a>
                <Link
                  href="/quote"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-mjs-red text-mjs-red font-bold py-4 rounded-xl text-base hover:bg-mjs-red hover:text-white transition-all"
                >
                  Solicitar Cotización
                </Link>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=3066+E+La+Palma+Ave+Anaheim+CA+92806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-mjs-gray-50 border border-gray-200 text-mjs-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Cómo Llegar
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
