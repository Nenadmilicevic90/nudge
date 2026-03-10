import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoalForm } from "@/components/goal-form";
import { BottomNav } from "@/components/bottom-nav";

export default async function NewGoalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-md px-4 pt-6 pb-24">
        <h1 className="mb-6 text-xl font-bold">Nytt mål</h1>
        <GoalForm userId={user.id} />
      </div>
      <BottomNav />
    </div>
  );
}
