"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = typeof window !== "undefined" ? sessionStorage.getItem("resetEmail") : null;
  const otp = typeof window !== "undefined" ? sessionStorage.getItem("resetOtp") : null;

  useEffect(() => {
    if (!email) {
      toast.error("Please start the reset flow again.");
      router.push("/forgot-password");
      return;
    }
    if (!otp) {
      toast.error("Please verify the code first.");
      router.push("/verify-otp");
    }
  }, [email, otp, router]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!email || !otp) throw new Error("Missing reset data");
      return resetPassword({ email, otp, password });
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      router.push("/login");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to reset password"));
    }
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-brand-600">Reset password</h1>
        <p className="mt-2 text-sm text-muted">Choose a new password for your account.</p>
      </div>

      <form className="mt-10 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">New password</label>
          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">Confirm new password</label>
          <Input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
