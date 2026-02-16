"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Crown,
  Users,
  LineChart,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/subscription-plans", label: "Subscription Plan", icon: Crown },
  { href: "/students", label: "Students List", icon: Users },
  { href: "/reports", label: "Report & Analysis", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col gap-10 border-r border-brand-100 bg-white px-8 py-8 lg:flex">
      <Logo />
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                active
                  ? "text-brand-600"
                  : "text-muted hover:text-brand-600"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-auto flex items-center gap-3 text-sm font-semibold text-red-500"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
