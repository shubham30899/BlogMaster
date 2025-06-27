import { Card, CardContent } from "@/components/ui/card";
import { ParsedBlock } from "@/shared/schema";
import { Package } from "lucide-react";
import { getProductsBySkus } from "@/data/products";

interface ProductBlockProps {
  block: ParsedBlock;
}

export function ProductBlock({ block }: ProductBlockProps) {
  const products = getProductsBySkus(block.products || []);

  if (products.length === 0) {
    return (
      <Card className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-slate-600">DYNAMIC BLOCK</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">{block.name}</h3>
        <p className="text-slate-600">No products found for the specified SKUs.</p>
        <div className="mt-4 text-xs text-slate-500 font-mono">
          Generated from: {block.originalText}
        </div>
      </Card>
    );
  }

  return (
    <Card className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-slate-600">DYNAMIC BLOCK</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{block.name}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.sku} className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-video bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">{product.name}</h4>
              <p className="text-primary font-bold">{product.price}</p>
              <p className="text-xs text-slate-500 mt-1">SKU: {product.sku}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-slate-500 font-mono">
        Generated from: {block.originalText}
      </div>
    </Card>
  );
}
