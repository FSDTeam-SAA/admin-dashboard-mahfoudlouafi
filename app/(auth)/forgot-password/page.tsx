"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestForgotPassword } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: string) => requestForgotPassword(payload),
    onSuccess: () => {
      sessionStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetPassword", password);
      toast.success("Verification code sent to your email");
      router.push("/verify-otp");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to send code"));
    }
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    mutation.mutate(email);
  };

  return (
    <div className="w-full max-w-2xl rounded-[32px] bg-white px-10 py-12 shadow-soft">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-brand-600">Forgot password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your registered email address. We&apos;ll send you a code to reset your password.
        </p>
      </div>

      <form className="mt-10 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">Email address</label>
          <Input
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">New password</label>
          <Input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">Confirm password</label>
          <Input
            type="password"
            placeholder="••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Confirm"}
        </Button>
      </form>
    </div>
  );
}
