import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Droplets } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-reoil-dark sm:text-2xl"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-reoil-mint text-reoil">
            <Droplets className="size-4" />
          </span>
          Re<span className="text-reoil-light">oil</span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/#how"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-reoil"
          >
            How it works
          </Link>
          <Link
            href="/#impact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-reoil"
          >
            Impact
          </Link>
          <Link
            href="/payment"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-reoil"
          >
            Get paid
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-reoil"
          >
            Contact
          </Link>
          <Link href="/schedule" className={cn(buttonVariants({ size: "sm" }), "shadow-sm")}>
            Schedule pickup
          </Link>
        </nav>
        <Link
          href="/schedule"
          className={cn(buttonVariants({ size: "sm" }), "sm:hidden shadow-sm")}
        >
          Schedule
        </Link>
      </div>
    </header>
  );
}
