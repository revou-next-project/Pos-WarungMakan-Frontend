import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, OrderItem } from "@/lib/types";

interface PopularProductsProps {
  products: Product[];
  orderItems: OrderItem[];
}

export default function PopularProducts(
  { products, orderItems }: PopularProductsProps = {
    products: [],
    orderItems: [],
  },
) {
  // Calculate product popularity based on order frequency
  const calculatePopularity = () => {
    // Create a map to count occurrences of each product
    const productCounts = new Map<number, number>();

    // Count occurrences of each product in order items
    orderItems.forEach((item) => {
      const currentCount = productCounts.get(item.product_id) || 0;
      productCounts.set(item.product_id, currentCount + item.quantity);
    });

    // Convert to array for sorting
    const productPopularity = products.map((product) => ({
      ...product,
      soldCount: productCounts.get(product.id) || 0,
    }));

    // Sort by sold count (descending)
    return productPopularity.sort((a, b) => b.soldCount - a.soldCount);
  };

  const popularProducts = calculatePopularity();
  const mostPopular = popularProducts.slice(0, 5); // Top 5
  const leastPopular = [...popularProducts].reverse().slice(0, 5); // Bottom 5

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Most Popular Products</h3>
        <div className="space-y-2">
          {mostPopular.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
            >
              <span className="font-medium">{product.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {product.category}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  {product.soldCount} sold
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Least Popular Products</h3>
        <div className="space-y-2">
          {leastPopular.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
            >
              <span className="font-medium">{product.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {product.category}
                </span>
                <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md text-sm">
                  {product.soldCount} sold
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
