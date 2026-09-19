import React from "react";
import { SummaryMetrics, JobStatus } from "@/types/job";
import { cn } from "@/lib/utils";

interface MetricCardsProps {
  metrics: SummaryMetrics;
  activeFilter: "All" | JobStatus;
  onSelectFilter: (filter: "All" | JobStatus) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: "total",
      filterTarget: "All" as const,
      label: "Total Jobs",
      value: metrics.totalJobs,
      subtext: `${metrics.inProgressJobs} active · ${metrics.pendingJobs} pending`,
      highlightTag: null,
    },
    {
      id: "delayed",
      filterTarget: "Delayed" as const,
      label: "Delayed",
      value: metrics.delayedJobs,
      subtext: metrics.delayedJobs > 0 ? "Require floor attention" : "All running on schedule",
      highlightTag:
        metrics.delayedJobs > 0 ? (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            Action needed
          </span>
        ) : null,
    },
    {
      id: "dueSoon",
      filterTarget: "In Progress" as const,
      label: "Due Today / Soon",
      value: metrics.dueSoonJobs,
      subtext: "Next 3-day delivery window",
      highlightTag: null,
    },
    {
      id: "completed",
      filterTarget: "Completed" as const,
      label: "Completed",
      value: metrics.completedJobs,
      subtext: `${metrics.totalJobs > 0 ? Math.round((metrics.completedJobs / metrics.totalJobs) * 100) : 0}% floor completion rate`,
      highlightTag: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const isSelected =
          card.filterTarget === activeFilter ||
          (card.id === "total" && activeFilter === "All");

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.filterTarget)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectFilter(card.filterTarget);
              }
            }}
            className={cn(
              "bg-white border rounded-lg p-4 sm:p-5 transition-all text-left cursor-pointer select-none",
              isSelected
                ? "border-zinc-950 ring-1 ring-zinc-950 shadow-sm"
                : "border-zinc-200 hover:border-zinc-300 hover:shadow-xs"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {card.label}
              </span>
              {card.highlightTag}
            </div>

            <div className="mt-2.5">
              <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 font-mono">
                {card.value}
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-500 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
