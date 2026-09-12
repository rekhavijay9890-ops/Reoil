"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { payout, propertyTypes } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Banknote, Droplets } from "lucide-react";

export default function PaymentPage() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");
  const [method, setMethod] = useState("cash");

  const rate = payout.rates[type as keyof typeof payout.rates] ?? payout.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const total = useMemo(() => litersNum * rate, [litersNum, rate]);

  return (
    <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-reoil-dark sm:text-4xl">
          {payout.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{payout.subtitle}</p>
      </div>

      <Card className="mb-4 border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {payout.flow.map((item) => (
            <div key={item.step} className="flex gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-reoil-mint text-sm font-bold text-reoil">
                {item.step}
              </span>
              <div>
                <p className="font-medium text-reoil-dark">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Banknote className="size-5 text-reoil" />
            Estimate your payout
          </CardTitle>
          <CardDescription>We buy your used oil — you get paid at pickup</CardDescription>
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
              We pay {payout.symbol}{rate} {payout.rateUnit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liters">Estimated liters of oil</Label>
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

          <div>
            <Label>How would you like to be paid?</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {payout.methods.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMethod(item.value)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    method === item.value
                      ? "border-reoil bg-reoil-mint"
                      : "border-border bg-white hover:border-reoil/30",
                  )}
                >
                  <p className="font-medium text-reoil-dark">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-reoil-mint px-5 py-4">
            <span className="font-medium text-reoil-dark">You receive (estimate)</span>
            <span className="font-heading text-3xl font-bold text-reoil-dark">
              {payout.symbol}{total.toFixed(0)}
            </span>
          </div>

          <Link
            href="/schedule"
            className={cn(buttonVariants({ size: "lg" }), "w-full shadow-md")}
          >
            <Droplets className="size-4" />
            Schedule pickup & get paid
          </Link>

          <p className="text-center text-xs text-muted-foreground">{payout.note}</p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Questions about rates?{" "}
        <Link href="/contact" className="font-medium text-reoil hover:underline">
          Contact us
        </Link>
      </p>
    </section>
  );
}
