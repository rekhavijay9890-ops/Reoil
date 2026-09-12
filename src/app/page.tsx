import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stats, steps } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Leaf, Recycle, Truck } from "lucide-react";

const stepIcons = [Truck, Droplets, Recycle];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-reoil-dark">
            <Leaf className="size-4" />
            Eco-friendly oil recycling
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-reoil-dark sm:text-5xl">
            Turn used cooking oil into a cleaner planet
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Reoil collects used cooking oil from homes and restaurants, keeping grease
            out of drains and turning waste into biofuel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/schedule" className={cn(buttonVariants({ size: "lg" }))}>
              Schedule a pickup
            </Link>
            <Link
              href="#how"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Learn more
            </Link>
          </div>
        </div>

        <Card className="border-0 bg-gradient-to-br from-reoil-dark to-reoil text-white shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-lg font-medium opacity-90">Why Reoil?</h2>
            <dl className="mt-4 space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between border-b border-white/20 pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-sm opacity-85">{stat.label}</dt>
                  <dd className="text-xl font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section id="how" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-reoil-dark">How it works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <Card key={step.title} className="text-center shadow-sm">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-reoil-light text-white">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-sm font-semibold text-reoil-light">Step {i + 1}</span>
                    <h3 className="mt-1 text-lg font-semibold text-reoil-dark">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="impact" className="bg-reoil-dark py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to recycle your oil?</h2>
          <p className="mt-3 text-white/80">
            Join homes and restaurants making a difference today.
          </p>
          <Link
            href="/schedule"
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "mt-8 inline-flex")}
          >
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}
