"use client";

import Image from "next/image";
import Link from "next/link";
import { Activity, FileWarning, LayoutDashboard, ShieldCheck, Upload } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
    {
        title: "Upload Claims",
        href: "/upload",
        icon: Upload,
    },
    {
        title: "Audit Results",
        href: "/audits",
        icon: FileWarning,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-72 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
            <div className="border-b p-5">
                <Image
                    src="https://cdn.prod.website-files.com/6870021f10cb5579739f03a5/687008ed0cf8b885a669d02b_Group-633120.svg"
                    alt="TrueClaim"
                    width={162}
                    height={37}
                    className="h-8 w-auto"
                />
                <div className="mt-5 rounded-lg border bg-background p-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <LayoutDashboard className="size-4 text-primary" />
                        Modern Health Plan
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Live claim audit workspace
                    </p>
                </div>
            </div>

            <nav className="space-y-1 p-3">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition
              ${
                                pathname === item.href
                                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-xs"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t p-4">
                <div className="rounded-lg bg-background p-4 ">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <ShieldCheck className="size-4 text-sky-300" />
                        Trust posture
                    </div>
                    <p className="mt-2 text-xs leading-5 ">
                        HIPAA audit active, employer data protected.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-sky-200">
                        <Activity className="size-3.5" />
                        24/7 AI review online
                    </div>
                </div>
            </div>
        </aside>
    );
}
