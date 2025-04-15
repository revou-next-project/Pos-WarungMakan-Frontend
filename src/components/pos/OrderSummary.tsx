"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  Banknote,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  discount?: number;
}

interface OrderSummaryProps {
  items?: OrderItem[];
  onCheckout?: () => void;
  onCancelOrder?: () => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemoveItem?: (id: number) => void;
}

export default function OrderSummary({
  items = [
    { id: 1, name: "Ricebox Ayam", price: 20000, quantity: 2, note: "" },
    { id: 2, name: "Sate Fishball", price: 10000, quantity: 1, note: "" },
    { id: 3, name: "Es Teh Manis", price: 5000, quantity: 2, note: "" },
  ],
  onCheckout = () => {},
  onCancelOrder = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
}: OrderSummaryProps) {
  const [paymentStep, setPaymentStep] = useState<
    "order" | "payment" | "confirmation" | "receipt"
  >("order");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "qris" | "transfer"
  >("cash");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [orderDiscount, setOrderDiscount] = useState<number>(0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = Math.round(subtotal * (orderDiscount / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = Math.round(subtotalAfterDiscount * 0.1); // 10% tax
  const total = subtotalAfterDiscount + tax;

  const handleQuantityChange = (id: number, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    onRemoveItem(id);
  };

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const handleBackToOrder = () => {
    setPaymentStep("order");
  };

  const handleConfirmPayment = () => {
    setPaymentStep("confirmation");
    // In a real app, this would process the payment
    setTimeout(() => {
      setPaymentStep("receipt");
    }, 2000);
  };

  const calculateChange = () => {
    const amount = parseFloat(cashAmount) || 0;
    return Math.max(0, amount - total);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Card className="h-full bg-white flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
      </CardHeader>

      {paymentStep === "order" && (
        <>
          <CardContent className="flex-grow overflow-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No items in order</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.note && (
                        <p className="text-xs italic text-muted-foreground">
                          Note: {item.note}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)}
                        </p>
                        {item.discount && item.discount > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700"
                          >
                            {item.discount}% off
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>

          <CardFooter className="flex-col border-t pt-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {orderDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({orderDiscount}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <Button variant="outline" onClick={onCancelOrder}>
                Cancel Order
              </Button>
              <Button
                onClick={handleProceedToPayment}
                disabled={items.length === 0}
              >
                Checkout
              </Button>
            </div>
          </CardFooter>
        </>
      )}

      {paymentStep === "payment" && (
        <>
          <CardContent className="flex-grow">
            <h3 className="text-lg font-semibold mb-4">Order Discount</h3>
            <div className="mb-6 space-y-2">
              <Label htmlFor="order-discount">Discount (%)</Label>
              <Input
                id="order-discount"
                type="number"
                min="0"
                max="100"
                value={orderDiscount}
                onChange={(e) => setOrderDiscount(Number(e.target.value))}
                placeholder="Enter discount percentage"
              />
            </div>

            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "cash" | "qris" | "transfer")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label
                  htmlFor="cash"
                  className="flex items-center cursor-pointer"
                >
                  <Banknote className="mr-2 h-5 w-5" />
                  Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="qris" id="qris" />
                <Label
                  htmlFor="qris"
                  className="flex items-center cursor-pointer"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  QRIS
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label
                  htmlFor="transfer"
                  className="flex items-center cursor-pointer"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Transfer
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "cash" && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="cash-amount">Cash Amount</Label>
                <Input
                  id="cash-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
                {cashAmount && parseFloat(cashAmount) >= total && (
                  <div className="mt-2">
                    <Label>Change</Label>
                    <div className="text-lg font-semibold">
                      {formatCurrency(calculateChange())}
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "qris" && (
              <div className="mt-4 flex flex-col items-center">
                <div className="bg-gray-200 w-48 h-48 flex items-center justify-center mb-2">
                  <QrCode size={120} />
                </div>
                <p className="text-sm text-center">
                  Scan this QR code to pay {formatCurrency(total)}
                </p>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div className="mt-4 space-y-2">
                <div className="border rounded-md p-3">
                  <p className="font-medium">Bank Transfer Details</p>
                  <p className="text-sm">Bank: BCA</p>
                  <p className="text-sm">Account: 1234567890</p>
                  <p className="text-sm">Name: Warung Makan</p>
                  <p className="text-sm font-medium mt-2">
                    Amount: {formatCurrency(total)}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Order Total</h3>
              <div className="text-2xl font-bold">{formatCurrency(total)}</div>
            </div>
          </CardContent>

          <CardFooter className="flex-col border-t pt-4">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" onClick={handleBackToOrder}>
                Back
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={
                  paymentMethod === "cash" &&
                  (!cashAmount || parseFloat(cashAmount) < total)
                }
              >
                Confirm Payment
              </Button>
            </div>
          </CardFooter>
        </>
      )}

      {paymentStep === "confirmation" && (
        <CardContent className="flex-grow flex flex-col items-center justify-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-base">
            Payment Successful
          </Badge>
          <p className="text-center mb-4">
            Your order has been processed and sent to the kitchen.
          </p>
          <p className="text-center text-muted-foreground">
            Generating receipt...
          </p>
        </CardContent>
      )}

      {paymentStep === "receipt" && (
        <>
          <CardContent className="flex-grow overflow-auto">
            <div className="border rounded-md p-4 mb-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-xl">Warung Makan</h3>
                <p className="text-sm text-muted-foreground">
                  Jl. Contoh No. 123, Jakarta
                </p>
                <p className="text-sm text-muted-foreground">
                  Tel: 021-1234567
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date().toLocaleString()}
                </p>
              </div>

              <Separator className="my-2" />

              <div className="space-y-2 mb-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      {item.note && (
                        <span className="text-xs italic ml-1">
                          ({item.note})
                        </span>
                      )}
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {orderDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount ({orderDiscount}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {paymentMethod === "cash" && parseFloat(cashAmount) > 0 && (
                  <>
                    <div className="flex justify-between mt-2">
                      <span>Cash</span>
                      <span>{formatCurrency(parseFloat(cashAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change</span>
                      <span>{formatCurrency(calculateChange())}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-4 text-xs text-muted-foreground">
                <p>Payment Method: {paymentMethod.toUpperCase()}</p>
                <p className="mt-2">Thank you for your purchase!</p>
                <p>Please come again</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col border-t pt-4">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setPaymentStep("order");
                  setCashAmount("");
                  setOrderDiscount(0);
                  onCheckout();
                }}
              >
                New Order
              </Button>
              <Button
                onClick={() => {
                  // This would trigger actual printing in a real app
                  alert("Printing receipt...");
                }}
              >
                Print Receipt
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
