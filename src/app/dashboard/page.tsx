import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  // Check onboarding
  const users = await sql`SELECT onboarded FROM users WHERE id = ${userId}`;
  if (users[0] && !users[0].onboarded) {
    redirect("/onboarding");
  }

  const goals = await sql`
    SELECT * FROM goals
    WHERE user_id = ${userId} AND active = TRUE
    ORDER BY sort_order ASC
  `;

  // Get this week's checkins
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay();
  monday.setDate(today.getDate() - ((day + 6) % 7));
  const mondayStr = monday.toISOString().split("T")[0];

  const checkins = await sql`
    SELECT * FROM checkins
    WHERE user_id = ${userId} AND date >= ${mondayStr}
  `;

  return (
    <DashboardClient
      goals={goals as any[]}
      checkins={checkins as any[]}
      userId={userId}
    />
  );
}
