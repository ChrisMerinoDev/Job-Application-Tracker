"use client";

interface StatCardProps {
  label: string;
  value: number;
  accent: string;
}

export default function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="stat-card" style={{ borderLeftColor: accent }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
