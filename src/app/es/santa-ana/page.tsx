import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { MapPin, Truck, DollarSign, Clock, Phone, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Productos de Limpieza en Santa Ana | Precios de Mayoreo | Hablamos Español",
  description:
    "Suministros de limpieza al por mayor en Santa Ana, CA. Químicos, papel higiénico, toallas, guantes, bolsas y equipo profesional. Entrega gratis en pedidos de $399+. Hablamos Español.",
  keywords:
    "productos de limpieza Santa Ana, suministros janitorial Santa Ana, limpieza al por mayor Santa Ana, tienda de limpieza Santa Ana",
  alternates: {
    canonical: "https://www.mobilejanitorialsupply.com/es/santa-ana",
    languages: {
      en: "https://www.mobilejanitorialsupply.com/locations/santa-ana",
      es: "https://www.mobilejanitorialsupply.com/es/santa-ana",
    },
  },
  openGraph: {
    title: "Productos de Limpieza en Santa Ana | Precios de Mayoreo | Hablamos Español",
    description:
      "Suministros de limpieza al por mayor en Santa Ana, CA. Entrega gratis en pedidos de $399+. Hablamos Español.",
    url: "https://www.mobilejanitorialsupply.com/es/santa-ana",
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
  areaServed: { "@type": "City", name: "Santa Ana" },
  url: "https://www.mobilejanitorialsupply.com/es/santa-ana",
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

export default function SantaAnaEsPage() {
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
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Productos de Limpieza en Santa Ana</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Nos especializamos en servir a la comunidad de Santa Ana. Nuestro almacén en Anaheim está a solo
              10 minutos de distancia, y nuestro equipo le atiende en español con la misma calidez que usted
              merece. Entrega gratis en pedidos de $399 o más.
            </p>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Truck, title: "Entrega GRATIS", desc: "En pedidos de $399+ (subtotal antes de impuestos). Su pedido llega al siguiente día hábil." },
              { icon: DollarSign, title: "Precios de Mayoreo", desc: "Precios justos de distribuidor. Sin membresía, sin sorpresas." },
              { icon: Globe, title: "Hablamos Español", desc: "Nuestro equipo habla su idioma. Llámenos o visítenos con confianza." },
              { icon: MapPin, title: "Almacén Local en Anaheim", desc: "A solo 10 minutos de Santa Ana. Entrega rápida y confiable." },
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
              <h2 className="text-2xl font-black text-mjs-dark mb-3">Comprometidos con Santa Ana</h2>
              <p className="text-sm text-mjs-gray-500 leading-relaxed mb-4">
                Santa Ana es la capital del condado de Orange y hogar de la comunidad hispana más grande de la
                región. Entendemos las necesidades de los negocios de esta ciudad porque llevamos años
                atendiéndolos. Desde los restaurantes y tiendas de la Calle 4th hasta las oficinas del centro
                cívico, nuestros clientes en Santa Ana confían en nosotros para obtener productos de calidad a
                precios accesibles.
              </p>
              <p className="text-sm text-mjs-gray-500 leading-relaxed">
                Sabemos que para muchos dueños de negocios en Santa Ana, poder comunicarse en español no es un
                lujo — es una necesidad. Por eso, cuando usted nos llama o nos visita, le atendemos en su
                idioma sin ningún problema. Queremos que se sienta cómodo y bien atendido, como si tratara con
                un vecino de confianza.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-mjs-dark mb-4">Servicio para Santa Ana</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Almacén:</strong> 3066 E. La Palma Ave., Anaheim, CA 92806</span></li>
                <li className="flex items-start gap-3"><Truck className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Entrega gratis</strong> en pedidos de $399+ al siguiente día hábil</span></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Horario:</strong> Lunes a Viernes, 6:30 AM — 3:00 PM</span></li>
                <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Teléfono:</strong> (714) 779-2640</span></li>
                <li className="flex items-start gap-3"><Globe className="w-5 h-5 text-mjs-red flex-shrink-0 mt-0.5" /><span><strong>Atención en español</strong> — llámenos con confianza</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-2 text-center">Productos Disponibles para Santa Ana</h2>
            <p className="text-sm text-mjs-gray-500 text-center mb-8">Todo lo que su negocio necesita, con entrega directa a Santa Ana.</p>
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
              { stat: "100%", label: "Atención en Español" },
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
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Negocios que Atendemos en Santa Ana</h2>
            <p className="text-sm text-mjs-gray-500 text-center max-w-2xl mx-auto mb-8">
              La economía vibrante de Santa Ana depende de negocios locales dedicados. Nosotros les damos las herramientas para mantener sus espacios impecables.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Restaurantes y Panaderías", desc: "Desde los restaurantes de la Calle 4th hasta las panaderías tradicionales, proveemos todo para cocinas limpias y seguras." },
                { title: "Tiendas y Comercios", desc: "Los negocios del centro de Santa Ana y a lo largo de Bristol Street confían en nosotros para sus suministros diarios." },
                { title: "Oficinas y Gobierno", desc: "Como capital del condado, Santa Ana tiene edificios de oficinas y dependencias gubernamentales que requieren limpieza profesional." },
                { title: "Salones de Belleza y Barberías", desc: "Los salones de Santa Ana necesitan toallas, desinfectantes y productos de higiene de calidad profesional." },
                { title: "Escuelas y Guarderías", desc: "Las escuelas y centros de cuidado infantil merecen productos seguros y efectivos para proteger a los más pequeños." },
                { title: "Servicios de Limpieza", desc: "Las empresas de limpieza residencial y comercial en Santa Ana obtienen precios de mayoreo que mejoran sus márgenes." },
              ].map((ind) => (
                <div key={ind.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-mjs-dark text-sm mb-1">{ind.title}</h3>
                  <p className="text-xs text-mjs-gray-500">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-black text-mjs-dark mb-3 text-center">Parte de la Comunidad de Santa Ana</h2>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center mb-4">
              Santa Ana es una ciudad orgullosa de su herencia y su gente trabajadora. En Mobile Janitorial Supply
              compartimos ese orgullo. Muchos de nuestros empleados viven en la zona y entienden lo que significa
              trabajar duro para sacar adelante un negocio. Cuando usted nos elige como su proveedor, no solo
              obtiene buenos precios — obtiene un equipo que lo respeta y lo valora como cliente.
            </p>
            <p className="text-sm text-mjs-gray-500 leading-relaxed text-center">
              Ya sea que tenga un restaurante cerca del 4th Street Market, una oficina en el centro cívico, o
              un servicio de limpieza que cubre toda la ciudad, estamos listos para ser su aliado de confianza.
            </p>
          </div>
        </section>

        {/* Map / Directions CTA */}
        <section className="py-12 bg-mjs-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-mjs-dark mb-2">Visítenos — Estamos Cerca de Santa Ana</h2>
            <p className="text-sm text-mjs-gray-500 mb-4">3066 E. La Palma Ave., Anaheim, CA 92806 — A solo 10 minutos por la autopista 5 o 57</p>
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
            <h2 className="text-3xl font-black mb-3">Su Proveedor de Limpieza de Confianza en Santa Ana</h2>
            <p className="text-sm text-white/80 mb-6">Llámenos, visítenos o pida una cotización en línea. Le atendemos en español con gusto.</p>
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
