import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pill?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      pill = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-bold text-neutral-800 tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-neutral-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full bg-surface-subtle text-neutral-900 border border-neutral-200/90 text-sm font-medium transition-all duration-150 placeholder:text-neutral-400 focus:bg-white focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 focus:outline-none disabled:opacity-50 disabled:bg-neutral-100",
              pill ? "rounded-full h-11 px-5" : "rounded-2xl h-11 px-4",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 text-neutral-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
