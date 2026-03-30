"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJobTracker } from "@/hooks/useJobTracker";
import { JobStatus, WorkType } from "@/types";
import { STATUS_CONFIG, WORK_TYPES } from "@/lib/constants";

import AuthPage from "@/components/AuthPage";
import ProfileSetup from "@/components/ProfileSetup";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import AddJobForm from "@/components/AddJobForm";
import JobRow from "@/components/JobRow";
import Motivation from "@/components/Motivation";

export default function Home() {
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const {
    jobs,
    profile,
    loading: dataLoading,
    counts,
    saveProfile,
    addJob,
    changeStatus,
    deleteJob,
  } = useJobTracker(user?.id);

  const [view, setView] = useState<"dashboard" | "add">("dashboard");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "all">("all");
  const [filterType, setFilterType] = useState<WorkType | "all">("all");
  const [search, setSearch] = useState("");

  // Loading
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading…</div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <AuthPage
        onSignIn={signIn}
        onSignUp={signUp}
        onGoogle={signInWithGoogle}
      />
    );
  }

  // Still loading data
  if (dataLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading your tracker…</div>
      </div>
    );
  }

  // Need profile setup
  if (!profile) {
    return <ProfileSetup onSave={saveProfile} />;
  }

  // Filter jobs
  const filtered = jobs.filter((j) => {
    if (filterStatus !== "all" && j.status !== filterStatus) return false;
    if (filterType !== "all" && j.work_type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !j.company.toLowerCase().includes(q) &&
        !j.position.toLowerCase().includes(q) &&
        !j.location.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <>
      <Header
        profile={profile}
        view={view}
        onChangeView={setView}
        onSignOut={signOut}
      />

      <div className="main-container">
        {/* Stats */}
        <div className="stats-row">
          <StatCard label="Total Applied" value={counts.total} accent="#6366F1" />
          <StatCard label="Pending" value={counts.pending} accent="#F59E0B" />
          <StatCard label="Accepted" value={counts.accepted} accent="#10B981" />
          <StatCard label="Rejected" value={counts.rejected} accent="#EF4444" />
        </div>

        {/* Add form */}
        {view === "add" && (
          <AddJobForm onAdd={addJob} onDone={() => setView("dashboard")} />
        )}

        {/* Dashboard */}
        {view === "dashboard" && (
          <>
            <div className="filter-bar">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, role, location…"
                className="input"
              />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as JobStatus | "all")
                }
                className="input"
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as WorkType | "all")
                }
                className="input"
              >
                <option value="all">All Types</option>
                {WORK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  {jobs.length === 0 ? "📋" : "🔍"}
                </div>
                <div className="empty-state-text">
                  {jobs.length === 0
                    ? 'No applications yet. Click "+ Add Job" to start!'
                    : "No results match your filters."}
                </div>
              </div>
            ) : (
              filtered.map((j) => (
                <JobRow
                  key={j.id}
                  job={j}
                  onStatusChange={changeStatus}
                  onDelete={deleteJob}
                />
              ))
            )}
          </>
        )}

        <Motivation total={counts.total} accepted={counts.accepted} />
      </div>
    </>
  );
}
