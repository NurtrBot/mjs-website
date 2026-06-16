import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Productos de Limpieza en Fullerton | Mayoreo + Entrega Gratis | Hablamos Español",
  description:
    "Suministros de limpieza al por mayor en Fullerton, CA. Todo para la limpieza comercial: químicos, papel, equipo y más. 10 minutos de nuestro almacén en Anaheim. Hablamos Español.",
  keywords:
    "productos de limpieza Fullerton, suministros de limpieza Fullerton, limpieza comercial Fullerton",
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/es/fullerton",
    languages: {
      en: "https://www.mobilejanitorialsupply.com/locations/fullerton",
      es: "https://www.mobilejanitorialsupply.com/es/fullerton",
    },
  },
  openGraph: {
    title: "Productos de Limpieza en Fullerton | Mayoreo + Entrega Gratis | Hablamos Español",
    description:
      "Suministros de limpieza al por mayor en Fullerton, CA. 10 minutos de nuestro almacén. Hablamos Español.",
    url: "https://www.mobilejanitorialsupply.com/es/fullerton",
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
  areaServed: { "@type": "City", name: "Fullerton" },
  url: "https://www.mobilejanitorialsupply.com/es/fullerton",
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

export default function FullertonEsPage() {
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
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Productos de Limpieza en Fullerton</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Servimos a los negocios de Fullerton con orgullo. Nuestro almacén en Anaheim está a solo 10
              minutos de distancia, y ofrecemos entrega gratis en pedidos de $399 o más. Todo nuestro equipo
              le atiende en español.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: "Entrega GRATIS", desc: "En pedidos de $399+ (subtotal antes de impuestos). Reciba su pedido al siguiente día hábil." },
              { icon: DollarSign, title: "Precios de Mayoreo", desc: "Precios competitivos de distribuidor. Sin cobros ocultos ni membresías." },
              { icon: Globe, title: "Hablamos Español", desc: "Comuníquese con nosotros en español. Es un placer atenderle en su idioma." },
              { icon: MapPin, title: "Almacén Local en Anaheim", desc: "A 10 minutos de Fullerton por la autopista 57. Cerca y conveniente." },
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
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Fullerton: Ciudad Universitaria con Espíritu Emprendedor</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Fullerton es una ciudad con carácter propio. Con la Universidad Estatal de California Fullerton
                (Cal State Fullerton) como ancla educativa, la ciudad atrae a miles de estudiantes, profesores
                y profesionales que mantienen activa una economía vibrante. El centro de Fullerton es conocido
                por sus restaurantes, bares y vida nocturna — todos negocios que necesitan suministros de
                limpieza de calidad día tras día.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Para los dueños de negocios hispanos en Fullerton, contar con un proveedor que habla español y
                que está a solo minutos de distancia es una verdadera ventaja. No tiene que esperar días por un
                envío desde lejos ni lidiar con barreras de idioma. Con Mobile Janitorial Supply, usted obtiene
                servicio personal, precios justos y la tranquilidad de saber que sus suministros llegarán a tiempo.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-mjs-dark mb-4">Servicio para Fullerton</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Almacén:</strong> 3066 E. La Palma Ave., Anaheim, CA 92806</span></li>
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Entrega gratis</strong> en pedidos de $399+ al siguiente día hábil</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Horario:</strong> Lunes a Viernes, 6:30 AM — 3:00 PM</span></li>
                <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Teléfono:</strong> (714) 779-2640</span></li>
                <li className="flex items-start gap-3"><Globe className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Atención en español</strong> — con profesionalismo y calidez</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">Productos Disponibles para Fullerton</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Todo lo que necesita para mantener su negocio limpio y profesional, con entrega a Fullerton.</p>
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
              { stat: "10 Min", label: "Desde Nuestro Almacén" },
              { stat: "$399", label: "Mínimo Entrega Gratis" },
              { stat: "Español", label: "Atención Garantizada" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Negocios que Atendemos en Fullerton</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              Desde el centro de la ciudad hasta los corredores comerciales, los negocios de Fullerton confían en nosotros.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Restaurantes y Bares", desc: "El centro de Fullerton tiene una de las escenas gastronómicas más activas del norte del condado. Nosotros proveemos los suministros que mantienen esas cocinas funcionando." },
                { title: "Campus Universitario", desc: "Cal State Fullerton y Fullerton College generan una demanda constante de productos de limpieza para aulas, dormitorios y áreas comunes." },
                { title: "Oficinas Corporativas", desc: "Las empresas a lo largo de Commonwealth Ave y Harbor Blvd necesitan limpieza profesional continua." },
                { title: "Servicios de Limpieza", desc: "Las empresas de janitorial que operan en Fullerton y ciudades aledañas obtienen precios de mayoreo competitivos." },
                { title: "Salones y Spa", desc: "Los salones de belleza y spas de Fullerton requieren desinfectantes, toallas y productos de higiene de grado profesional." },
                { title: "Iglesias y Centros Comunitarios", desc: "Los espacios de reunión necesitan mantenerse limpios para recibir a la comunidad. Ofrecemos productos de calidad a precios accesibles." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Un Proveedor en el Que Puede Confiar</h2>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center mb-4">
              En Mobile Janitorial Supply creemos que la confianza se construye con acciones, no con palabras.
              Eso significa entregar lo que prometemos, mantener precios transparentes y tratar a cada cliente
              con respeto. Para los negocios de Fullerton que buscan un proveedor confiable y accesible, somos
              la opción más inteligente.
            </p>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center">
              Nuestro compromiso es simple: productos de calidad, precios de mayoreo y servicio en español.
              Así de directo, así de honesto.
            </p>
          </div>
        </section>

        {/* Map / Directions CTA */}
        <section className="py-12 bg-mjs-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-mjs-dark mb-2">Visítenos — A 10 Minutos de Fullerton</h2>
            <p className="text-sm text-mjs-gray-500 mb-4">3066 E. La Palma Ave., Anaheim, CA 92806 — Salida La Palma desde la autopista 57</p>
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
            <h2 className="text-3xl font-black mb-3">Productos de Limpieza al por Mayor para Fullerton</h2>
            <p className="text-sm text-white/80 mb-6">Solicite una cotización o llámenos directamente. Nuestro equipo en español está listo para ayudarle.</p>
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
