import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { GoalDetailClient } from "./goal-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GoalDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.id) redirect("/auth/login");

  const userId = session.id;

  const goals = await sql`
    SELECT * FROM goals WHERE id = ${id} AND user_id = ${userId}
  `;
  const goal = goals[0];
  if (!goal) notFound();

  const checkins = await sql`
    SELECT * FROM checkins WHERE goal_id = ${id} ORDER BY date DESC
  `;

  return <GoalDetailClient goal={goal as any} checkins={checkins as any[]} />;
}
