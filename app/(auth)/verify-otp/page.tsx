"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resetPassword, requestForgotPassword } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

function OtpInputs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const values = useMemo(() => value.padEnd(6, " ").slice(0, 6).split(""), [value]);

  return (
    <div className="flex items-center justify-center gap-3">
      {values.map((char, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          className="h-14 w-14 rounded-xl border border-brand-300 text-center text-2xl font-semibold text-foreground focus:border-brand-500 focus:outline-none"
          maxLength={1}
          value={char.trim()}
          onChange={(e) => {
            const nextValue = e.target.value.replace(/\D/g, "");
            const current = value.split("");
            current[index] = nextValue;
            const joined = current.join("").slice(0, 6);
            onChange(joined);
            if (nextValue && inputs.current[index + 1]) {
              inputs.current[index + 1]?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[index] && inputs.current[index - 1]) {
              inputs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(43);

  const email = typeof window !== "undefined" ? sessionStorage.getItem("resetEmail") : null;
  const password = typeof window !== "undefined" ? sessionStorage.getItem("resetPassword") : null;

  useEffect(() => {
    if (!email || !password) {
      toast.error("Please start the reset flow again.");
      router.push("/forgot-password");
    }
  }, [email, password, router]);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!email || !password) throw new Error("Missing reset data");
      return resetPassword({ email, otp: code, password });
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetPassword");
      router.push("/login");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Invalid code"));
    }
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("Missing email");
      return requestForgotPassword(email);
    },
    onSuccess: () => {
      toast.success("Code resent");
      setSeconds(43);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Unable to resend code"));
    }
  });

  return (
    <div className="w-full max-w-2xl rounded-[32px] bg-white px-10 py-12 shadow-soft text-center">
      <h1 className="text-3xl font-semibold text-brand-600">Enter code</h1>
      <p className="mt-2 text-sm text-muted">
        Please check your Email for a message with your code. Your code is 6 numbers long.
      </p>

      <div className="mt-10">
        <OtpInputs value={code} onChange={setCode} />
      </div>

      <div className="mt-4 text-sm text-muted">
        {seconds > 0 ? (
          <>Resend code in {seconds}s</>
        ) : (
          <button
            className="text-brand-600"
            onClick={() => resendMutation.mutate()}
            disabled={resendMutation.isPending}
          >
            Resend code
          </button>
        )}
      </div>

      <Button
        className="mt-8 w-full"
        onClick={() => verifyMutation.mutate()}
        disabled={code.length !== 6 || verifyMutation.isPending}
      >
        {verifyMutation.isPending ? "Verifying..." : "Verify"}
      </Button>
    </div>
  );
}
