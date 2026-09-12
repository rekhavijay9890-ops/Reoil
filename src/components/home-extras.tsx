"use client";

import { useMemo, useState } from "react";
import { contact, payout, propertyTypes } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Phone } from "lucide-react";

const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;

export function HomeExtras() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");

  const rate = payout.rates[type as keyof typeof payout.rates] ?? payout.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const total = useMemo(() => litersNum * rate, [litersNum, rate]);

  return (
    <section className="border-t border-border/60 bg-reoil-cream py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="pt-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-reoil-light">
              Payout
            </span>
            <h3 className="mt-2 font-heading text-xl font-semibold text-reoil-dark">
              {payout.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{payout.subtitle}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {propertyTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setType(item.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium",
                    type === item.value
                      ? "border-reoil bg-reoil text-white"
                      : "border-border bg-white text-muted-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-medium text-reoil">
              We pay {payout.symbol}{rate} {payout.rateUnit}
            </p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="home-liters">Estimated liters</Label>
              <Input
                id="home-liters"
                type="number"
                min="0"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-reoil-mint px-4 py-3">
              <span className="font-medium text-reoil-dark">You receive</span>
              <span className="font-heading text-2xl font-bold text-reoil-dark">
                {payout.symbol}{total.toFixed(0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="pt-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-reoil-light">
              Support
            </span>
            <h3 className="mt-2 font-heading text-xl font-semibold text-reoil-dark">Need help?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Chat on WhatsApp or call us for pickup, payout, or schedule questions.
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-[#25D366] px-4 py-3 text-white"
              >
                <MessageCircle className="size-5" />
                <span className="font-medium">Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-reoil-mint/50 px-4 py-3"
              >
                <Phone className="size-5 text-reoil" />
                <span className="font-medium text-reoil-dark">{contact.displayPhone}</span>
              </a>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {contact.supportHours}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
