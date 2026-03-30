import { JobStatus, WorkType } from "@/types";

export const WORK_TYPES: WorkType[] = ["Remote", "On-site", "Hybrid"];

export const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.10)",
  },
  accepted: {
    label: "Accepted",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
  },
};

export const WORK_TYPE_STYLES: Record<
  WorkType,
  { bg: string; color: string }
> = {
  Remote: { bg: "rgba(99,102,241,.12)", color: "#6366F1" },
  "On-site": { bg: "rgba(234,179,8,.10)", color: "#CA8A04" },
  Hybrid: { bg: "rgba(168,85,247,.10)", color: "#A855F7" },
};
