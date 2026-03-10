"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  email: string;
  userName: string | null;
  totalGoals: number;
  totalCheckins: number;
};

export function ProfileClient({
  email,
  userName,
  totalGoals,
  totalCheckins,
}: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold">Profil</h1>

      <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
        <p className="font-medium">{userName ?? "Användare"}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#4CAF50]">{totalGoals}</p>
          <p className="text-xs text-muted-foreground">Aktiva mål</p>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#4CAF50]">{totalCheckins}</p>
          <p className="text-xs text-muted-foreground">Incheckningar</p>
        </div>
      </div>

      <Separator className="my-6" />

      <Button
        variant="outline"
        className="w-full"
        onClick={handleLogout}
      >
        Logga ut
      </Button>
    </div>
  );
}
