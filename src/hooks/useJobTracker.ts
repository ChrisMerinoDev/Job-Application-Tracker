"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Job, JobFormInput, JobStatus, Profile } from "@/types";

export function useJobTracker(userId: string | undefined) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch profile + jobs on mount
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile
        const { data: prof, error: profError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profError && profError.code !== "PGRST116") {
          throw new Error(profError.message);
        }

        setProfile(prof || null);

        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (jobsError) throw new Error(jobsError.message);
        setJobs(jobsData ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data";
        setError(message);
        console.error("useJobTracker error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [userId, supabase]);

  const saveProfile = useCallback(
    async (name: string, goal: string) => {
      if (!userId) throw new Error("User not authenticated");
      try {
        setError(null);
        const { data, error: err } = await supabase
          .from("profiles")
          .upsert({ id: userId, name: name.trim(), goal: goal.trim() })
          .select()
          .single();

        if (err) throw new Error(err.message);
        if (!data) throw new Error("Failed to save profile");
        setProfile(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save profile";
        setError(message);
        throw err;
      }
    },
    [userId, supabase]
  );

  const addJob = useCallback(
    async (job: JobFormInput) => {
      if (!userId) throw new Error("User not authenticated");
      try {
        setError(null);
        const { data, error: err } = await supabase
          .from("jobs")
          .insert({ ...job, user_id: userId, status: "pending" })
          .select()
          .single();

        if (err) throw new Error(err.message);
        if (!data) throw new Error("Failed to add job");
        setJobs((prev) => [data, ...prev]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add job";
        setError(message);
        throw err;
      }
    },
    [userId, supabase]
  );

  const changeStatus = useCallback(
    async (id: string, status: JobStatus) => {
      try {
        setError(null);
        const { error: err } = await supabase
          .from("jobs")
          .update({ status })
          .eq("id", id);

        if (err) throw new Error(err.message);
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status } : j))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update status";
        setError(message);
        throw err;
      }
    },
    [supabase]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const { error: err } = await supabase.from("jobs").delete().eq("id", id);
        if (err) throw new Error(err.message);
        setJobs((prev) => prev.filter((j) => j.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete job";
        setError(message);
        throw err;
      }
    },
    [supabase]
  );

  const counts = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    accepted: jobs.filter((j) => j.status === "accepted").length,
  };

  return {
    jobs,
    profile,
    loading,
    error,
    counts,
    saveProfile,
    addJob,
    changeStatus,
    deleteJob,
  };
}
