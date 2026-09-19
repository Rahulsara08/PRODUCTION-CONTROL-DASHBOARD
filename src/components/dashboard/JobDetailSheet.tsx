import React, { useEffect, useState } from "react";
import { Job, JobStatus } from "@/types/job";
import { StatusBadge } from "./StatusBadge";
import { MachineBadge } from "./MachineBadge";
import {
  formatDate,
  formatQuantity,
  getRelativeTimeStatus,
  cn,
} from "@/lib/utils";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobDetailSheetProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
  onUpdateNotes: (jobId: string, newNotes: string) => void;
}

export const JobDetailSheet: React.FC<JobDetailSheetProps> = ({
  job,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
}) => {
  const [editedNotes, setEditedNotes] = useState<string>("");
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSaveSuccess, setNotesSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (job) {
      setEditedNotes(job.notes || "");
      setNotesSaveSuccess(false);
    }
  }, [job]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const timeStatus = getRelativeTimeStatus(job.dueDate, job.status);

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onUpdateNotes(job.id, editedNotes);
    setTimeout(() => {
      setIsSavingNotes(false);
      setNotesSaveSuccess(true);
      setTimeout(() => setNotesSaveSuccess(false), 1500);
    }, 200);
  };

  const statusList: JobStatus[] = ["Pending", "In Progress", "Delayed", "Completed"];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      id="job-detail-sheet"
    >
      <div
        className="w-full max-w-lg h-full bg-white border-l border-zinc-200 p-6 shadow-xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xl font-bold text-zinc-950">
                {job.id}
              </span>
              <StatusBadge status={job.status} size="md" />
            </div>

            <button
              onClick={onClose}
              id="job-detail-close-btn"
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-label="Close sheet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Info */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-zinc-950">
              {job.product}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-600">
              <span className="font-mono font-medium text-zinc-700">Part: {job.partNumber}</span>
              <span>·</span>
              <span>Customer: <strong className="font-medium text-zinc-900">{job.customer}</strong></span>
            </div>
          </div>

          {/* FR7: Update Status */}
          <div className="mt-6 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <label className="text-xs font-semibold text-zinc-800 block mb-2">
              Update Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {statusList.map((st) => {
                const isCurrent = job.status === st;
                return (
                  <button
                    key={st}
                    id={`status-select-${st.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => onUpdateStatus(job.id, st)}
                    className={cn(
                      "py-2 px-2.5 rounded-md border text-xs font-medium transition-all text-center select-none cursor-pointer",
                      isCurrent
                        ? "bg-zinc-950 border-zinc-950 text-white shadow-xs"
                        : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400"
                    )}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details 2-column Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Quantity */}
            <div className="p-3 rounded-lg border border-zinc-200 bg-white">
              <div className="text-xs text-zinc-500 font-medium">
                Order Quantity
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-zinc-950">
                  {formatQuantity(job.quantity)}
                </span>
                <span className="text-xs text-zinc-500">pcs</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500 font-mono">
                {job.completedQuantity} pcs produced
              </div>
            </div>

            {/* Due Date */}
            <div className="p-3 rounded-lg border border-zinc-200 bg-white">
              <div className="text-xs text-zinc-500 font-medium">
                Target Due Date
              </div>
              <div className="mt-1 text-sm font-semibold font-mono text-zinc-950">
                {formatDate(job.dueDate)}
              </div>
              <div className="mt-1">
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded border font-medium inline-block",
                    timeStatus.badgeClass
                  )}
                >
                  {timeStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Machine Info */}
          <div className="mt-4 p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-500 font-medium">
                Assigned Machine
              </div>
              <div className="mt-1">
                <MachineBadge
                  machine={job.machine}
                  machineType={job.machineType}
                  showType={true}
                />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-500 font-medium">Machine Status</span>
              <div className="text-xs font-medium text-emerald-700 mt-0.5">Available</div>
            </div>
          </div>

          {/* Notes & Floor Log */}
          <div className="mt-4 p-3 rounded-lg border border-zinc-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-800">
                Floor Notes & Issues
              </span>
              {notesSaveSuccess && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <textarea
              id="job-notes-editor"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={3}
              placeholder="Add shop floor notes or issue comments..."
              className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded-md text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
            />

            <div className="mt-2 flex justify-end">
              <Button
                id="job-notes-save-btn"
                size="sm"
                onClick={handleSaveNotes}
                disabled={isSavingNotes || editedNotes === job.notes}
                className="text-xs font-medium"
              >
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>{job.lastUpdated}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs text-zinc-700 font-medium"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
