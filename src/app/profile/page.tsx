import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";
import { BottomNav } from "@/components/bottom-nav";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
  const user = users[0];

  const goals = await sql`SELECT id FROM goals WHERE user_id = ${userId}`;

  const checkins = await sql`
    SELECT id FROM checkins WHERE user_id = ${userId} AND status = 'done'
  `;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <ProfileClient
        email={session.user.email ?? ""}
        userName={user?.name ?? null}
        totalGoals={goals.length}
        totalCheckins={checkins.length}
      />
      <BottomNav />
    </div>
  );
}
