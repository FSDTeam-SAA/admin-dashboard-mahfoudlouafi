import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <div className="text-3xl font-semibold text-foreground">
          Tull<span className="text-brand-600">y</span>
        </div>
        <CheckCircle2 className="h-6 w-6 text-brand-600" />
      </div>
      <span className="text-xs text-muted">Smart Student Tasks</span>
    </div>
  );
}
