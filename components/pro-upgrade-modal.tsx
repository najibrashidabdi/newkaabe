"use client";

import { useState } from "react";
import { Trophy, CheckCircle } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ProUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void; // parent will refetch dashboard etc.
}

export function ProUpgradeModal({
  open,
  onOpenChange,
  onUpgrade,
}: ProUpgradeModalProps) {
  const { toast } = useToast();

  const [activationCode, setActivationCode] = useState("");
  const [isActivating, setActivating]       = useState(false);
  const [step, setStep] = useState<"info" | "code">("info");

  /* ───────── submit activation code ───────── */
  async function handleActivate() {
    if (!activationCode.trim()) {
      toast({
        title: "Activation code required",
        description: "Please enter your activation code.",
        variant: "destructive",
      });
      return;
    }

    setActivating(true);
    try {
      /* ---- call backend ---- */
      await api("/api/activate/", "POST", { code: activationCode.trim() });

      toast({
        title: "Upgrade successful!",
        description: "Enjoy full Pro access 🎉",
      });

      onUpgrade();                 // parent re-fetches dashboard
      onOpenChange(false);         // close modal
    } catch (err: any) {
      toast({
        title: "Activation failed",
        description:
          typeof err?.message === "string"
            ? err.message
            : "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  }

  /* ───────── UI ───────── */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            Unlock all features and 1000+ questions across 10 subjects.
          </DialogDescription>
        </DialogHeader>

        {step === "info" ? (
          /* ----------- payment instructions ----------- */
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Pro Plan Benefits:</h3>
              <ul className="space-y-2">
                {[
                  "Access to 1000+ practice questions",
                  "Full access to all 10 subjects",
                  "AI-powered feedback & explanations",
                  "$10 monthly reward giveaways",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Payment Instructions:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Send $ to the following mobile money number:
              </p>
              <div className="bg-background p-2 rounded text-center font-medium">
                +252&nbsp;61&nbsp;123&nbsp;4567
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                You&rsquo;ll receive an activation code via SMS.
              </p>
            </div>

            <Button className="w-full" onClick={() => setStep("code")}>
              I&#39;ve made the payment
            </Button>
          </div>
        ) : (
          /* ----------- code entry form ----------- */
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activationCode">Activation Code</Label>
              <Input
                id="activationCode"
                placeholder="e.g. ABC123"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                autoFocus
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the code you received after payment.
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {step === "info" ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("info")}>
                Back
              </Button>
              <Button onClick={handleActivate} disabled={isActivating}>
                {isActivating ? "Activating…" : "Activate Pro"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
