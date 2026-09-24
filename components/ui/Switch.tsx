"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  className,
}) => {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "w-12 h-6.5 rounded-full transition-colors duration-200 ease-in-out border",
            checked
              ? "bg-brand-800 border-brand-800"
              : "bg-neutral-200 border-neutral-300"
          )}
        >
          <div
            className={cn(
              "w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out mt-0.5",
              checked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </div>
      </div>
      {(label || sublabel) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-sm font-semibold text-neutral-900 leading-tight">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-xs text-neutral-500 mt-0.5">{sublabel}</span>
          )}
        </div>
      )}
    </label>
  );
};
