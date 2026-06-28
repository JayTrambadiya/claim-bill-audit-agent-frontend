import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface Props {
  children: ReactNode;
}

export function DashboardShell({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
