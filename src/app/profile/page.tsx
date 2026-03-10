import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";
import { BottomNav } from "@/components/bottom-nav";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: goals } = await supabase
    .from("goals")
    .select("id")
    .eq("user_id", user.id);

  const { data: checkins } = await supabase
    .from("checkins")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "done");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <ProfileClient
        email={user.email ?? ""}
        profile={profile}
        totalGoals={goals?.length ?? 0}
        totalCheckins={checkins?.length ?? 0}
      />
      <BottomNav />
    </div>
  );
}
