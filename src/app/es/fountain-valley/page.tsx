import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Suministros de Limpieza en Fountain Valley | Precios al por Mayor | Hablamos Español",
  description:
    "Productos de limpieza profesional en Fountain Valley, CA. Químicos, guantes, toallas, bolsas de basura y equipo de limpieza al por mayor. Entrega gratis en pedidos de $399+. Hablamos Español.",
  keywords:
    "suministros de limpieza Fountain Valley, productos de limpieza Fountain Valley, tienda janitorial Fountain Valley",
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/es/fountain-valley",
    languages: {
      en: "https://www.mobilejanitorialsupply.com/locations/fountain-valley",
      es: "https://www.mobilejanitorialsupply.com/es/fountain-valley",
    },
  },
  openGraph: {
    title: "Suministros de Limpieza en Fountain Valley | Precios al por Mayor | Hablamos Español",
    description:
      "Productos de limpieza profesional en Fountain Valley, CA. Entrega gratis en pedidos de $399+. Hablamos Español.",
    url: "https://www.mobilejanitorialsupply.com/es/fountain-valley",
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
  areaServed: { "@type": "City", name: "Fountain Valley" },
  url: "https://www.mobilejanitorialsupply.com/es/fountain-valley",
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

export default function FountainValleyEsPage() {
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
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Suministros de Limpieza en Fountain Valley</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Servicio rápido y confiable para su negocio en Fountain Valley. Nuestro almacén en Anaheim está
              a solo 15 minutos, y le ofrecemos entrega gratis en pedidos de $399 o más. Todo con atención
              profesional en español.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: "Entrega GRATIS", desc: "En pedidos de $399+ (subtotal antes de impuestos). Entrega al siguiente día hábil a Fountain Valley." },
              { icon: DollarSign, title: "Precios de Mayoreo", desc: "Compre al por mayor directo del distribuidor. Sin membresía requerida." },
              { icon: Globe, title: "Hablamos Español", desc: "Nuestro equipo le asiste en español. Llame, visite o escriba con total confianza." },
              { icon: MapPin, title: "Almacén Local en Anaheim", desc: "A 15 minutos de Fountain Valley. Entrega confiable y puntual." },
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
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Fountain Valley: Calidad de Vida, Calidad en Suministros</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Fountain Valley es una ciudad reconocida por su calidad de vida, sus parques bien cuidados y una
                comunidad empresarial sólida. En los alrededores de Mile Square Park y a lo largo de los
                corredores comerciales de Brookhurst Street y Euclid Avenue, hay cientos de negocios que
                necesitan productos de limpieza confiables a precios razonables.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Ya sea que tenga un consultorio médico, un restaurante, una oficina o un servicio de limpieza
                que opera en Fountain Valley, nosotros tenemos todo lo que necesita. Y lo mejor: nuestro equipo
                habla español, así que puede comunicarse con nosotros sin complicaciones. No importa si necesita
                hacer un pedido grande o tiene una pregunta sobre un producto — estamos aquí para ayudarle.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-mjs-dark mb-4">Servicio para Fountain Valley</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Almacén:</strong> 3066 E. La Palma Ave., Anaheim, CA 92806</span></li>
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Entrega gratis</strong> en pedidos de $399+ al siguiente día hábil</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Horario:</strong> Lunes a Viernes, 6:30 AM — 3:00 PM</span></li>
                <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Teléfono:</strong> (714) 779-2640</span></li>
                <li className="flex items-start gap-3"><Globe className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Correo:</strong> orders@mobilejanitorialsupply.com</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">Productos para Negocios en Fountain Valley</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Más de 10,000 productos listos para entrega o para recoger en nuestro almacén.</p>
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
              { stat: "15 Min", label: "Desde Nuestro Almacén" },
              { stat: "$399", label: "Mínimo Entrega Gratis" },
              { stat: "OC/LA/IE", label: "Zona de Entrega" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Negocios que Atendemos en Fountain Valley</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Fountain Valley cuenta con una economía diversa. Estos son algunos de los sectores que confían en nuestros productos y servicio.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Consultorios Médicos", desc: "Los consultorios, clínicas y centros de salud en Fountain Valley requieren guantes, desinfectantes y productos de higiene de grado médico." },
                { title: "Restaurantes y Cafeterías", desc: "Los establecimientos de comida a lo largo de Brookhurst y en las plazas comerciales necesitan suministros de limpieza de cocina a diario." },
                { title: "Oficinas Corporativas", desc: "Los parques empresariales y oficinas en Fountain Valley mantienen sus espacios profesionales con nuestros productos de limpieza." },
                { title: "Centros Educativos", desc: "Las escuelas y centros de aprendizaje protegen la salud de sus alumnos con productos de limpieza seguros y efectivos." },
                { title: "Servicios de Limpieza", desc: "Las empresas de janitorial que cubren Fountain Valley y ciudades vecinas compran al mayoreo para maximizar sus ganancias." },
                { title: "Comercios y Tiendas", desc: "Las tiendas y comercios locales mantienen una imagen impecable con nuestros productos de cuidado de pisos y superficies." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Community */}
        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Compromiso con la Comunidad</h2>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center mb-4">
              Sabemos que elegir un proveedor no es solo cuestión de precio — es cuestión de confianza. En
              Mobile Janitorial Supply nos ganamos esa confianza cada día: cumpliendo con nuestros tiempos de
              entrega, manteniendo precios estables y ofreciendo un servicio al cliente que realmente escucha.
              Para los negocios hispanos de Fountain Valley, el hecho de que hablemos español es una muestra más
              de nuestro compromiso con esta comunidad.
            </p>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center">
              No importa el tamaño de su negocio ni el volumen de su pedido. Ya sea que necesite una caja de
              guantes o un camión lleno de productos, le damos la misma atención y el mismo trato profesional.
            </p>
          </div>
        </section>

        {/* Map / Directions CTA */}
        <section className="py-12 bg-mjs-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-mjs-dark mb-2">Visítenos — A 15 Minutos de Fountain Valley</h2>
            <p className="text-sm text-mjs-gray-500 mb-4">3066 E. La Palma Ave., Anaheim, CA 92806 — Acceso fácil por la autopista 405 o 22</p>
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
            <h2 className="text-3xl font-black mb-3">Suministros de Limpieza al por Mayor en Fountain Valley</h2>
            <p className="text-sm text-white/80 mb-6">Pida una cotización o llámenos hoy. Atención en español garantizada.</p>
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
