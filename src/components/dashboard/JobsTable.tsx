import React from "react";
import { Job, SortField, SortDirection } from "@/types/job";
import { StatusBadge } from "./StatusBadge";
import { MachineBadge } from "./MachineBadge";
import {
  formatDate,
  formatQuantity,
  getRelativeTimeStatus,
  cn,
} from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

interface JobsTableProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  selectedJobId?: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  onResetFilters: () => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  onSelectJob,
  selectedJobId,
  sortField,
  sortDirection,
  onSortChange,
  onResetFilters,
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-zinc-900" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-zinc-900" />
    );
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center">
        <h3 className="text-sm font-semibold text-zinc-900">No jobs match your filter</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          Try clearing your search term or selecting another status tab.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-3.5 text-xs px-3.5 py-1.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-md transition-colors"
        >
          Show All Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-medium tracking-tight">
              <th
                scope="col"
                className="py-3 px-4 w-[110px] cursor-pointer select-none group hover:text-zinc-950"
                onClick={() => onSortChange("id")}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <span>Job ID</span>
                  {renderSortIcon("id")}
                </div>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[200px] font-medium">
                Product / Part
              </th>

              <th
                scope="col"
                className="py-3 px-4 min-w-[160px] cursor-pointer select-none group hover:text-zinc-950"
                onClick={() => onSortChange("customer")}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <span>Customer</span>
                  {renderSortIcon("customer")}
                </div>
              </th>

              <th
                scope="col"
                className="py-3 px-4 min-w-[120px] cursor-pointer select-none group hover:text-zinc-950"
                onClick={() => onSortChange("quantity")}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <span>Quantity</span>
                  {renderSortIcon("quantity")}
                </div>
              </th>

              <th
                scope="col"
                className="py-3 px-4 min-w-[140px] cursor-pointer select-none group hover:text-zinc-950"
                onClick={() => onSortChange("dueDate")}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <span>Due Date</span>
                  {renderSortIcon("dueDate")}
                </div>
              </th>

              <th scope="col" className="py-3 px-4 min-w-[120px] font-medium">
                Status
              </th>

              <th scope="col" className="py-3 px-4 min-w-[160px] font-medium">
                Assigned Machine
              </th>

              <th scope="col" className="py-3 px-3 w-8 text-right">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/80">
            {jobs.map((job) => {
              const timeStatus = getRelativeTimeStatus(job.dueDate, job.status);
              const isSelected = selectedJobId === job.id;

              return (
                <tr
                  key={job.id}
                  id={`job-row-${job.id.toLowerCase()}`}
                  onClick={() => onSelectJob(job)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectJob(job);
                    }
                  }}
                  className={cn(
                    "transition-colors duration-100 cursor-pointer group select-none",
                    isSelected
                      ? "bg-zinc-100"
                      : "hover:bg-zinc-50"
                  )}
                >
                  {/* Job ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-zinc-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="group-hover:underline underline-offset-2">
                        {job.id}
                      </span>
                      {job.notes && (
                        <span title={job.notes} className="text-zinc-400 group-hover:text-zinc-600">
                          <MessageSquare className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Product */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900 group-hover:text-black">
                        {job.product}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {job.partNumber}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 text-zinc-700 whitespace-nowrap">
                    {job.customer}
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-mono text-zinc-900 font-medium">
                        {formatQuantity(job.quantity)} pcs
                      </span>
                      {job.status === "In Progress" && job.completedQuantity > 0 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {job.completedQuantity} complete
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-mono text-zinc-800">
                        {formatDate(job.dueDate)}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.2 rounded border font-medium",
                          timeStatus.badgeClass
                        )}
                      >
                        {timeStatus.text}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={job.status} size="sm" />
                  </td>

                  {/* Machine */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <MachineBadge
                      machine={job.machine}
                      machineType={job.machineType}
                      showType={true}
                    />
                  </td>

                  {/* Chevron */}
                  <td className="py-3.5 px-3 text-right">
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
