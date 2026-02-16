"use client";

import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";

export function Topbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="mb-6 flex items-center justify-end gap-4">
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
  );
}
