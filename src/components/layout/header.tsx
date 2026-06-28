import { Bell, CircleHelp, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/90 backdrop-blur">
      <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            SOC II ready operations
          </div>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Healthcare Claims Admin
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search claims, members, or audit IDs"
              className="h-10 rounded-lg bg-background pl-9"
              placeholder="Search claims, members, audits"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Help center">
              <CircleHelp className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
