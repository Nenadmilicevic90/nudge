import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GoalForm } from "@/components/goal-form";
import { BottomNav } from "@/components/bottom-nav";

export default async function NewGoalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-md px-4 pt-6 pb-24">
        <h1 className="mb-6 text-xl font-bold">Nytt mål</h1>
        <GoalForm />
      </div>
      <BottomNav />
    </div>
  );
}
