import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { GoalForm } from "@/components/goal-form";
import { BottomNav } from "@/components/bottom-nav";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGoalPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.id) redirect("/auth/login");

  const goals = await sql`
    SELECT * FROM goals WHERE id = ${id} AND user_id = ${session.id}
  `;
  const goal = goals[0];
  if (!goal) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-md px-4 pt-6 pb-24">
        <h1 className="mb-6 text-xl font-bold">Redigera mål</h1>
        <GoalForm goal={goal as any} />
      </div>
      <BottomNav />
    </div>
  );
}
