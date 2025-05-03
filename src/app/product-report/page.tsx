"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Calendar, Filter } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { productsAPI, ordersAPI } from "@/lib/api";
import { Product, Order, OrderItem } from "@/lib/types";
import PopularProducts from "@/components/product-report/PopularProducts";
import CategoryBreakdown from "@/components/product-report/CategoryBreakdown";
import TimeBasedAnalysis from "@/components/product-report/TimeBasedAnalysis";
import PriceRangeAnalysis from "@/components/product-report/PriceRangeAnalysis";

export default function ProductReportPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsData = await productsAPI.getAll();
        setProducts(productsData);

        // Fetch orders
        const ordersResponse = await ordersAPI.getAll("paid");
        setOrders(ordersResponse.data);

        // For each order, fetch order details to get items
        const orderDetailsPromises = ordersResponse.data.map((order) =>
          ordersAPI.getById(order.id.toString()),
        );

        const orderDetailsResults =
          await Promise.allSettled(orderDetailsPromises);

        // Extract order items from successful responses
        const allOrderItems: OrderItem[] = [];
        orderDetailsResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value.items) {
            allOrderItems.push(...result.value.items);
          }
        });

        setOrderItems(allOrderItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load report data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="flex h-screen bg-background">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Product Report</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Filter by Date
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <PopularProducts
                    products={products}
                    orderItems={orderItems}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown
                    products={products}
                    orderItems={orderItems}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time-Based Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeBasedAnalysis orders={orders} orderItems={orderItems} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Range Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceRangeAnalysis
                    products={products}
                    orderItems={orderItems}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
