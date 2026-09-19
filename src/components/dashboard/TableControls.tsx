import React, { useRef, useEffect } from "react";
import { JobStatus, SortField, SortDirection } from "@/types/job";
import { Search, X, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "All" | JobStatus;
  onStatusFilterChange: (status: "All" | JobStatus) => void;
  statusCounts: {
    All: number;
    Pending: number;
    "In Progress": number;
    Delayed: number;
    Completed: number;
  };
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  onSortDirectionToggle: () => void;
  totalFiltered: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const TableControls: React.FC<TableControlsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  sortField,
  sortDirection,
  onSortChange,
  onSortDirectionToggle,
  totalFiltered,
  totalCount,
  onResetFilters,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filterTabs: Array<{ id: "All" | JobStatus; label: string }> = [
    { id: "All", label: "All Jobs" },
    { id: "Delayed", label: "Delayed" },
    { id: "In Progress", label: "In Progress" },
    { id: "Pending", label: "Pending" },
    { id: "Completed", label: "Completed" },
  ];

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "All";

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
      {/* Top row: Search input & Sort selector */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            id="job-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Job ID, part name, customer, or machine..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-300 rounded-md text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center border border-zinc-300 rounded-md px-2 py-1 bg-white text-xs">
            <span className="text-zinc-500 mr-1.5 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" /> Sort:
            </span>
            <select
              id="job-sort-select"
              value={sortField}
              onChange={(e) => onSortChange(e.target.value as SortField)}
              className="bg-transparent border-none text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="dueDate">Due Date</option>
              <option value="quantity">Quantity</option>
              <option value="id">Job ID</option>
              <option value="customer">Customer</option>
            </select>

            <button
              id="job-sort-direction-btn"
              onClick={onSortDirectionToggle}
              title={`Sort ${sortDirection === "asc" ? "Ascending" : "Descending"}`}
              className="p-1 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded transition-colors ml-1"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs px-2.5 py-1.5 rounded-md border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 font-medium transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Tabs & Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {filterTabs.map((tab) => {
            const count = statusCounts[tab.id];
            const isActive = statusFilter === tab.id;

            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => onStatusFilterChange(tab.id)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 shrink-0 select-none",
                  isActive
                    ? "bg-zinc-950 text-white font-medium shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium",
                    isActive ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-500"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-zinc-500 font-mono shrink-0 ml-auto">
          {totalFiltered === totalCount ? (
            <span>{totalCount} jobs</span>
          ) : (
            <span>
              Showing {totalFiltered} of {totalCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
