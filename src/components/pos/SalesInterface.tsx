"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  List,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import OrderSummary from "./OrderSummary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { productsAPI } from "@/lib/api";
import { ClipLoader } from 'react-spinners';
import { Suspense } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  isPackage: boolean;
  image?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
  note: string;
  discount?: number; // Discount amount in percentage
}

interface HeldOrder {
  id: string;
  items: OrderItem[];
  timestamp: string;
  total: number;
  customerType: "dine-in" | "grab" | "gojek" | "shopee";
  discountInfo?: {
    type: "percentage" | "nominal";
    value: string;
  };
}

export default function SalesInterface() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State for note dialog
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteDialogProduct, setNoteDialogProduct] = useState<Product | null>(null);
  const [noteText, setNoteText] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  // State for customer type
  const [customerType, setCustomerType] = useState<
    "dine-in" | "grab" | "gojek" | "shopee"
  >("dine-in");

  // State for discount type and value
  const [discountType, setDiscountType] = useState<"percentage" | "nominal">(
    "percentage",
  );
  const [discountValue, setDiscountValue] = useState<string>("");

  // Function to update discount type
  const handleUpdateDiscountType = (type: "percentage" | "nominal") => {
    setDiscountType(type);
  };

  // Function to update discount value
  const handleUpdateDiscountValue = (value: string) => {
    setDiscountValue(value);
  };

  // State for held orders
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isHeldOrdersDialogOpen, setIsHeldOrdersDialogOpen] = useState(false);

  // Sample products data
  

  // State for current order
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on active category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate order total
  const orderTotal = currentOrder.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  // Process current order and move it to held orders
  const processOrder = () => {
    if (currentOrder.length === 0) return;

    const newHeldOrder: HeldOrder = {
      id: `order-${Date.now()}`,
      items: [...currentOrder],
      timestamp: new Date().toLocaleTimeString(),
      total: orderTotal,
      customerType: customerType,
      discountInfo: discountValue
        ? {
            type: discountType,
            value: discountValue,
          }
        : undefined,
    };

    setHeldOrders([...heldOrders, newHeldOrder]);
    setCurrentOrder([]);
    setDiscountValue("");
  };

  // Recall a held order
  const recallHeldOrder = (orderId: string) => {
    const orderToRecall = heldOrders.find((order) => order.id === orderId);
    if (!orderToRecall) return;

    setCurrentOrder(orderToRecall.items);
    setHeldOrders(heldOrders.filter((order) => order.id !== orderId));
    setIsHeldOrdersDialogOpen(false);
  };

  // Delete a held order
  const deleteHeldOrder = (orderId: string) => {
    setHeldOrders(heldOrders.filter((order) => order.id !== orderId));
  };

  // Handle order checkout
  const handleCheckout = () => {
    // This would be implemented with actual backend integration
    console.log("Processing checkout for order:", currentOrder);
    console.log("Total amount:", orderTotal);
    // Direct checkout without kitchen queue
    alert("Order processed successfully!");
    setCurrentOrder([]);
  };

  // Calculate subtotal with discount
  const calculateSubtotal = (
    price: number,
    quantity: number,
    discount: number,
  ) => {
    const subtotal = price * quantity;
    return discount > 0 ? subtotal * (1 - discount / 100) : subtotal;
  };

  // Handle removing an item from the order
  const handleRemoveItem = (id: number) => {
    setCurrentOrder(currentOrder.filter((item) => item.product.id !== id));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productsAPI.getAll();
        const transformed = productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          unit: product.unit,
          isPackage: product.is_package,
          image: product.image,
        }));
        setProducts(transformed);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <ClipLoader />
  }
  
  // Sample product categories
  const categories = Array.from(new Set(products.map((product) => product.category)));
  const categoryOptions = ["All", ...categories];
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col md:flex-row h-full bg-background">
      {/* Main content area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <p className="text-muted-foreground">View and manage orders</p>
        </div>

        {/* Search and filter */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

          {/* Categories tabs */}
          <Tabs defaultValue="All" className="mb-6">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger
                key="All"
                value="All"
                onClick={() => setActiveCategory("All")}
              >
                All
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

          {/* Products grid with add functionality */}
          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  {product.image && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">
                        {product.name}
                      </CardTitle>
                      {product.isPackage && (
                        <Badge variant="secondary">Package</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.unit}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col items-center justify-between">
                      <p className="font-small">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(product.price)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const existingItem = currentOrder.find(
                              (item) => item.product.id === product.id,
                            );
                            if (existingItem) {
                              // Update quantity if item already exists
                              const updatedOrder = currentOrder.map((item) =>
                                item.product.id === product.id
                                  ? {
                                      ...item,
                                      quantity: item.quantity + 1,
                                      subtotal: calculateSubtotal(
                                        item.product.price,
                                        item.quantity + 1,
                                        item.discount || 0,
                                      ),
                                    }
                                  : item,
                              );
                              setCurrentOrder(updatedOrder);
                            } else {
                              // Add new item to order
                              const newItem: OrderItem = {
                                product,
                                quantity: 1,
                                subtotal: product.price,
                                note: "",
                                discount: 0,
                              };
                              setCurrentOrder([...currentOrder, newItem]);
                            }
                          }}
                        >
                          +
                        </Button>
                        <span className="text-sm font-medium">
                          {currentOrder.find(
                            (item) => item.product.id === product.id,
                          )?.quantity || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={
                            !currentOrder.find(
                              (item) => item.product.id === product.id,
                            ) ||
                            (currentOrder.find(
                              (item) => item.product.id === product.id,
                            )?.quantity || 0) <= 0
                          }
                          onClick={() => {
                            const existingItem = currentOrder.find(
                              (item) => item.product.id === product.id,
                            );
                            if (existingItem) {
                              if (existingItem.quantity > 1) {
                                // Decrease quantity
                                const updatedOrder = currentOrder.map((item) =>
                                  item.product.id === product.id
                                    ? {
                                        ...item,
                                        quantity: item.quantity - 1,
                                        subtotal: calculateSubtotal(
                                          item.product.price,
                                          item.quantity - 1,
                                          item.discount || 0,
                                        ),
                                      }
                                    : item,
                                );
                                setCurrentOrder(updatedOrder);
                              } else {
                                // Remove item if quantity becomes 0
                                const updatedOrder = currentOrder.filter(
                                  (item) => item.product.id !== product.id,
                                );
                                setCurrentOrder(updatedOrder);
                              }
                            }
                          }}
                        >
                          -
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground"
                                disabled={
                                  !currentOrder.find(
                                    (item) => item.product.id === product.id,
                                  )
                                }
                                onClick={() => {
                                  const item = currentOrder.find(
                                    (item) => item.product.id === product.id,
                                  );
                                  if (item) {
                                    setNoteDialogProduct(product);
                                    setNoteText(item.note || "");
                                    setCurrentItemId(product.id);
                                    setIsNoteDialogOpen(true);
                                  }
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add note</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order summary sidebar */}
      <div className="w-full md:w-[350px] border-t md:border-t-0 md:border-l bg-card">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Current Order</h2>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={processOrder}
              disabled={currentOrder.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Process Order
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHeldOrdersDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <List className="h-4 w-4" /> Orders ({heldOrders.length})
            </Button>
          </div>
        </div>
        <div className="p-4 border-b">
          {/* Customer type and discount selection moved to payment section */}
        </div>
        <OrderSummary
          items={currentOrder.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            note: item.note,
            discount: item.discount,
          }))}
          onRemoveItem={(id) => {
            const updatedOrder = currentOrder.filter(
              (item) => item.product.id !== id,
            );
            setCurrentOrder(updatedOrder);
          }}
          onUpdateQuantity={(id, newQuantity) => {
            if (newQuantity <= 0) {
              // Remove item if quantity becomes 0
              const updatedOrder = currentOrder.filter(
                (item) => item.product.id !== id,
              );
              setCurrentOrder(updatedOrder);
            } else {
              // Update quantity
              const updatedOrder = currentOrder.map((item) =>
                item.product.id === id
                  ? {
                      ...item,
                      quantity: newQuantity,
                      subtotal: calculateSubtotal(
                        item.product.price,
                        newQuantity,
                        item.discount || 0,
                      ),
                    }
                  : item,
              );
              setCurrentOrder(updatedOrder);
            }
          }}
          onCheckout={handleCheckout}
          onCancelOrder={() => setCurrentOrder([])}
          customerType={customerType}
          discountInfo={
            discountValue
              ? { type: discountType, value: discountValue }
              : undefined
          }
          onUpdateDiscountType={handleUpdateDiscountType}
          onUpdateDiscountValue={handleUpdateDiscountValue}
        />
      </div>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {noteDialogProduct
                ? `Add Note for ${noteDialogProduct.name}`
                : "Add Note"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Special instructions..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNoteDialogOpen(false);
                setNoteText("");
                setNoteDialogProduct(null);
                setCurrentItemId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentItemId) {
                  const updatedOrder = currentOrder.map((item) =>
                    item.product.id === currentItemId
                      ? {
                          ...item,
                          note: noteText,
                        }
                      : item,
                  );
                  setCurrentOrder(updatedOrder);
                }
                setIsNoteDialogOpen(false);
                setNoteText("");
                setNoteDialogProduct(null);
                setCurrentItemId(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Held Orders Dialog */}
      <Dialog
        open={isHeldOrdersDialogOpen}
        onOpenChange={setIsHeldOrdersDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Held Orders</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {heldOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No held orders
              </div>
            ) : (
              <div className="space-y-4">
                {heldOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">
                          Order #{order.id.split("-")[1]}
                        </h3>
                        <div className="flex gap-2 items-center">
                          <p className="text-sm text-muted-foreground">
                            {order.timestamp}
                          </p>
                          <Badge variant="outline" className="capitalize">
                            {order.customerType}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => recallHeldOrder(order.id)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" /> Recall
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteHeldOrder(order.id)}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${order.id}-${idx}`}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.product.name}
                            {item.note && (
                              <span className="text-xs italic ml-1">
                                ({item.note})
                              </span>
                            )}
                          </span>
                          <span>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.discountInfo && order.discountInfo.value && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between text-sm text-green-600">
                          <span>
                            {order.discountInfo.type === "percentage"
                              ? `Discount (${order.discountInfo.value}%)`
                              : `Discount (Fixed)`}
                          </span>
                          <span>Applied</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                      <span>Total:</span>
                      <span>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(order.total)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHeldOrdersDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </Suspense>
  );
}