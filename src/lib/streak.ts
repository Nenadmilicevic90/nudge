import { Checkin } from "./types";

export function calculateStreak(checkins: Checkin[]): {
  current: number;
  longest: number;
} {
  if (checkins.length === 0) return { current: 0, longest: 0 };

  const sorted = [...checkins]
    .filter((c) => c.status === "done")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  let longest = 0;
  let streak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestDate = new Date(sorted[0].date);
  latestDate.setHours(0, 0, 0, 0);

  const daysSinceLatest = Math.floor(
    (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Current streak only counts if latest check-in is today or yesterday
  const isCurrentActive = daysSinceLatest <= 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diff = Math.floor(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      streak++;
    } else {
      if (i === 1 || streak > longest) longest = Math.max(longest, streak);
      if (i === 1 && isCurrentActive) current = streak;
      streak = 1;
    }
  }

  longest = Math.max(longest, streak);
  if (isCurrentActive && current === 0) current = streak;

  return { current, longest };
}

export function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
