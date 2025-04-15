"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryManager from "@/components/pos/InventoryManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Inventory Manager</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <InventoryManager />
        </CardContent>
      </Card>
    </div>
  );
}
