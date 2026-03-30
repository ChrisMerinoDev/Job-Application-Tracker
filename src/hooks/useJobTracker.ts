"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Job, JobInsert, JobStatus, Profile } from "@/types";

export function useJobTracker(userId: string | undefined) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch profile + jobs on mount
  useEffect(() => {
    if (!userId) return;

    async function fetchAll() {
      setLoading(true);

      // Fetch profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(prof);

      // Fetch jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setJobs(jobsData ?? []);
      setLoading(false);
    }

    fetchAll();
  }, [userId, supabase]);

  const saveProfile = useCallback(
    async (name: string, goal: string) => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: userId, name: name.trim(), goal: goal.trim() })
        .select()
        .single();

      if (!error && data) setProfile(data);
    },
    [userId, supabase]
  );

  const addJob = useCallback(
    async (job: JobInsert) => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("jobs")
        .insert({ ...job, user_id: userId, status: "pending" })
        .select()
        .single();

      if (!error && data) setJobs((prev) => [data, ...prev]);
    },
    [userId, supabase]
  );

  const changeStatus = useCallback(
    async (id: string, status: JobStatus) => {
      const { error } = await supabase
        .from("jobs")
        .update({ status })
        .eq("id", id);

      if (!error) {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status } : j))
        );
      }
    },
    [supabase]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (!error) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
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
    counts,
    saveProfile,
    addJob,
    changeStatus,
    deleteJob,
  };
}
