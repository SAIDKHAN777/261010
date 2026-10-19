import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "crimson" | "emerald" | "cyan" | "outline" | "muted";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium tracking-tight transition-colors select-none";

  const variantStyles = {
    default:
      "bg-zinc-900 text-zinc-200 border border-white/10",
    crimson:
      "bg-red-500/10 text-red-400 border border-red-500/30",
    emerald:
      "bg-red-500/10 text-red-400 border border-red-500/30",
    cyan:
      "bg-red-500/10 text-red-400 border border-red-500/30",
    outline:
      "bg-transparent text-zinc-300 border border-white/10",
    muted:
      "bg-zinc-900/60 text-zinc-400 border border-white/5",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
