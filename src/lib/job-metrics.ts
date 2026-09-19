import { Job, SummaryMetrics } from "@/types/job";

export function calculateSummaryMetrics(jobs: Job[]): SummaryMetrics {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let delayedJobs = 0;
  let dueSoonJobs = 0;
  let completedJobs = 0;
  let inProgressJobs = 0;
  let pendingJobs = 0;
  let activeUnitsCount = 0;

  jobs.forEach((job) => {
    if (job.status === "Completed") {
      completedJobs++;
      return;
    }

    if (job.status === "Delayed") {
      delayedJobs++;
    } else if (job.status === "In Progress") {
      inProgressJobs++;
    } else if (job.status === "Pending") {
      pendingJobs++;
    }

    // Active units
    activeUnitsCount += (job.quantity - (job.completedQuantity || 0));

    // Calculate if due today or within 3 days (and not completed)
    const [year, month, day] = job.dueDate.split("-").map(Number);
    const dueDate = new Date(year, month - 1, day);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If due today or within 3 days (0, 1, 2, 3)
    // Also include overdue non-delayed jobs or due within 3 days
    if (diffDays >= 0 && diffDays <= 3) {
      dueSoonJobs++;
    }
  });

  return {
    totalJobs: jobs.length,
    delayedJobs,
    dueSoonJobs,
    completedJobs,
    inProgressJobs,
    pendingJobs,
    activeUnitsCount,
  };
}
