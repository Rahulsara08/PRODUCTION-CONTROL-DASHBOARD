"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Job, JobStatus, SortField, SortDirection } from "@/types/job";
import { getInitialMockJobs } from "@/data/mockJobs";
import { calculateSummaryMetrics } from "@/lib/job-metrics";
import { Header } from "@/components/dashboard/Header";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { TableControls } from "@/components/dashboard/TableControls";
import { JobsTable } from "@/components/dashboard/JobsTable";
import { JobDetailSheet } from "@/components/dashboard/JobDetailSheet";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  // Primary Jobs state
  const [jobs, setJobs] = useState<Job[]>(() => getInitialMockJobs());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | JobStatus>("All");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setJobs(data.data);
        }
      }
    } catch {
      // Fallback to existing memory state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // FR1: Summary metrics recalculate automatically on status changes
  const summaryMetrics = useMemo(() => {
    return calculateSummaryMetrics(jobs);
  }, [jobs]);

  // Counts for each status tab
  const statusCounts = useMemo(() => {
    const counts = {
      All: jobs.length,
      Pending: 0,
      "In Progress": 0,
      Delayed: 0,
      Completed: 0,
    };
    jobs.forEach((job) => {
      counts[job.status] = (counts[job.status] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  // FR3, FR4, FR5: Filter, Search, Sort
  const filteredAndSortedJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return jobs
      .filter((job) => {
        // FR4 Status Filter
        if (statusFilter !== "All" && job.status !== statusFilter) {
          return false;
        }

        // FR3 Search (case-insensitive across product, customer, job ID, part #, machine)
        if (query) {
          const matchId = job.id.toLowerCase().includes(query);
          const matchProduct = job.product.toLowerCase().includes(query);
          const matchCustomer = job.customer.toLowerCase().includes(query);
          const matchPart = job.partNumber.toLowerCase().includes(query);
          const matchMachine = job.machine.toLowerCase().includes(query);
          if (!matchId && !matchProduct && !matchCustomer && !matchPart && !matchMachine) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // FR5 Sort
        let compare = 0;
        if (sortField === "dueDate") {
          compare = a.dueDate.localeCompare(b.dueDate);
        } else if (sortField === "quantity") {
          compare = a.quantity - b.quantity;
        } else if (sortField === "id") {
          compare = a.id.localeCompare(b.id);
        } else if (sortField === "customer") {
          compare = a.customer.localeCompare(b.customer);
        }

        return sortDirection === "asc" ? compare : -compare;
      });
  }, [jobs, searchQuery, statusFilter, sortField, sortDirection]);

  // FR6: Selected Job
  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  // FR7: Status update
  const handleUpdateStatus = async (jobId: string, newStatus: JobStatus) => {
    // Instant optimistic update
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: newStatus,
            completedQuantity:
              newStatus === "Completed" ? j.quantity : j.completedQuantity,
            lastUpdated: "Just now",
          };
        }
        return j;
      })
    );

    // Sync in background
    try {
      await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, status: newStatus }),
      });
    } catch {
      // Local state is preserved
    }
  };

  // Notes update
  const handleUpdateNotes = async (jobId: string, newNotes: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, notes: newNotes, lastUpdated: "Just now" } : j
      )
    );

    try {
      await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, notes: newNotes }),
      });
    } catch {
      // Local state is preserved
    }
  };

  // Reset to demo data
  const handleResetData = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const fresh = getInitialMockJobs();
      setJobs(fresh);
      setSearchQuery("");
      setStatusFilter("All");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSortDirectionToggle = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        onResetData={handleResetData}
        isLoading={isLoading}
        totalJobs={jobs.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* FR1 Summary Metric Cards */}
        <section aria-label="Summary Metrics">
          <MetricCards
            metrics={summaryMetrics}
            activeFilter={statusFilter}
            onSelectFilter={(filter) => setStatusFilter(filter)}
          />
        </section>

        {/* FR3, FR4, FR5 Search, Filter, and Sort Controls */}
        <section aria-label="Search and Controls">
          <TableControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusCounts={statusCounts}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            onSortDirectionToggle={handleSortDirectionToggle}
            totalFiltered={filteredAndSortedJobs.length}
            totalCount={jobs.length}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* FR2 & FR8: Jobs Table */}
        <section aria-label="Jobs List" className="relative">
          {isLoading ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-10 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mb-2" />
              <p className="text-xs text-zinc-500">Loading jobs...</p>
            </div>
          ) : (
            <JobsTable
              jobs={filteredAndSortedJobs}
              onSelectJob={(job) => setSelectedJobId(job.id)}
              selectedJobId={selectedJobId}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              onResetFilters={handleResetFilters}
            />
          )}
        </section>
      </main>

      {/* FR6 & FR7: Job Detail Sheet */}
      <JobDetailSheet
        job={selectedJob}
        isOpen={Boolean(selectedJobId)}
        onClose={() => setSelectedJobId(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateNotes={handleUpdateNotes}
      />
    </div>
  );
}
