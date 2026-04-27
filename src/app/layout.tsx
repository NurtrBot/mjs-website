import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { ShippingProvider } from "@/context/ShippingContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import CartPanel from "@/components/CartPanel";
import { FavoritesProvider } from "@/context/FavoritesContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mobilejanitorialsupply.com"),
  title: {
    default: "Mobile Janitorial Supply | #1 Rated Cleaning Products in SoCal",
    template: "%s | Mobile Janitorial Supply",
  },
  description:
    "Southern California's highest-rated janitorial supply company. Shop thousands of cleaning products, chemicals, paper goods, and equipment at wholesale prices. Free 1-3 day local delivery.",
  keywords:
    "janitorial supply, cleaning products, wholesale cleaning, Southern California, paper products, chemicals, gloves, janitorial equipment, trash liners, breakroom supplies, floor care, Orange County, Los Angeles, Inland Empire",
  authors: [{ name: "Mobile Janitorial Supply" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mobilejanitorialsupply.com",
    siteName: "Mobile Janitorial Supply",
    title: "Mobile Janitorial Supply | #1 Rated Cleaning Products in SoCal",
    description:
      "Southern California's highest-rated janitorial supply company. 10,000+ products at wholesale prices. Free 1-3 day local delivery on orders $399+.",
    images: [
      {
        url: "/banner-03.jpg",
        width: 1200,
        height: 630,
        alt: "Mobile Janitorial Supply — Wholesale Cleaning Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile Janitorial Supply | #1 Rated in SoCal",
    description:
      "10,000+ cleaning products at wholesale prices. Free local delivery. Serving OC, LA, IE & San Diego.",
    images: ["/banner-03.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when ready
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-6N2DLCDNH9" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6N2DLCDNH9', {
              page_title: document.title,
              send_page_view: true
            });
          `}
        </Script>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="lazyOnload" />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <div id="google_translate_element" style={{ display: "none" }} />
        <AuthProvider>
          <PurchaseProvider>
            <FavoritesProvider>
            <OrderProvider>
              <ShippingProvider>
                <CartProvider>
                  {children}
                  <CartPanel />
                </CartProvider>
              </ShippingProvider>
            </OrderProvider>
          </FavoritesProvider>
          </PurchaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
