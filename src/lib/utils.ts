import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuantity(qty: number): string {
  return new Intl.NumberFormat("en-US").format(qty);
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRelativeTimeStatus(dueDateStr: string, status: string): {
  text: string;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean;
  badgeClass: string;
} {
  if (status === "Completed") {
    return {
      text: "Done",
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  // Parse YYYY-MM-DD
  const [year, month, day] = dueDateStr.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: overdueDays === 1 ? "1d late" : `${overdueDays}d late`,
      isOverdue: true,
      isDueToday: false,
      isDueSoon: false,
      badgeClass: "bg-red-50 text-red-700 border-red-200 font-semibold",
    };
  }

  if (diffDays === 0) {
    return {
      text: "Due today",
      isOverdue: false,
      isDueToday: true,
      isDueSoon: true,
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    };
  }

  if (diffDays <= 3) {
    return {
      text: diffDays === 1 ? "Due tomorrow" : `Due in ${diffDays}d`,
      isOverdue: false,
      isDueToday: false,
      isDueSoon: true,
      badgeClass: "bg-zinc-100 text-zinc-800 border-zinc-200",
    };
  }

  return {
    text: `Due in ${diffDays}d`,
    isOverdue: false,
    isDueToday: false,
    isDueSoon: false,
    badgeClass: "bg-zinc-50 text-zinc-600 border-zinc-200",
  };
}
