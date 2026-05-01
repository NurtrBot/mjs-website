export interface ProductData {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
  stockQty: number;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  category: string;
  subcategory: string;
  // For card display
  cardTitle: string;
  pack: string;
  badge?: string;
  badgeColor?: string;
  imageFit?: "contain" | "cover";
  // Quick buy options
  quickBuy: { label: string; qty: number; savings?: string; unitPrice?: number }[];
  // SDS sheet (chemicals only)
  sdsSheet?: string;
}
