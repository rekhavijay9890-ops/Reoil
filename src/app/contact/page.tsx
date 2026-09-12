import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contact } from "@/lib/content";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";

const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;
const telUrl = `tel:${contact.phone}`;

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-reoil-dark sm:text-4xl">
          Contact us
        </h1>
        <p className="mt-3 text-muted-foreground">
          Need help with a pickup, payment, or schedule change? Reach our team directly.
        </p>
      </div>

      <Card className="border-border/60 shadow-md">
        <CardHeader>
          <CardTitle className="font-heading">Quick support</CardTitle>
          <CardDescription>
            Our team typically replies within a few hours during business hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-4 rounded-lg bg-[#25D366] px-4 py-4 text-white transition-colors hover:bg-[#20bd5a]"
          >
            <MessageCircle className="size-6 shrink-0" />
            <div>
              <div className="font-semibold">Chat on WhatsApp</div>
              <div className="text-sm opacity-90">Fastest way to get help</div>
            </div>
          </a>

          <a
            href={telUrl}
            className="flex w-full items-center gap-4 rounded-lg border border-reoil/20 bg-reoil-mint/50 px-4 py-4 transition-colors hover:bg-reoil-mint"
          >
            <Phone className="size-6 shrink-0 text-reoil" />
            <div>
              <div className="font-semibold text-reoil-dark">Call us</div>
              <div className="text-sm text-muted-foreground">{contact.displayPhone}</div>
            </div>
          </a>
        </CardContent>
      </Card>

      <Card className="mt-4 border-border/60 shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 text-reoil" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Support hours</p>
              <p className="text-reoil-dark">{contact.supportHours}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-reoil" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <a href={`mailto:${contact.email}`} className="text-reoil hover:underline">
                {contact.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        For emergencies during pickup, call us directly.{" "}
        <Link href="/schedule" className="font-medium text-reoil hover:underline">
          Book a pickup
        </Link>
      </p>
    </section>
  );
}
