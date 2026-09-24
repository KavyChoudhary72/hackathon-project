"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { eventBus } from "@/lib/ws/eventBus";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "celebration";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void;
  celebrate: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  celebrate: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = ({
    type,
    title,
    message,
    duration = 4000,
  }: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const celebrate = (title: string, message: string) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#113A2B", "#F9683A", "#F5A623", "#10B981"],
      });
    } catch (e) {
      console.warn("Confetti error", e);
    }
    toast({
      type: "celebration",
      title,
      message,
      duration: 5000,
    });
  };

  useEffect(() => {
    const unsub = eventBus.on("toast:celebration", (data: any) => {
      celebrate(data.title, data.message);
    });
    return () => unsub();
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, celebrate }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-float border transition-all duration-300 animate-in slide-in-from-bottom-5",
              t.type === "celebration" &&
                "bg-brand-900 text-white border-brand-700/80 ring-2 ring-accent-500/50",
              t.type === "success" &&
                "bg-emerald-900 text-white border-emerald-700",
              t.type === "error" && "bg-red-900 text-white border-red-700",
              t.type === "info" && "bg-neutral-900 text-white border-neutral-700"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === "celebration" && (
                <Trophy className="w-5 h-5 text-accent-500 animate-bounce" />
              )}
              {t.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              {t.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              {t.type === "info" && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold leading-tight">{t.title}</h4>
              {t.message && (
                <p className="text-xs text-neutral-300 mt-1">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
