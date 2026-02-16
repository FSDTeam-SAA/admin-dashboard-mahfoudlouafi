"use client";

import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";

export function FullHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-600">
          <Bell className="h-5 w-5" />
        </button>
        <Avatar
          src={user?.image || undefined}
          alt={user?.name || "Avatar"}
          fallback={user?.name?.slice(0, 1) || "A"}
          className="h-11 w-11"
        />
      </div>
    </div>
  );
}
