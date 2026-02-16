import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={800}
        height={800}
        className="h-[56px] w-[142px]"
      />
    </div>
  );
}
