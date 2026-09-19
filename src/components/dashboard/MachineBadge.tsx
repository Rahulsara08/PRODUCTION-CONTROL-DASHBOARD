import React from "react";
import { cn } from "@/lib/utils";

interface MachineBadgeProps {
  machine: string;
  machineType?: string;
  className?: string;
  showType?: boolean;
}

export const MachineBadge: React.FC<MachineBadgeProps> = ({
  machine,
  machineType,
  className,
  showType = false,
}) => {
  return (
    <div className={cn("inline-flex flex-col items-start gap-0.5", className)}>
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono text-xs font-medium">
        {machine}
      </span>
      {showType && machineType && (
        <span className="text-[11px] text-zinc-500 font-sans truncate max-w-[150px]">
          {machineType}
        </span>
      )}
    </div>
  );
};
