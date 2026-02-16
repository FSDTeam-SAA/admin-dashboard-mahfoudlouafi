"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    mutation.mutate({ oldPassword: currentPassword, newPassword });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Setting</h1>
        <p className="text-sm text-muted">Edit your personal information</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={session?.user?.image || undefined}
              fallback={session?.user?.name?.slice(0, 1) || "A"}
              className="h-16 w-16"
            />
            <div>
              <p className="text-lg font-semibold">{session?.user?.name || "Admin"}</p>
              <p className="text-sm text-muted">{session?.user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold">Change password</h2>
          <form className="mt-6 grid gap-4 lg:grid-cols-3" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="lg:col-span-3 flex justify-center">
              <Button type="submit" className="w-full max-w-xs" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Session Timeout</p>
                  <p className="text-xs text-muted">Auto-logout after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Password Policy</p>
                  <p className="text-xs text-muted">Minimum password strength</p>
                </div>
                <span className="text-brand-600">{">"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Email Notifications</p>
                  <p className="text-xs text-muted">Send email notifications to students</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Whatsapp Notification</p>
                  <p className="text-xs text-muted">Send notification in whatsapp</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">SMS Notification</p>
                  <p className="text-xs text-muted">Send SMS to students</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
