"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboardingAction } from "@/lib/actions";
import { CATEGORIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goalName, setGoalName] = useState("");
  const [category, setCategory] = useState("health");
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    await completeOnboardingAction(goalName, category);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-sm space-y-8">
        {step === 0 && (
          <div className="text-center space-y-6">
            <span className="text-5xl">👋</span>
            <h1 className="text-2xl font-bold">Välkommen till Nudge!</h1>
            <p className="text-muted-foreground">
              Nudge hjälper dig bygga bättre vanor genom små dagliga steg.
            </p>
            <Button
              className="w-full bg-[#4CAF50] hover:bg-[#43A047]"
              onClick={() => setStep(1)}
            >
              Kom igång
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-4xl">🎯</span>
              <h2 className="mt-2 text-xl font-bold">Ditt första mål</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Vad vill du börja med?
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Mål</Label>
                <Input
                  id="goal"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="T.ex. 30 min promenad"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORIES).map(
                    ([key, { label, emoji }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          category === key
                            ? "border-[#4CAF50] bg-green-50 text-[#4CAF50]"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        {emoji} {label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[#4CAF50] hover:bg-[#43A047]"
                onClick={handleFinish}
                disabled={loading || !goalName.trim()}
              >
                {loading ? "Sparar..." : "Starta!"}
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  setLoading(true);
                  await completeOnboardingAction();
                  router.push("/dashboard");
                  router.refresh();
                }}
              >
                Hoppa över
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
