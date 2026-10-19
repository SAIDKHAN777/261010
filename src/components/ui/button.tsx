import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "telemetry";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl";

    const variantStyles = {
      primary:
        "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_25px_rgba(220,38,38,0.35)] focus-visible:ring-red-500",
      secondary:
        "bg-surface-elevated text-zinc-100 hover:bg-surface-higher border border-surface-border hover:border-white/20 focus-visible:ring-zinc-400",
      outline:
        "bg-transparent text-zinc-200 border border-white/10 hover:bg-zinc-900 hover:border-red-500/30 focus-visible:ring-red-500",
      ghost:
        "bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white focus-visible:ring-zinc-400",
      telemetry:
        "bg-surface-base text-red-400 hover:bg-surface-elevated border border-red-500/30 hover:border-red-500/60 font-mono text-xs focus-visible:ring-red-500",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-xs tracking-wide",
      md: "h-10 px-5 text-sm tracking-wide",
      lg: "h-11 px-6 text-base tracking-wide font-medium",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
