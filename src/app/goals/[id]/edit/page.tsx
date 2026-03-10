import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { GoalForm } from "@/components/goal-form";
import { BottomNav } from "@/components/bottom-nav";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGoalPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goal) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-md px-4 pt-6 pb-24">
        <h1 className="mb-6 text-xl font-bold">Redigera mål</h1>
        <GoalForm userId={user.id} goal={goal} />
      </div>
      <BottomNav />
    </div>
  );
}
