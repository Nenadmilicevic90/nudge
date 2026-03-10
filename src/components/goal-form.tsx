"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Goal, CATEGORIES, INTERVALS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  userId: string;
  goal?: Goal;
};

export function GoalForm({ userId, goal }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(goal?.name ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [category, setCategory] = useState(goal?.category ?? "custom");
  const [intervalType, setIntervalType] = useState<string>(
    goal?.interval_type ?? "daily"
  );
  const [reminderTime, setReminderTime] = useState(
    goal?.reminder_time?.slice(0, 5) ?? "08:00"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const data = {
      name,
      description: description || null,
      category,
      interval_type: intervalType,
      reminder_time: reminderTime,
      user_id: userId,
    };

    if (goal) {
      const { error: err } = await supabase
        .from("goals")
        .update(data)
        .eq("id", goal.id);
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.from("goals").insert(data);
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Namn *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="T.ex. Morgonpromenad"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beskrivning</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Valfri beskrivning..."
        />
      </div>

      <div className="space-y-2">
        <Label>Kategori</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                category === key
                  ? "border-[#4CAF50] bg-green-50 text-[#4CAF50]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Intervall</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(INTERVALS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setIntervalType(key)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                intervalType === key
                  ? "border-[#4CAF50] bg-green-50 text-[#4CAF50]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminder">Påminnelse</Label>
        <Input
          id="reminder"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1 bg-[#4CAF50] hover:bg-[#43A047]"
          disabled={loading}
        >
          {loading ? "Sparar..." : goal ? "Uppdatera" : "Skapa mål"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Avbryt
        </Button>
      </div>
    </form>
  );
}
