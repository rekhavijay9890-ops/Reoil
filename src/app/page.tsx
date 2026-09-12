import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stats, steps } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { HomeExtras } from "@/components/home-extras";
import { Droplets, Leaf, Recycle, Truck } from "lucide-react";

const stepIcons = [Truck, Droplets, Recycle];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-reoil-light/30 bg-reoil-mint px-4 py-1.5 text-sm font-medium text-reoil-dark">
            <Leaf className="size-4 text-reoil" />
            Eco-friendly oil recycling
          </div>
          <h1 className="font-heading text-balance text-4xl font-bold leading-[1.1] text-reoil-dark sm:text-5xl lg:text-[3.25rem]">
            Turn used cooking oil into a cleaner planet
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Reoil collects used cooking oil from homes and restaurants, keeping grease
            out of drains and turning waste into biofuel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/schedule"
              className={cn(buttonVariants({ size: "lg" }), "shadow-md shadow-reoil/20")}
            >
              Schedule a pickup
            </Link>
            <Link
              href="#how"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-reoil/20")}
            >
              Learn more
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-reoil-dark via-reoil to-reoil-light text-white shadow-2xl shadow-reoil-dark/20">
          <CardContent className="p-8 sm:p-10">
            <h2 className="font-heading text-xl font-semibold">Why Reoil?</h2>
            <dl className="mt-6 space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between border-b border-white/15 pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-sm leading-snug text-white/85">{stat.label}</dt>
                  <dd className="font-heading text-2xl font-bold tabular-nums">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section id="how" className="border-t border-border/60 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-reoil-dark sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps from your kitchen to clean energy.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <Card
                  key={step.title}
                  className="border-border/60 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="px-6 pt-8 pb-7">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-reoil-mint text-reoil">
                      <Icon className="size-7" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-reoil-light">
                      Step {i + 1}
                    </span>
                    <h3 className="mt-2 font-heading text-lg font-semibold text-reoil-dark">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <HomeExtras />

      <section id="impact" className="relative overflow-hidden bg-reoil-dark py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(82,183,136,0.4) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-balance text-3xl font-bold sm:text-4xl">
            Ready to recycle your oil?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join homes and restaurants making a difference today.
          </p>
          <Link
            href="/schedule"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "mt-8 inline-flex shadow-lg",
            )}
          >
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}
