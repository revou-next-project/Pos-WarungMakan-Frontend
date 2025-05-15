"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowDownUp, Plus, Wallet } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

import { cashBalanceAPI } from "@/lib/api";
import { CashBalance, expense } from "@/models/CashBalances";
import { format } from "date-fns";
import { formatDate } from "@/lib/utils";

// Re-use the same item shape
type Transaction = {
  id: number
  date: string
  type: "income" | "expense"
  category: string
  descriptions: string
  amount: number
}

type TabValue = "all" | "income" | "expense";


export default function CashBalancePage() {
  const router = useRouter();
  // const [transactions, setTransactions] = useState(mockTransactions);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [currentTransaction, setCurrentTransaction] = useState({
    id: 0,
    date: new Date().toISOString().split("T")[0],
    type: "income",
    category: "",
    description: "",
    amount: 0,
  });
  const [cashBalances, setCashBalances] = useState<CashBalance>({ total: 0, data: [] });
  const [expenses, setExpenses] = useState<expense>({ total: 0, data: [] });
  const [page, setPage] = useState(1);


  // In a real implementation, this would fetch from the API
  useEffect(() => {
    // Fetch transactions from API
    // For now, we're using mock data
    async function fetchAll() {
      try {
          // Fire both requests in parallel
          const [ incRes, expRes ] = await Promise.all([
            cashBalanceAPI.getAll({
              start_date: "2025-05-01T00:00:00",
              end_date:   "2025-06-01T00:00:00",
              transaction_type: "sale",
            }),
            cashBalanceAPI.getAllExpenses({
              start_date: "2025-05-01T00:00:00",
              end_date:   "2025-06-01T00:00:00",
            }),
          ])

          setCashBalances(incRes)
          setExpenses(expRes)

          // Merge _after_ both complete
          const merged: Transaction[] = [
          // map incomes
          ...incRes.data.map(o => ({
            id:          o.id,
            date:        o.created_at ?? o.date,   // prefer created_at but fallback
            type:        "income" as const,
            category:    o.category,
            descriptions: o.descriptions,
            amount:      o.amount,
          })),
          // map expenses
          ...expRes.data.map(e => ({
            id:          e.id,
            date:        e.date,                        // your expense already has `.date`
            type:        "expense" as const,
            category:    e.category,
            descriptions: e.descriptions,
            amount:      e.amount,
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          
          setTransactions(merged)
        }
        catch (err: any) {
          console.error(err)
        }
      }
    fetchAll()
    
  }, [page, activeTab]);
  
  const totalIncome = cashBalances
  ? cashBalances.data.reduce((sum, cash) => sum + cash.amount, 0)
  : 0;
  console.log(`total sales: ${totalIncome}`)

  // handleActiveTab
  const handleActiveTab = useCallback((tab: string) => {
    // you could narrow `tab` to TabValue here if you like:
    setActiveTab(tab as TabValue);
    setPage(1);
  }, []);

  const filteredTransactions = useMemo(() => {
    if (activeTab === "all") return transactions;
    return transactions.filter(tx => tx.type === activeTab);
  }, [transactions, activeTab]);

  const paginatedData = filteredTransactions.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filteredTransactions.length / 10);

  const totalExpenses = expenses
  ? expenses.data.reduce((sum, expense) => sum + expense.amount, 0)
  : 0;
  console.log(`total expense: ${totalExpenses}`)

  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    // In a real implementation, this would call the API
    const newTransaction = {
      ...currentTransaction,
      id: transactions.length + 1,
    };
    setTransactions([...transactions, newTransaction]);
    setCurrentTransaction({
      id: 0,
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "",
      description: "",
      amount: 0,
    });
    setIsAddDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Categories based on transaction type
  const getCategories = (type: string) => {
    if (type === "income") {
      return ["Sales", "Investment", "Other Income"];
    } else {
      return [
        "Ingredients",
        "Utilities",
        "Rent",
        "Salary",
        "Equipment",
        "Marketing",
        "Other",
      ];
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Cash Balance Management</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Balance</CardTitle>
                <CardDescription>Total available cash</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(balance)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Income</CardTitle>
                <CardDescription>All time income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Expenses</CardTitle>
                <CardDescription>All time expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all cash transactions for your business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={handleActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            {format(new Date(tx.date), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                tx.type === "income"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100   text-red-800",
                              ].join(" ")}
                            >
                              {tx.type === "income" ? "Income" : "Expense"}
                            </span>
                          </TableCell>
                          <TableCell>{tx.category}</TableCell>
                          <TableCell>{tx.descriptions}</TableCell>
                          <TableCell className="text-right">
                            <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(tx.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No data found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(filteredTransactions.length / 10)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </main>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of the new cash transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={currentTransaction.date}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                Type
              </label>
              <Select
                value={currentTransaction.type}
                onValueChange={(value) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    type: value,
                    category: "", // Reset category when type changes
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Category
              </label>
              <Select
                value={currentTransaction.category}
                onValueChange={(value) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    category: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategories(currentTransaction.type).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input
                id="description"
                className="col-span-3"
                value={currentTransaction.description}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={currentTransaction.amount}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    amount: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
