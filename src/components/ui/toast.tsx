"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  detail?: string;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-lg border bg-surface-elevated shadow-tactile-elevated animate-in slide-in-from-bottom-2 duration-150",
              toast.type === "success" && "border-red-500/40 text-red-400",
              toast.type === "error" && "border-rose-500/40 text-rose-400",
              toast.type === "warning" && "border-amber-500/40 text-amber-400",
              toast.type === "info" && "border-red-500/40 text-red-400"
            )}
          >
            <span className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-red-500" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 text-rose-400" />}
              {toast.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-400" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-red-400" />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100">{toast.title}</p>
              {toast.detail && (
                <p className="text-xs text-slate-400 mt-0.5 font-mono leading-relaxed">
                  {toast.detail}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-100 p-1 -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
