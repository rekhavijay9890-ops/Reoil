import { PickupForm } from "@/components/pickup-form";

export default function SchedulePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto mb-10 max-w-lg text-center">
        <h1 className="font-heading text-3xl font-bold text-reoil-dark sm:text-4xl">
          Book your oil pickup
        </h1>
        <p className="mt-3 text-muted-foreground">
          Free collection for homes and restaurants. We&apos;ll confirm within 24 hours.
        </p>
      </div>
      <PickupForm />
    </section>
  );
}
