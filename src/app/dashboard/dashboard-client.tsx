"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Goal, Checkin, CATEGORIES } from "@/lib/types";
import { calculateStreak, formatDate } from "@/lib/streak";
import { WeekHeatmap } from "@/components/week-heatmap";
import { Button } from "@/components/ui/button";

type Props = {
  goals: Goal[];
  checkins: Checkin[];
  userId: string;
};

export function DashboardClient({ goals, checkins, userId }: Props) {
  const router = useRouter();
  const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null);
  const today = formatDate(new Date());

  async function handleCheckin(goalId: string, status: "done" | "skipped") {
    setLoadingGoalId(goalId);
    const supabase = createClient();

    await supabase.from("checkins").upsert(
      {
        goal_id: goalId,
        user_id: userId,
        date: today,
        status,
      },
      { onConflict: "goal_id,date" }
    );

    setLoadingGoalId(null);
    router.refresh();
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-24 text-center">
        <span className="text-5xl">🌱</span>
        <h2 className="mt-4 text-xl font-semibold">Inga mål ännu</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Skapa ditt första mål och börja bygga vanor!
        </p>
        <Link href="/goals/new">
          <Button className="mt-6 bg-[#4CAF50] hover:bg-[#43A047]">
            + Lägg till mål
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Dina mål</h1>
        <Link href="/goals/new">
          <Button size="sm" className="bg-[#4CAF50] hover:bg-[#43A047]">
            + Lägg till
          </Button>
        </Link>
      </div>

      {goals.map((goal) => {
        const goalCheckins = checkins.filter((c) => c.goal_id === goal.id);
        const { current } = calculateStreak(goalCheckins);
        const todayCheckin = goalCheckins.find((c) => c.date === today);
        const cat = CATEGORIES[goal.category] ?? CATEGORIES.custom;

        return (
          <div
            key={goal.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <Link href={`/goals/${goal.id}`} className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.emoji}</span>
                  <h3 className="font-medium">{goal.name}</h3>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  {current > 0 && (
                    <span className="font-medium text-orange-500">
                      🔥 {current} dagar
                    </span>
                  )}
                  <span>⏰ {goal.reminder_time.slice(0, 5)}</span>
                </div>
              </Link>

              {todayCheckin ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    todayCheckin.status === "done"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {todayCheckin.status === "done" ? "✅ Klar" : "⏭️ Skippad"}
                </span>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={loadingGoalId === goal.id}
                    onClick={() => handleCheckin(goal.id, "done")}
                  >
                    ✅
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs"
                    disabled={loadingGoalId === goal.id}
                    onClick={() => handleCheckin(goal.id, "skipped")}
                  >
                    ⏭️
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-3">
              <WeekHeatmap checkins={goalCheckins} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
