"use client";

import { useState } from "react"; // Added useState
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Crown,
  Users,
  LineChart,
  Settings,
  LogOut,
  AlertCircle // Added for the modal icon
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
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for modal

  return (
    <>
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
          {/* Trigger Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- Logout Confirmation Modal --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
              <p className="mt-2 text-gray-500">Are you sure you want to log out of your account?</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full rounded-2xl bg-gray-100 py-3.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}