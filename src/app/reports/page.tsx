"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ReportsPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<"daily" | "monthly" | "yearly">(
    "daily",
  );
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);

  // Mock data for demonstration
  const salesData = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      date: "2023-05-01",
      total: 250000,
      items: 15,
      paymentMethod: "Cash",
      orderItems: [
        {
          name: "Rice Box Chicken",
          quantity: 2,
          price: 20000,
          note: "Extra spicy",
        },
        { name: "Iced Tea", quantity: 3, price: 5000, note: "Less sugar" },
        { name: "French Fries", quantity: 1, price: 15000, note: "" },
      ],
      customerName: "Walk-in Customer",
      discount: 0,
      tax: 22500,
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      date: "2023-05-01",
      total: 175000,
      items: 8,
      paymentMethod: "QRIS",
      orderItems: [
        { name: "Fishball Satay", quantity: 2, price: 10000, note: "" },
        { name: "Mineral Water", quantity: 2, price: 3000, note: "" },
        {
          name: "Rice Box Chicken",
          quantity: 1,
          price: 20000,
          note: "No vegetables",
        },
      ],
      customerName: "Walk-in Customer",
      discount: 0,
      tax: 15900,
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      date: "2023-05-01",
      total: 320000,
      items: 12,
      paymentMethod: "Transfer",
      orderItems: [
        { name: "Package A", quantity: 1, price: 25000, note: "" },
        { name: "Package B", quantity: 2, price: 35000, note: "" },
        { name: "Iced Tea", quantity: 4, price: 5000, note: "" },
      ],
      customerName: "Office Order",
      discount: 10,
      tax: 29000,
    },
    {
      id: 4,
      invoiceNumber: "INV-004",
      date: "2023-05-02",
      total: 420000,
      items: 18,
      paymentMethod: "Cash",
      orderItems: [
        { name: "Rice Box Chicken", quantity: 5, price: 20000, note: "" },
        { name: "French Fries", quantity: 3, price: 15000, note: "Extra salt" },
        { name: "Iced Tea", quantity: 5, price: 5000, note: "" },
      ],
      customerName: "Walk-in Customer",
      discount: 0,
      tax: 38000,
    },
    {
      id: 5,
      invoiceNumber: "INV-005",
      date: "2023-05-02",
      total: 150000,
      items: 6,
      paymentMethod: "QRIS",
      orderItems: [
        { name: "Fishball Satay", quantity: 3, price: 10000, note: "" },
        { name: "Mineral Water", quantity: 3, price: 3000, note: "" },
        { name: "French Fries", quantity: 1, price: 15000, note: "" },
      ],
      customerName: "Walk-in Customer",
      discount: 5,
      tax: 13500,
    },
  ];

  // Filter data based on selected date and filter type
  const getFilteredData = () => {
    if (filterType === "daily") {
      const formattedDate = format(date, "yyyy-MM-dd");
      return salesData.filter((item) => item.date === formattedDate);
    } else if (filterType === "monthly") {
      const month = format(date, "yyyy-MM");
      return salesData.filter((item) => item.date.startsWith(month));
    } else {
      const year = format(date, "yyyy");
      return salesData.filter((item) => item.date.startsWith(year));
    }
  };

  const filteredData = getFilteredData();

  // Calculate totals
  const totalSales = filteredData.reduce((sum, item) => sum + item.total, 0);
  const totalItems = filteredData.reduce((sum, item) => sum + item.items, 0);

  // Handle date navigation
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    if (filterType === "daily") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (filterType === "monthly") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setFullYear(
        newDate.getFullYear() + (direction === "next" ? 1 : -1),
      );
    }
    setDate(newDate);
  };

  // Format date display based on filter type
  const getDateDisplay = () => {
    if (filterType === "daily") {
      return format(date, "EEEE, dd MMMM yyyy");
    } else if (filterType === "monthly") {
      return format(date, "MMMM yyyy");
    } else {
      return format(date, "yyyy");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Food POS</h2>
          <p className="text-sm text-muted-foreground">Restaurant Management</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="lg"
            onClick={() => router.push("/dashboard")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="default" className="w-full justify-start" size="lg">
            <BarChart3 className="mr-2 h-5 w-5" />
            Reports
          </Button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Sales Reports</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select
                  value={filterType}
                  onValueChange={(value) => setFilterType(value as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {getDateDisplay()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode={
                        filterType === "yearly"
                          ? "year"
                          : filterType === "monthly"
                            ? "month"
                            : "day"
                      }
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateDate("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateDate("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {totalSales.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  For {getDateDisplay()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  For {getDateDisplay()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Items Sold
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  For {getDateDisplay()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredData.length > 0 ? (
                      filteredData.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className={
                            selectedInvoice === transaction.id
                              ? "bg-primary/10"
                              : "hover:bg-muted/50 cursor-pointer"
                          }
                          onClick={() =>
                            setSelectedInvoice(
                              selectedInvoice === transaction.id
                                ? null
                                : transaction.id,
                            )
                          }
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {transaction.invoiceNumber}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {transaction.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {transaction.customerName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            Rp {transaction.total.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {transaction.items}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {transaction.paymentMethod}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-sm text-muted-foreground"
                        >
                          No transactions found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedInvoice && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const invoice = filteredData.find(
                    (item) => item.id === selectedInvoice,
                  );
                  if (!invoice) return null;

                  return (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Invoice Number
                          </h4>
                          <p>{invoice.invoiceNumber}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Date
                          </h4>
                          <p>{invoice.date}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Customer
                          </h4>
                          <p>{invoice.customerName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Payment Method
                          </h4>
                          <p>{invoice.paymentMethod}</p>
                        </div>
                      </div>

                      <h4 className="font-medium mb-2">Order Items</h4>
                      <div className="rounded-md border mb-4">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                Item
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                Quantity
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                Price
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                Subtotal
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                Note
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {invoice.orderItems.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm">
                                  {item.name}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  Rp {item.price.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  Rp{" "}
                                  {(
                                    item.quantity * item.price
                                  ).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-sm italic text-muted-foreground">
                                  {item.note || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="space-y-1 text-sm ml-auto w-full max-w-[300px]">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>
                            Rp {(invoice.total - invoice.tax).toLocaleString()}
                          </span>
                        </div>
                        {invoice.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount ({invoice.discount}%)</span>
                            <span>
                              -Rp{" "}
                              {(
                                (invoice.total - invoice.tax) *
                                (invoice.discount / 100)
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax (10%)</span>
                          <span>Rp {invoice.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                          <span>Total</span>
                          <span>Rp {invoice.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Print Invoice
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
