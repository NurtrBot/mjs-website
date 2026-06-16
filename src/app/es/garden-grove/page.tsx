import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Suministros de Limpieza en Garden Grove | Entrega al Día Siguiente | Hablamos Español",
  description:
    "Productos de limpieza profesional en Garden Grove, CA. Químicos, toallas de papel, guantes desechables, bolsas de basura al por mayor. Solo 5 minutos de nuestro almacén. Hablamos Español.",
  keywords:
    "suministros de limpieza Garden Grove, productos de limpieza Garden Grove, tienda janitorial Garden Grove",
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/es/garden-grove",
    languages: {
      en: "https://www.mobilejanitorialsupply.com/locations/garden-grove",
      es: "https://www.mobilejanitorialsupply.com/es/garden-grove",
    },
  },
  openGraph: {
    title: "Suministros de Limpieza en Garden Grove | Entrega al Día Siguiente | Hablamos Español",
    description:
      "Productos de limpieza profesional en Garden Grove, CA. Solo 5 minutos de nuestro almacén. Hablamos Español.",
    url: "https://www.mobilejanitorialsupply.com/es/garden-grove",
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
  areaServed: { "@type": "City", name: "Garden Grove" },
  url: "https://www.mobilejanitorialsupply.com/es/garden-grove",
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

export default function GardenGroveEsPage() {
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
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
              <Globe className="w-4 h-4" /> Hablamos Español
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Suministros de Limpieza en Garden Grove</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Su proveedor de confianza a solo minutos de distancia. Nuestro almacén está a 5 minutos de
              Garden Grove, lo que significa entregas rápidas y la opción de recoger su pedido en persona.
              Todo con atención personalizada en español.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: "Entrega GRATIS", desc: "En pedidos de $399+ (subtotal antes de impuestos). Llegamos al siguiente día hábil." },
              { icon: DollarSign, title: "Precios de Mayoreo", desc: "Compre directo del distribuidor. Sin cuotas de membresía." },
              { icon: Globe, title: "Hablamos Español", desc: "Le atendemos en su idioma por teléfono, en persona y por correo." },
              { icon: MapPin, title: "Almacén Local en Anaheim", desc: "A solo 5 minutos de Garden Grove. Su pedido llega rápido." },
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
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Garden Grove Merece un Proveedor Cercano</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Garden Grove es una ciudad diversa llena de restaurantes, negocios familiares y una comunidad
                trabajadora. El corredor de Brookhurst Boulevard es reconocido por su variedad gastronómica y
                comercial, y muchos de esos negocios ya son nuestros clientes. La cercanía de nuestro almacén
                en Anaheim hace que podamos atender a Garden Grove casi como si estuviéramos en la misma ciudad.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Entendemos que cuando un restaurante se queda sin guantes desechables o un servicio de limpieza
                necesita más químicos, no puede esperar varios días. Por eso nos aseguramos de tener todo en
                inventario y listo para entregar al siguiente día hábil — o para que usted lo recoja en nuestro
                almacén cuando lo necesite.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-mjs-dark mb-4">Servicio para Garden Grove</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Almacén:</strong> 3066 E. La Palma Ave., Anaheim, CA 92806</span></li>
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Entrega gratis</strong> en pedidos de $399+ al siguiente día hábil</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Horario:</strong> Lunes a Viernes, 6:30 AM — 3:00 PM</span></li>
                <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Teléfono:</strong> (714) 779-2640</span></li>
                <li className="flex items-start gap-3"><Globe className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Atención en español</strong> — siempre con gusto</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">Productos para Negocios en Garden Grove</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Explore nuestras categorías. Todo disponible con entrega a Garden Grove o para recoger en almacén.</p>
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
              { stat: "5 Min", label: "Desde Nuestro Almacén" },
              { stat: "$399", label: "Mínimo Entrega Gratis" },
              { stat: "Siguiente Día", label: "Entrega Hábil" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Negocios que Atendemos en Garden Grove</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Garden Grove tiene una comunidad empresarial diversa y activa. Estos son algunos de los sectores que servimos con orgullo.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Restaurantes y Cocinas", desc: "Los restaurantes del corredor de Brookhurst y Harbor Blvd necesitan suministros constantes. Nosotros los mantenemos abastecidos." },
                { title: "Servicios de Limpieza", desc: "Las empresas de limpieza residencial y comercial en Garden Grove obtienen precios de mayoreo que les permiten crecer." },
                { title: "Talleres de Autos", desc: "Los talleres mecánicos y negocios de detallado a lo largo de Garden Grove Blvd confían en nuestros desengrasantes y toallas." },
                { title: "Hoteles y Hospedajes", desc: "Los hoteles cerca del corredor turístico necesitan papel higiénico, toallas y químicos de limpieza en volumen." },
                { title: "Tiendas y Mercados", desc: "Los mercados y tiendas locales mantienen sus espacios limpios con nuestros productos de calidad profesional." },
                { title: "Consultorios y Clínicas", desc: "Los profesionales de la salud en Garden Grove requieren guantes, desinfectantes y productos de higiene certificados." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">¿Por Qué Elegir Mobile Janitorial Supply?</h2>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center mb-4">
              No somos una cadena nacional ni un sitio web impersonal. Somos un negocio local con un almacén
              real donde usted puede venir, ver los productos y hablar con alguien que le entiende. Nuestros
              precios compiten con los de las grandes cadenas, pero nuestro servicio es personal. Cuando usted
              llama, le contesta una persona — no una grabación.
            </p>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center">
              Para los negocios de Garden Grove, eso significa un proveedor que responde rápido, entrega a
              tiempo y siempre tiene lo que usted necesita en inventario.
            </p>
          </div>
        </section>

        {/* Map / Directions CTA */}
        <section className="py-12 bg-mjs-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-mjs-dark mb-2">Estamos a 5 Minutos de Garden Grove</h2>
            <p className="text-sm text-mjs-gray-500 mb-4">3066 E. La Palma Ave., Anaheim, CA 92806 — Fácil acceso desde Brookhurst o la autopista 22</p>
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
            <h2 className="text-3xl font-black mb-3">Suministros de Limpieza para Garden Grove</h2>
            <p className="text-sm text-white/80 mb-6">Haga su pedido hoy y reciba entrega gratis en pedidos de $399+. Le atendemos en español.</p>
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
