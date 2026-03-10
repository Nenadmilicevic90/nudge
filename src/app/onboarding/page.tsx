import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session?.id) redirect("/auth/login");

  return <OnboardingClient />;
}
