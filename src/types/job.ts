export type JobStatus = 'Pending' | 'In Progress' | 'Delayed' | 'Completed';

export type JobPriority = 'Critical' | 'High' | 'Medium' | 'Standard';

export interface Job {
  id: string;              // e.g. "JOB-1042"
  product: string;         // e.g. "Turbine Impeller v4"
  partNumber: string;      // e.g. "PRT-8821-TI"
  customer: string;        // e.g. "Lockheed Propulsion"
  quantity: number;        // e.g. 150
  completedQuantity: number; // e.g. 90
  dueDate: string;         // YYYY-MM-DD
  status: JobStatus;
  priority: JobPriority;
  machine: string;         // e.g. "CNC-MILL-01"
  machineType: string;     // e.g. "5-Axis CNC Mill"
  notes: string;           // Issues, floor comments, tooling warnings
  lastUpdated: string;     // ISO timestamp or readable
}

export type SortField = 'dueDate' | 'quantity' | 'id' | 'customer';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  status: 'All' | JobStatus;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface SummaryMetrics {
  totalJobs: number;
  delayedJobs: number;
  dueSoonJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  pendingJobs: number;
  activeUnitsCount: number;
}
