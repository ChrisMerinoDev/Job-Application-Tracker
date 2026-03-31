"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/types";
import { STATUS_CONFIG, WORK_TYPE_STYLES } from "@/lib/constants";

interface JobRowProps {
  job: Job;
  onStatusChange: (id: string, status: JobStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function JobRow({ job, onStatusChange, onDelete }: JobRowProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const s = STATUS_CONFIG[job.status];
  const wt = WORK_TYPE_STYLES[job.work_type];

  const handleStatusChange = async (newStatus: JobStatus) => {
    setError("");
    setBusy(true);
    try {
      await onStatusChange(job.id, newStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    setError("");
    setBusy(true);
    try {
      await onDelete(job.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="job-row">
      <button 
        className="job-row-main" 
        onClick={() => setOpen(!open)}
        disabled={busy}
      >
        <div className="job-info">
          <div className="job-company">{job.company}</div>
          <div className="job-position">{job.position}</div>
          <div className="job-date">
            {new Date(job.created_at).toLocaleDateString()}
          </div>
        </div>

        <span
          className="badge work-type-badge"
          style={{ background: wt.bg, color: wt.color }}
        >
          {job.work_type}
        </span>

        <span className="job-location">{job.location || "—"}</span>

        <span
          className="badge status-badge"
          style={{ background: s.bg, color: s.color }}
        >
          {s.label}
        </span>

        <span
          className="chevron"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="job-row-panel">
          <span className="panel-label">Status:</span>
          {(Object.entries(STATUS_CONFIG) as [JobStatus, typeof s][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className="status-btn"
                style={{
                  borderColor:
                    job.status === key ? cfg.color : "transparent",
                  background: cfg.bg,
                  color: cfg.color,
                }}
                disabled={busy}
              >
                {cfg.label}
              </button>
            )
          )}
          <div className="spacer" />
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            disabled={busy}
          >
            Delete
          </button>
          {error && <div className="auth-error" style={{ marginLeft: "auto" }}>{error}</div>}
        </div>
      )}
    </div>
  );
}
