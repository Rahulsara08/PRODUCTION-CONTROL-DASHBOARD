import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <Button
            id="reset-demo-data-btn"
            variant="outline"
            size="sm"
            onClick={onResetData}
            disabled={isLoading}
            className="text-xs font-medium text-zinc-800"
            title="Reset to default sample jobs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading ? "animate-spin text-zinc-600" : "text-zinc-500")} />
            <span>Reset Data</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
