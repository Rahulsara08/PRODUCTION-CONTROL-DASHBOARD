import React from "react";
import { JobStatus } from "@/types/job";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: JobStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  className,
}) => {
  const config = {
    Pending: {
      label: "Pending",
      style: "bg-zinc-100 text-zinc-700 border-zinc-300",
      dot: "bg-zinc-400",
    },
    "In Progress": {
      label: "In Progress",
      style: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-600",
    },
    Delayed: {
      label: "Delayed",
      style: "bg-red-50 text-red-700 border-red-200 font-semibold",
      dot: "bg-red-600",
    },
    Completed: {
      label: "Completed",
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-600",
    },
  }[status];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-medium select-none tracking-tight",
        config.style,
        sizeClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      <span>{config.label}</span>
    </span>
  );
};
