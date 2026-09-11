import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-reoil-dark">
          Re<span className="text-reoil-light">oil</span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/#how"
            className="text-sm text-muted-foreground transition-colors hover:text-reoil"
          >
            How it works
          </Link>
          <Link
            href="/#impact"
            className="text-sm text-muted-foreground transition-colors hover:text-reoil"
          >
            Impact
          </Link>
          <Link href="/schedule" className={cn(buttonVariants({ size: "sm" }))}>
            Schedule pickup
          </Link>
        </nav>
        <Link
          href="/schedule"
          className={cn(buttonVariants({ size: "sm" }), "sm:hidden")}
        >
          Schedule
        </Link>
      </div>
    </header>
  );
}
