"use client";

import { useState } from "react";

interface ProfileSetupProps {
  onSave: (name: string, goal: string) => Promise<void>;
}

export default function ProfileSetup({ onSave }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setBusy(true);
    await onSave(name, goal);
    setBusy(false);
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-card">
        <div className="account-emoji">👋</div>
        <h1 className="account-title">Welcome!</h1>
        <p className="account-subtitle">
          Set up your profile so we can personalize your tracker.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="input"
        />
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Target role (e.g. Frontend Developer)"
          className="input"
          style={{ marginTop: 12 }}
        />
        <button
          disabled={!name.trim() || busy}
          onClick={handleSave}
          className="btn-primary"
          style={{
            opacity: name.trim() ? 1 : 0.4,
            width: "100%",
            marginTop: 16,
          }}
        >
          {busy ? "Saving…" : "Let's Go →"}
        </button>
      </div>
    </div>
  );
}
