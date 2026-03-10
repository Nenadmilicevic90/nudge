"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Goal, Checkin, CATEGORIES } from "@/lib/types";
import { calculateStreak } from "@/lib/streak";
import { WeekHeatmap } from "@/components/week-heatmap";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  goal: Goal;
  checkins: Checkin[];
};

export function GoalDetailClient({ goal, checkins }: Props) {
  const router = useRouter();
  const cat = CATEGORIES[goal.category] ?? CATEGORIES.custom;
  const { current, longest } = calculateStreak(checkins);

  async function handleDelete() {
    if (!confirm("Är du säker på att du vill ta bort detta mål?")) return;

    const supabase = createClient();
    await supabase.from("goals").delete().eq("id", goal.id);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-md px-4 pt-6 pb-24">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tillbaka
        </button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{cat.emoji}</span>
          <div>
            <h1 className="text-xl font-bold">{goal.name}</h1>
            {goal.description && (
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-500">
              🔥 {current}
            </p>
            <p className="text-xs text-muted-foreground">Nuvarande streak</p>
          </div>
          <div className="rounded-lg border bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#4CAF50]">
              🏆 {longest}
            </p>
            <p className="text-xs text-muted-foreground">Längsta streak</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium">Denna vecka</h3>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <WeekHeatmap checkins={checkins} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href={`/goals/${goal.id}/edit`} className="flex-1">
            <Button variant="outline" className="w-full">
              Redigera
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Ta bort
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
