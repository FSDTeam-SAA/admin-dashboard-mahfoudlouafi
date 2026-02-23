"use client";

import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";

export function Topbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className=" flex items-center justify-end gap-4">
      <Avatar
        src={user?.image || undefined}
        alt={user?.name || "Avatar"}
        fallback={user?.name?.slice(0, 1) || "A"}
        className="h-11 w-11"
      />
    </div>
  );
}
