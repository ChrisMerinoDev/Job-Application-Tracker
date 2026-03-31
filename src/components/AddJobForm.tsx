"use client";

import { useState } from "react";
import { WorkType, JobFormInput } from "@/types";
import { WORK_TYPES } from "@/lib/constants";

interface AddJobFormProps {
  onAdd: (job: JobFormInput) => Promise<void>;
  onDone: () => void;
}

export default function AddJobForm({ onAdd, onDone }: AddJobFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [workType, setWorkType] = useState<WorkType>("Remote");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = company.trim() && position.trim() && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setBusy(true);
    
    try {
      await onAdd({
        company: company.trim(),
        position: position.trim(),
        work_type: workType,
        location: location.trim(),
      });
      setCompany("");
      setPosition("");
      setWorkType("Remote");
      setLocation("");
      onDone();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add job";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">New Application</h2>
      <div className="form-grid">
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company *"
          className="input"
          disabled={busy}
        />
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position *"
          className="input"
          disabled={busy}
        />
        <select
          value={workType}
          onChange={(e) => setWorkType(e.target.value as WorkType)}
          className="input"
          disabled={busy}
        >
          {WORK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (city, state…)"
          className="input"
          disabled={busy}
        />
      </div>
      {error && <div className="auth-error">{error}</div>}
      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="btn-primary"
        style={{ opacity: canSubmit ? 1 : 0.4, width: "100%" }}
      >
        {busy ? "Adding…" : "Add Application →"}
      </button>
    </div>
  );
}
