import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Suministros de Limpieza en Anaheim | Entrega Gratis | Hablamos Español",
  description:
    "Tienda de suministros de limpieza en Anaheim, CA. Productos de limpieza al por mayor: químicos, papel, guantes, bolsas de basura y equipo. Entrega gratis en pedidos de $399+. Hablamos Español.",
  keywords:
    "suministros de limpieza Anaheim, productos de limpieza Anaheim, tienda janitorial Anaheim, limpieza al por mayor, hablamos español Anaheim",
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/es/anaheim",
    languages: {
      en: "https://www.mobilejanitorialsupply.com/locations/anaheim",
      es: "https://www.mobilejanitorialsupply.com/es/anaheim",
    },
  },
  openGraph: {
    title: "Suministros de Limpieza en Anaheim | Entrega Gratis | Hablamos Español",
    description:
      "Tienda de suministros de limpieza en Anaheim, CA. Productos al por mayor con entrega gratis en pedidos de $399+. Hablamos Español.",
    url: "https://www.mobilejanitorialsupply.com/es/anaheim",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mobile Janitorial Supply",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3066 E. La Palma Ave.",
    addressLocality: "Anaheim",
    addressRegion: "CA",
    postalCode: "92806",
  },
  telephone: "+1-714-779-2640",
  areaServed: { "@type": "City", name: "Anaheim" },
  url: "https://www.mobilejanitorialsupply.com/es/anaheim",
  availableLanguage: ["English", "Spanish"],
};

const categories = [
  { name: "Productos de Papel", href: "/category/paper-products" },
  { name: "Químicos de Limpieza", href: "/category/cleaning-chemicals" },
  { name: "Bolsas de Basura", href: "/category/trash-liners" },
  { name: "Guantes y Seguridad", href: "/category/gloves-safety" },
  { name: "Empaque y Película", href: "/category/packaging-film" },
  { name: "Comedor y Cocina", href: "/category/breakroom" },
  { name: "Equipo y Herramientas", href: "/category/equipment" },
  { name: "Cuidado de Pisos", href: "/category/floor-care" },
  { name: "Detallado de Autos", href: "/category/car-detailing" },
];

export default function AnaheimEsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar />
      <Header />
      <CategoryNav />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-mjs-dark via-mjs-charcoal to-mjs-dark py-20 text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <span className="inline-block bg-mjs-gold/20 text-mjs-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Nuestra Ciudad</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Suministros de Limpieza en Anaheim</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
              Bienvenido a nuestro almacén en el 3066 E. La Palma Ave. Somos sus vecinos en Anaheim y estamos
              aquí para atenderle en español. Visite nuestra tienda, recoja su pedido el mismo día, o reciba
              entrega gratis en pedidos de $399 o más.
            </p>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">
              <Globe className="w-4 h-4" /> Hablamos Español
            </span>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: "Entrega GRATIS", desc: "En pedidos de $399+ (subtotal antes de impuestos). Entrega al siguiente día hábil." },
              { icon: DollarSign, title: "Precios de Mayoreo", desc: "Precios directos de distribuidor, sin membresía ni cuotas." },
              { icon: Globe, title: "Hablamos Español", desc: "Nuestro equipo le atiende en español con gusto. Usted se sentirá como en casa." },
              { icon: MapPin, title: "Almacén Local", desc: "Ubicados aquí mismo en Anaheim. A 5 minutos o menos de cualquier punto de la ciudad." },
            ].map((v) => (
              <div key={v.title} className="bg-mjs-gray-50 rounded-xl p-5 text-center">
                <v.icon className="w-8 h-8 text-mjs-red mx-auto mb-3" />
                <h3 className="font-bold text-mjs-dark text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-mjs-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About / Service Details */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Somos Sus Vecinos en Anaheim</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Mobile Janitorial Supply tiene su almacén principal aquí en Anaheim, sobre la avenida La Palma
                cerca de la autopista 57. No somos una empresa lejana que le envía cajas desde otro estado —
                somos parte de esta comunidad. Cuando usted nos visita, lo recibimos con un saludo y le ayudamos
                a encontrar exactamente lo que necesita.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Ya sea que administre un hotel en el corredor turístico de Disneyland, un restaurante en el
                centro de Anaheim, o un negocio en el Platinum Triangle, estamos a minutos de su puerta.
                Nuestro equipo conoce las necesidades de los negocios locales porque los atendemos todos los días.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-mjs-dark mb-4">Información de la Tienda</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Dirección:</strong> 3066 E. La Palma Ave., Anaheim, CA 92806</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Horario:</strong> Lunes a Viernes, 6:30 AM — 3:00 PM</span></li>
                <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Teléfono:</strong> (714) 779-2640</span></li>
                <li className="flex items-start gap-3"><Globe className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Correo:</strong> orders@mobilejanitorialsupply.com</span></li>
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Entrega gratis</strong> en pedidos de $399+ en OC, LA e Inland Empire</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">Nuestros Productos en Anaheim</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Todos los productos están disponibles para recoger en tienda o para entrega a domicilio.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => (
                <Link key={c.name} href={c.href} className="bg-mjs-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-bold text-mjs-dark hover:border-mjs-red hover:text-mjs-red transition-all text-center">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-mjs-dark text-white">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "10,000+", label: "Productos en Inventario" },
              { stat: "Mismo Día", label: "Recoja en Tienda" },
              { stat: "$399", label: "Mínimo Entrega Gratis" },
              { stat: "0 Millas", label: "Estamos Aquí Mismo" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-mjs-gold">{s.stat}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="py-14 bg-mjs-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">A Quiénes Servimos en Anaheim</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Anaheim es una ciudad de turismo, convenciones y negocios locales prósperos. Nosotros los abastecemos a todos.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Hoteles y Turismo", desc: "Decenas de hoteles cerca del Disneyland Resort necesitan papel, químicos y suministros de limpieza en volumen." },
                { title: "Restaurantes y Cocinas", desc: "Desde el Anaheim Packing District hasta las taquerías locales, proveemos todo para mantener su cocina impecable." },
                { title: "Centro de Convenciones", desc: "El Anaheim Convention Center recibe millones de visitantes. Las limpiezas de eventos requieren suministros confiables." },
                { title: "Oficinas y Edificios", desc: "El Platinum Triangle y las zonas comerciales cuentan con nosotros para la limpieza profesional de sus espacios." },
                { title: "Talleres y Detallado", desc: "Los talleres mecánicos y negocios de detallado de autos a lo largo de La Palma confían en nuestros productos." },
                { title: "Escuelas e Iglesias", desc: "Las instituciones comunitarias de Anaheim merecen productos de calidad a precios justos. Eso es lo que ofrecemos." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map / Directions CTA */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-mjs-dark mb-2">Visítenos en Nuestro Almacén</h2>
            <p className="text-sm text-mjs-gray-500 mb-4">3066 E. La Palma Ave., Anaheim, CA 92806 — Lunes a Viernes, 6:30 AM — 3:00 PM</p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=3066+E+La+Palma+Ave+Anaheim+CA+92806"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-mjs-dark text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-mjs-charcoal transition-colors"
            >
              <MapPin className="w-4 h-4" /> Cómo Llegar
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-mjs-red to-mjs-red-dark py-14 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black mb-3">Su Centro de Suministros de Limpieza en Anaheim</h2>
            <p className="text-sm text-white/80 mb-6">Visítenos en persona, llámenos o solicite una cotización en línea. Le atendemos en español con mucho gusto.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote" className="inline-flex items-center justify-center gap-2 bg-white text-mjs-red font-bold px-8 py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors">
                Solicitar Cotización <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+17147792640" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> (714) 779-2640
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
