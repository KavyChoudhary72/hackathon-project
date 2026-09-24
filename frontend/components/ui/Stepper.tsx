"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export interface StepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
  size?: "md" | "lg";
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 1000,
  step = 1,
  unit,
  className,
  size = "md",
}) => {
  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-surface-subtle p-1.5 rounded-2xl border border-neutral-200/80 select-none shadow-2xs",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(
          "flex items-center justify-center rounded-xl bg-white text-neutral-800 shadow-sm border border-neutral-200/60 hover:bg-neutral-50 active:scale-90 transition-all duration-100 disabled:opacity-30 disabled:pointer-events-none",
          size === "lg" ? "w-11 h-11" : "w-9 h-9"
        )}
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <div
        className={cn(
          "flex items-baseline justify-center font-bold text-neutral-900 px-4",
          size === "lg" ? "min-w-[5rem] text-xl" : "min-w-[4rem] text-base"
        )}
      >
        <span>{value}</span>
        {unit && (
          <span className="ml-1 text-xs text-neutral-500 font-semibold uppercase">
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(
          "flex items-center justify-center rounded-xl bg-white text-neutral-800 shadow-sm border border-neutral-200/60 hover:bg-neutral-50 active:scale-90 transition-all duration-100 disabled:opacity-30 disabled:pointer-events-none",
          size === "lg" ? "w-11 h-11" : "w-9 h-9"
        )}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};
