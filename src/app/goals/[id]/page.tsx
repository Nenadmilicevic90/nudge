import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { GoalDetailClient } from "./goal-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GoalDetailPage({ params }: Props) {
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

  const { data: checkins } = await supabase
    .from("checkins")
    .select("*")
    .eq("goal_id", id)
    .order("date", { ascending: false });

  return <GoalDetailClient goal={goal} checkins={checkins ?? []} />;
}
