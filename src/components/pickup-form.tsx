"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { propertyTypes, quantities } from "@/lib/content";
import { CheckCircle2, Loader2 } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export function PickupForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [type, setType] = useState("home");
  const [quantity, setQuantity] = useState("5-10");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          address: data.get("address"),
          type,
          quantity,
          notes: data.get("notes"),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Something went wrong");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to submit request");
    }
  }

  if (state === "success") {
    return (
      <Card className="mx-auto max-w-lg border-reoil-light/30">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle2 className="size-14 text-reoil" />
          <h2 className="text-2xl font-semibold text-reoil-dark">Pickup requested!</h2>
          <p className="text-muted-foreground">
            We&apos;ll contact you within 24 hours to confirm your collection time.
          </p>
          <Button onClick={() => setState("idle")} variant="outline">
            Submit another request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-reoil-dark">Schedule a pickup</CardTitle>
        <CardDescription>
          Fill in your details and we&apos;ll arrange a convenient collection time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Jane Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required type="tel" placeholder="+1 555 000 0000" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" required type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Pickup address</Label>
            <Textarea
              id="address"
              name="address"
              required
              placeholder="Street, city, postal code"
              rows={2}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Property type</Label>
              <Select value={type} onValueChange={(v) => v && setType(v)}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Estimated quantity</Label>
              <Select value={quantity} onValueChange={(v) => v && setQuantity(v)}>
                <SelectTrigger id="quantity" className="w-full">
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  {quantities.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Access instructions, preferred time, etc."
              rows={2}
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={state === "submitting"}>
            {state === "submitting" ? (
              <>
                <Loader2 className="animate-spin" />
                Submitting…
              </>
            ) : (
              "Request pickup"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
