import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { ShippingProvider } from "@/context/ShippingContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import CartPanel from "@/components/CartPanel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mobile Janitorial Supply | #1 Rated Cleaning Products in SoCal",
  description:
    "Southern California's highest-rated janitorial supply company. Shop thousands of cleaning products, chemicals, paper goods, and equipment at wholesale prices. Free local delivery.",
  keywords:
    "janitorial supply, cleaning products, wholesale cleaning, Southern California, paper products, chemicals, gloves, janitorial equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" defer />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <div id="google_translate_element" style={{ display: "none" }} />
        <AuthProvider>
          <PurchaseProvider>
            <OrderProvider>
              <ShippingProvider>
                <CartProvider>
                  {children}
                  <CartPanel />
                </CartProvider>
              </ShippingProvider>
            </OrderProvider>
          </PurchaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
