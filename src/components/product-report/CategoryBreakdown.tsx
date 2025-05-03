import React from "react";
import { Product, OrderItem } from "@/lib/types";

interface CategoryBreakdownProps {
  products: Product[];
  orderItems: OrderItem[];
}

export default function CategoryBreakdown(
  { products, orderItems }: CategoryBreakdownProps = {
    products: [],
    orderItems: [],
  },
) {
  // Calculate sales by category
  const calculateCategorySales = () => {
    // Create a map to track sales by category
    const categorySales = new Map<string, { count: number; revenue: number }>();

    // Initialize categories from products
    products.forEach((product) => {
      if (!categorySales.has(product.category)) {
        categorySales.set(product.category, { count: 0, revenue: 0 });
      }
    });

    // Calculate sales for each category
    orderItems.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        const category = product.category;
        const currentData = categorySales.get(category) || {
          count: 0,
          revenue: 0,
        };

        categorySales.set(category, {
          count: currentData.count + item.quantity,
          revenue: currentData.revenue + item.price * item.quantity,
        });
      }
    });

    // Convert to array for rendering
    return Array.from(categorySales.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue,
    }));
  };

  const categorySales = calculateCategorySales();
  const totalSales = categorySales.reduce((sum, item) => sum + item.count, 0);
  const totalRevenue = categorySales.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Items Sold</p>
          <p className="text-2xl font-bold">{totalSales}</p>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {categorySales
          .sort((a, b) => b.count - a.count)
          .map((item) => {
            const percentage =
              totalSales > 0 ? (item.count / totalSales) * 100 : 0;

            return (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm">
                    {item.count} items ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
