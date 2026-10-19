import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-none border bg-canvas-subtle px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 ease-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
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

Textarea.displayName = "Textarea";
