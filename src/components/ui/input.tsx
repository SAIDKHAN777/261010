import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-none border bg-canvas-subtle px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 ease-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-rose-500/80 focus-visible:ring-rose-500/50"
              : "border-surface-border focus-visible:border-red-500 focus-visible:ring-red-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-rose-400 font-mono flex items-center gap-1">
            <span aria-hidden="true">↳</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
