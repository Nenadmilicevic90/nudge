"use server";

import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function checkinAction(goalId: string, date: string, status: "done" | "skipped") {
  const userId = await requireAuth();

  await sql`
    INSERT INTO checkins (goal_id, user_id, date, status)
    VALUES (${goalId}, ${userId}, ${date}, ${status})
    ON CONFLICT (goal_id, date) DO UPDATE SET status = ${status}
  `;

  revalidatePath("/dashboard");
}

export async function createGoalAction(data: {
  name: string;
  description: string | null;
  category: string;
  interval_type: string;
  reminder_time: string;
}) {
  const userId = await requireAuth();

  await sql`
    INSERT INTO goals (name, description, category, interval_type, reminder_time, user_id)
    VALUES (${data.name}, ${data.description}, ${data.category}, ${data.interval_type}, ${data.reminder_time}, ${userId})
  `;

  revalidatePath("/dashboard");
}

export async function updateGoalAction(goalId: string, data: {
  name: string;
  description: string | null;
  category: string;
  interval_type: string;
  reminder_time: string;
}) {
  const userId = await requireAuth();

  await sql`
    UPDATE goals SET
      name = ${data.name},
      description = ${data.description},
      category = ${data.category},
      interval_type = ${data.interval_type},
      reminder_time = ${data.reminder_time}
    WHERE id = ${goalId} AND user_id = ${userId}
  `;

  revalidatePath("/dashboard");
}

export async function deleteGoalAction(goalId: string) {
  const userId = await requireAuth();

  await sql`DELETE FROM goals WHERE id = ${goalId} AND user_id = ${userId}`;

  revalidatePath("/dashboard");
}

export async function completeOnboardingAction(goalName?: string, category?: string) {
  const userId = await requireAuth();

  if (goalName?.trim()) {
    await sql`
      INSERT INTO goals (name, category, user_id, interval_type, reminder_time)
      VALUES (${goalName.trim()}, ${category ?? "custom"}, ${userId}, 'daily', '08:00')
    `;
  }

  await sql`UPDATE users SET onboarded = TRUE WHERE id = ${userId}`;

  revalidatePath("/dashboard");
}
