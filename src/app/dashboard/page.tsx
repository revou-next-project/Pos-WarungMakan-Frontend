"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  DollarSign,
  FileText,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import SalesInterface from "@/components/pos/SalesInterface";
import moment from 'moment';
import { ordersAPI } from '@/lib/api';

interface Order {
  id: number;
  order_number: string;
  timestamp: string;
  order_type: string;
  total_amount: number;
  payment_status: string;
  paid_at: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const router = useRouter();
  

  // Mock user data - in a real app this would come from authentication
  const user = {
    name: "Admin User",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const formattedDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    ordersAPI.getAll('status').then((response) => {
      const totalOrders = response.length;
      setTotalOrders(totalOrders);
    });
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Food POS</h2>
          <p className="text-sm text-muted-foreground">Restaurant Management</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Sales
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="lg"
            onClick={() => router.push("/inventory")}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Inventory
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="lg"
            onClick={() => router.push("/products")}
          >
            <Package className="mr-2 h-5 w-5" />
            Products
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="lg"
            onClick={() => router.push("/recipes")}
          >
            <ChefHat className="mr-2 h-5 w-5" />
            Recipes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="lg"
            onClick={() => router.push("/reports")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Reports
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="lg"
            onClick={() => router.push("/cash-balance")}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Cash Balance
          </Button>

          <Button variant="ghost" className="w-full justify-start" size="lg">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Today's Orders: {todaysOrders.length}
              </Button>
              <Button variant="outline" size="sm">
                Date: {moment(formattedDate).format('YYYY-MM-DD')}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="sales" className="w-full">
            <TabsContent value="sales" className="mt-0">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Sales Interface</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <SalesInterface />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
