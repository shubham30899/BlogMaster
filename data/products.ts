import { Product } from "@shared/schema";

export const MOCK_PRODUCTS: Product[] = [
  { sku: "SKU123", name: "Mechanical Keyboard", price: "$99", image: "/keyboard.png" },
  { sku: "SKU456", name: "Gaming Mouse", price: "$49", image: "/mouse.png" },
  { sku: "SKU789", name: "Monitor", price: "$199", image: "/monitor.png" },
];

export function getProductBySku(sku: string): Product | undefined {
  return MOCK_PRODUCTS.find(product => product.sku === sku);
}

export function getProductsBySkus(skus: string[]): Product[] {
  return skus.map(sku => getProductBySku(sku)).filter(Boolean) as Product[];
}
