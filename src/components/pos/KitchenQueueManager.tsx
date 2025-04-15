"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, CheckCircle, XCircle, Clock, ChefHat } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  timestamp: string;
  items: OrderItem[];
  status: "waiting" | "cooking" | "completed" | "canceled";
  orderType: "Dine In" | "GoFood" | "Grab" | "Shopee" | "Other";
}

const KitchenQueueManager = () => {
  // Mock data for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-001",
      timestamp: "2023-05-15 10:30",
      items: [
        { id: 1, name: "Ricebox Ayam", quantity: 2 },
        { id: 2, name: "Sate Fishball", quantity: 1 },
      ],
      status: "waiting",
      orderType: "Dine In",
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      timestamp: "2023-05-15 10:35",
      items: [
        { id: 3, name: "Paket A", quantity: 1 },
        { id: 4, name: "Sate Fishball", quantity: 2 },
      ],
      status: "waiting",
      orderType: "GoFood",
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      timestamp: "2023-05-15 10:25",
      items: [{ id: 5, name: "Ricebox Ayam", quantity: 3 }],
      status: "cooking",
      orderType: "Dine In",
    },
    {
      id: "4",
      orderNumber: "ORD-004",
      timestamp: "2023-05-15 10:15",
      items: [{ id: 6, name: "Paket A", quantity: 2 }],
      status: "completed",
      orderType: "Grab",
    },
    {
      id: "5",
      orderNumber: "ORD-005",
      timestamp: "2023-05-15 10:10",
      items: [{ id: 7, name: "Sate Fishball", quantity: 4 }],
      status: "canceled",
      orderType: "Shopee",
    },
  ]);

  // Function to update order status
  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  // Function to print kitchen ticket
  const printKitchenTicket = (orderId: string) => {
    // In a real implementation, this would connect to a printer
    console.log(`Printing kitchen ticket for order ${orderId}`);
    // Add printer integration code here
  };

  // Filter orders by status
  const waitingOrders = orders.filter((order) => order.status === "waiting");
  const cookingOrders = orders.filter((order) => order.status === "cooking");
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  );
  const canceledOrders = orders.filter((order) => order.status === "canceled");

  // Get status badge color
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Waiting
          </Badge>
        );
      case "cooking":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Cooking
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Canceled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get order type badge
  const getOrderTypeBadge = (type: Order["orderType"]) => {
    switch (type) {
      case "Dine In":
        return <Badge className="bg-purple-100 text-purple-800">Dine In</Badge>;
      case "GoFood":
        return <Badge className="bg-green-100 text-green-800">GoFood</Badge>;
      case "Grab":
        return <Badge className="bg-green-100 text-green-800">Grab</Badge>;
      case "Shopee":
        return <Badge className="bg-orange-100 text-orange-800">Shopee</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
    }
  };

  // Render order card
  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="mb-4 border-l-4 border-l-blue-500 bg-white">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            {order.orderNumber}
          </CardTitle>
          <div className="flex space-x-2">
            {getOrderTypeBadge(order.orderType)}
            {getStatusBadge(order.status)}
          </div>
        </div>
        <div className="text-sm text-gray-500">{order.timestamp}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span className="font-semibold">x{item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => printKitchenTicket(order.id)}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <div className="space-x-2">
            {order.status === "waiting" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateOrderStatus(order.id, "cooking")}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1"
              >
                <ChefHat className="h-4 w-4" /> Start Cooking
              </Button>
            )}
            {order.status === "cooking" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateOrderStatus(order.id, "completed")}
                className="bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            )}
            {(order.status === "waiting" || order.status === "cooking") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateOrderStatus(order.id, "canceled")}
                className="bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1"
              >
                <XCircle className="h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50 p-6 h-full w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kitchen Queue Manager</h1>
        <p className="text-gray-500">
          Manage and track kitchen orders in real-time
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 bg-white">
          <TabsTrigger value="all" className="flex items-center gap-1">
            All Orders{" "}
            <Badge variant="secondary" className="ml-1">
              {orders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="waiting" className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> Waiting{" "}
            <Badge variant="secondary" className="ml-1">
              {waitingOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cooking" className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" /> Cooking{" "}
            <Badge variant="secondary" className="ml-1">
              {cookingOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Completed{" "}
            <Badge variant="secondary" className="ml-1">
              {completedOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="canceled" className="flex items-center gap-1">
            <XCircle className="h-4 w-4" /> Canceled{" "}
            <Badge variant="secondary" className="ml-1">
              {canceledOrders.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-600" /> Waiting (
                {waitingOrders.length})
              </h2>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {waitingOrders.map(renderOrderCard)}
              </ScrollArea>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-blue-600" /> Cooking (
                {cookingOrders.length})
              </h2>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {cookingOrders.map(renderOrderCard)}
              </ScrollArea>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />{" "}
                Completed ({completedOrders.length})
              </h2>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {completedOrders.map(renderOrderCard)}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="waiting" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waitingOrders.map(renderOrderCard)}
          </div>
        </TabsContent>

        <TabsContent value="cooking" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cookingOrders.map(renderOrderCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedOrders.map(renderOrderCard)}
          </div>
        </TabsContent>

        <TabsContent value="canceled" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canceledOrders.map(renderOrderCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenQueueManager;
