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
    <aside className="hidden w-72 flex-col border-r border-gray-100 bg-white px-6 py-10 lg:flex">
      <div className="mb-12 px-2">
        <Logo />
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[#FFB352]/10 text-[#FFB352]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#FFB352]"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                active ? "text-[#FFB352]" : "text-gray-400 group-hover:text-[#FFB352]"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}