"use client";

interface MotivationProps {
  total: number;
  accepted: number;
}

export default function Motivation({ total, accepted }: MotivationProps) {
  if (total === 0) return null;

  const message =
    accepted > 0
      ? `🎉 ${accepted} acceptance${accepted > 1 ? "s" : ""}! You're making it happen!`
      : total < 10
        ? `${total} down — keep the momentum going!`
        : total < 50
          ? `${total} applications in! Consistency is your superpower.`
          : `${total} applications — that's serious dedication. Your job is coming.`;

  return <div className="motivation">{message}</div>;
}
