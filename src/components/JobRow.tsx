"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/types";
import { STATUS_CONFIG, WORK_TYPE_STYLES } from "@/lib/constants";

interface JobRowProps {
  job: Job;
  onStatusChange: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
}

export default function JobRow({ job, onStatusChange, onDelete }: JobRowProps) {
  const [open, setOpen] = useState(false);
  const s = STATUS_CONFIG[job.status];
  const wt = WORK_TYPE_STYLES[job.work_type];

  return (
    <div className="job-row">
      <button 
        className="job-row-main" 
        onClick={() => setOpen(!open)}
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
                onClick={() => onStatusChange(job.id, key)}
                className="status-btn"
                style={{
                  borderColor:
                    job.status === key ? cfg.color : "transparent",
                  background: cfg.bg,
                  color: cfg.color,
                }}
              >
                {cfg.label}
              </button>
            )
          )}
          <div className="spacer" />
          <button className="delete-btn" onClick={() => onDelete(job.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
