import { Droplets } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2 font-heading text-sm font-semibold text-reoil-dark">
          <Droplets className="size-4 text-reoil-light" />
          Reoil
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Reoil — Used cooking oil collection
        </p>
      </div>
    </footer>
  );
}
