import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Tracker — Land Your First Tech Job in 2026",
  description:
    "Track every job application, monitor statuses, and stay motivated on your journey to landing your first tech role.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body>{children}</body>
    </html>
  );
}
