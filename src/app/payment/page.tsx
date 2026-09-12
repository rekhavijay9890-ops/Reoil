"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { payment, propertyTypes } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

export default function PaymentPage() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");
  const [reference, setReference] = useState("");

  const rate = payment.rates[type as keyof typeof payment.rates] ?? payment.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const total = useMemo(() => litersNum * rate, [litersNum, rate]);

  const upiUrl = useMemo(() => {
    const note = reference.trim()
      ? `Reoil pickup ${reference.trim()}`
      : "Reoil oil collection";
    const params = new URLSearchParams({
      pa: payment.upiId,
      pn: payment.upiName,
      am: total.toFixed(2),
      cu: payment.currency,
      tn: note,
    });
    return `upi://pay?${params.toString()}`;
  }, [total, reference]);

  return (
    <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-reoil-dark sm:text-4xl">
          Pay for collection
        </h1>
        <p className="mt-3 text-muted-foreground">{payment.subtitle}</p>
      </div>

      <Card className="border-border/60 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <CreditCard className="size-5 text-reoil" />
            Collection payment
          </CardTitle>
          <CardDescription>Rates vary by property type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>Property type</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {propertyTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setType(item.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    type === item.value
                      ? "border-reoil bg-reoil text-white"
                      : "border-border bg-white text-muted-foreground hover:border-reoil/40",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-reoil">
              Rate: {payment.symbol}{rate} {payment.rateUnit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liters">Liters collected</Label>
            <Input
              id="liters"
              type="number"
              min="0"
              step="0.5"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Booking reference (optional)</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Your name or booking ID"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-reoil-mint px-5 py-4">
            <span className="font-medium text-reoil-dark">Amount due</span>
            <span className="font-heading text-3xl font-bold text-reoil-dark">
              {payment.symbol}{total.toFixed(0)}
            </span>
          </div>

          <a
            href={total > 0 ? upiUrl : undefined}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground",
              total <= 0 && "pointer-events-none opacity-50",
            )}
          >
            Pay with UPI
          </a>

          <p className="text-center text-sm text-muted-foreground">{payment.cashNote}</p>
          <p className="text-center text-sm font-medium text-reoil">
            UPI ID: {payment.upiId}
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need help?{" "}
        <Link href="/contact" className="font-medium text-reoil hover:underline">
          Contact us
        </Link>
      </p>
    </section>
  );
}
