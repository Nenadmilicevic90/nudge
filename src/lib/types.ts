export type User = {
  id: string;
  name: string | null;
  email: string;
  timezone: string;
  onboarded: boolean;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  interval_type: "daily" | "every_other_day" | "weekly";
  reminder_time: string;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type Checkin = {
  id: string;
  goal_id: string;
  user_id: string;
  date: string;
  status: "done" | "skipped";
  created_at: string;
};

export const CATEGORIES: Record<string, { label: string; emoji: string }> = {
  health: { label: "Hälsa", emoji: "🏃" },
  mental: { label: "Mental", emoji: "🧠" },
  productivity: { label: "Produktivitet", emoji: "⚡" },
  relationships: { label: "Relationer", emoji: "❤️" },
  custom: { label: "Övrigt", emoji: "🎯" },
};

export const INTERVALS: Record<string, string> = {
  daily: "Dagligen",
  every_other_day: "Varannan dag",
  weekly: "Veckovis",
};
