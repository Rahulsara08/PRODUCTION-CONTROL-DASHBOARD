import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onResetData: () => void;
  isLoading: boolean;
  totalJobs: number;
}

export const Header: React.FC<HeaderProps> = ({
  onResetData,
  isLoading,
  totalJobs,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand / App Title */}
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-zinc-950 tracking-tight">
            Production Control
          </h1>
          <p className="text-xs text-zinc-500">
            {totalJobs} jobs on floor {timeStr ? `· ${timeStr}` : ""}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            id="reset-demo-data-btn"
            onClick={onResetData}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-medium transition-colors shadow-sm cursor-pointer",
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            )}
            title="Reset to default sample jobs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading ? "animate-spin text-zinc-600" : "text-zinc-500")} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
