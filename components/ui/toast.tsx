"use client";

import { useState, createContext, useContext } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 md:p-6 space-y-4 z-[100] max-w-sm w-full flex flex-col pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-full slide-out-to-right-full bg-background overflow-hidden relative",
              toast.type === "success" && "border-green-500/30",
              toast.type === "error" && "border-red-500/30",
              toast.type === "info" && "border-blue-500/30"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {toast.type === "error" && <XCircle className="h-5 w-5 text-red-500" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-md p-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* Progress bar */}
            <div 
              className={cn(
                "absolute bottom-0 left-0 h-1 bg-muted w-full origin-left animate-[shrink_5s_linear_forwards]",
                toast.type === "success" && "bg-green-500",
                toast.type === "error" && "bg-red-500",
                toast.type === "info" && "bg-blue-500"
              )}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
