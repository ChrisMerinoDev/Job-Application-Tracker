"use client";

import { Profile } from "@/types";

interface HeaderProps {
  profile: Profile;
  view: "dashboard" | "add";
  onChangeView: (v: "dashboard" | "add") => void;
  onSignOut: () => void;
}

export default function Header({
  profile,
  view,
  onChangeView,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-emoji">🚀</span>
        <div>
          <div className="header-title">Job Tracker</div>
          <div className="header-subtitle">
            Hey {profile.name}!{" "}
            {profile.goal
              ? `Targeting: ${profile.goal}`
              : "Let's get hired!"}
          </div>
        </div>
      </div>
      <div className="header-nav">
        <button
          onClick={() => onChangeView("dashboard")}
          className={view === "dashboard" ? "nav-btn active" : "nav-btn"}
        >
          Dashboard
        </button>
        <button
          onClick={() => onChangeView("add")}
          className={view === "add" ? "nav-btn active" : "nav-btn"}
        >
          + Add Job
        </button>
        <button onClick={onSignOut} className="nav-btn signout">
          Sign Out
        </button>
      </div>
    </header>
  );
}
