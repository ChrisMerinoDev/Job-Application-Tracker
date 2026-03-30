"use client";

import { useState } from "react";
import { WorkType } from "@/types";
import { WORK_TYPES } from "@/lib/constants";

interface AddJobFormProps {
  onAdd: (job: {
    company: string;
    position: string;
    work_type: WorkType;
    location: string;
  }) => void;
  onDone: () => void;
}

export default function AddJobForm({ onAdd, onDone }: AddJobFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [workType, setWorkType] = useState<WorkType>("Remote");
  const [location, setLocation] = useState("");

  const canSubmit = company.trim() && position.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
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
        />
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position *"
          className="input"
        />
        <select
          value={workType}
          onChange={(e) => setWorkType(e.target.value as WorkType)}
          className="input"
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
        />
      </div>
      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="btn-primary"
        style={{ opacity: canSubmit ? 1 : 0.4 }}
      >
        Add Application →
      </button>
    </div>
  );
}
