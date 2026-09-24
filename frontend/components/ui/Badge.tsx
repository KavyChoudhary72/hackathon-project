import React from "react";
import { cn } from "@/lib/utils";
import { TierType, DonationStatus } from "@/lib/api/types";

// Tier Badge
export const TierBadge: React.FC<{
  tier: TierType;
  className?: string;
  showSubtext?: boolean;
}> = ({ tier, className, showSubtext = false }) => {
  const configs = {
    1: {
      label: "Tier 1: Human Shelters",
      shortLabel: "Tier 1",
      subtext: "Free to Shelters",
      bg: "bg-tier-1-bg text-tier-1-text border-tier-1-border",
    },
    2: {
      label: "Tier 2: Rescue Deals",
      shortLabel: "Tier 2",
      subtext: "₹30-₹50 Student Deals",
      bg: "bg-tier-2-bg text-tier-2-text border-tier-2-border",
    },
    3: {
      label: "Tier 3: Bio-Diversion",
      shortLabel: "Tier 3",
      subtext: "Gaushala / Biogas",
      bg: "bg-tier-3-bg text-tier-3-text border-tier-3-border",
    },
  };

  const config = configs[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
        config.bg,
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      <span>{showSubtext ? config.label : config.shortLabel}</span>
      {showSubtext && (
        <span className="text-[10px] opacity-75 font-normal">
          ({config.subtext})
        </span>
      )}
    </span>
  );
};

// Indian FSSAI Veg / Non-Veg compliance indicator
export const VegBadge: React.FC<{
  isVeg: boolean;
  showLabel?: boolean;
  className?: string;
}> = ({ isVeg, showLabel = true, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        className
      )}
    >
      <span
        className={cn(
          "w-4 h-4 rounded-sm border flex items-center justify-center p-0.5",
          isVeg
            ? "border-green-600 bg-white"
            : "border-red-600 bg-white"
        )}
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isVeg ? "bg-green-600" : "bg-red-600"
          )}
        />
      </span>
      {showLabel && (
        <span
          className={cn(
            "font-semibold text-xs",
            isVeg ? "text-green-800" : "text-red-800"
          )}
        >
          {isVeg ? "Pure Veg" : "Non-Veg"}
        </span>
      )}
    </span>
  );
};

// State Machine Status Badge
export const StatusBadge: React.FC<{
  status: DonationStatus;
  className?: string;
}> = ({ status, className }) => {
  const configs: Record<
    DonationStatus,
    { label: string; bg: string; dot: string }
  > = {
    CREATED: {
      label: "Donation Created",
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    MATCHED: {
      label: "Shelter Matched",
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      dot: "bg-purple-500",
    },
    DRIVER_ASSIGNED: {
      label: "Driver Assigned",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    IN_TRANSIT: {
      label: "In Transit",
      bg: "bg-sky-100 text-sky-700 border-sky-300",
      dot: "bg-sky-500 animate-pulse",
    },
    DELIVERED: {
      label: "Delivered",
      bg: "bg-green-100 text-green-800 border-green-300",
      dot: "bg-green-600",
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "bg-gray-100 text-gray-700 border-gray-300",
      dot: "bg-gray-400",
    },
    EXPIRED: {
      label: "Expired",
      bg: "bg-red-100 text-red-800 border-red-300",
      dot: "bg-red-500",
    },
    ESCALATED_TIER2: {
      label: "Rescue Deals (Tier 2)",
      bg: "bg-amber-100 text-amber-800 border-amber-300",
      dot: "bg-amber-500",
    },
    ESCALATED_TIER3: {
      label: "Bio-Diversion (Tier 3)",
      bg: "bg-stone-100 text-stone-800 border-stone-300",
      dot: "bg-stone-500",
    },
  };

  const c = configs[status] || configs.CREATED;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs",
        c.bg,
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", c.dot)} />
      <span>{c.label}</span>
    </span>
  );
};
