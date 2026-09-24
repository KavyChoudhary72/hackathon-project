"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "success"
    | "icon"
    | "pill-chip"
    | "floating";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isSuccess = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-brand-800 text-white shadow-sm hover:bg-brand-700 active:scale-97 active:shadow-pressed",
      secondary:
        "bg-white text-brand-800 border border-neutral-200 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 active:scale-97 active:shadow-pressed",
      ghost:
        "bg-transparent text-neutral-700 hover:bg-neutral-100/80 active:bg-neutral-200/80 active:scale-97",
      danger:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-97 active:shadow-pressed",
      success:
        "bg-green-600 text-white shadow-sm hover:bg-green-700 active:scale-97 active:shadow-pressed",
      icon: "p-2 rounded-full text-neutral-700 hover:bg-neutral-100 active:scale-95",
      "pill-chip":
        "rounded-full bg-brand-100 text-brand-800 font-semibold border border-brand-200/60 hover:bg-brand-200/60 active:scale-97",
      floating:
        "rounded-full bg-brand-800 text-white shadow-float hover:bg-brand-700 active:scale-95",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-xl gap-1.5",
      md: "h-10 px-4 text-sm rounded-2xl gap-2",
      lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
      xl: "w-full h-14 min-h-[56px] px-6 text-lg font-bold rounded-2xl gap-3 shadow-md", // One-thumb mobile action
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="opacity-80">Loading...</span>
          </span>
        ) : isSuccess ? (
          <span className="flex items-center gap-2 text-white">
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Success</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="truncate leading-normal">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
