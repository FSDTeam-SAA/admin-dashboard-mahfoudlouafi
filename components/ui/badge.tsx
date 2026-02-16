import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "danger" | "info" | "neutral";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  success: "bg-[#5ecb2d] text-white",
  danger: "bg-[#ff4d4f] text-white",
  info: "bg-[#4fd1ff] text-white",
  neutral: "bg-brand-50 text-brand-600"
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold", variants[variant], className)}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export { Badge };
