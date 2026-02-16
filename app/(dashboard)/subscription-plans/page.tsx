"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPlan, deletePlan, fetchPlanSummary, updatePlan } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatNumberShort, formatMoney } from "@/lib/format";
import { toast } from "sonner";
import { DollarSign, Gem, Sparkles, Trash2, Pencil } from "lucide-react";

type Plan = {
  _id: string;
  name: string;
  priceMonth: number;
  priceYear?: number;
  taskLimitYear: number;
};

export default function SubscriptionPlansPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["plan-summary"],
    queryFn: fetchPlanSummary
  });

  const plans = useMemo<Plan[]>(() => data?.plans || [], [data?.plans]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    priceMonth: "0",
    priceYear: "0",
    taskLimitYear: "200"
  });

  const resetForm = (plan?: Plan) => {
    if (plan) {
      setForm({
        name: plan.name || "",
        priceMonth: String(plan.priceMonth ?? 0),
        priceYear: String(plan.priceYear ?? 0),
        taskLimitYear: String(plan.taskLimitYear ?? 0)
      });
      return;
    }
    setForm({ name: "", priceMonth: "0", priceYear: "0", taskLimitYear: "200" });
  };

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("Plan created");
      setCreateOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["plan-summary"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Plan> }) =>
      updatePlan(id, payload),
    onSuccess: () => {
      toast.success("Plan updated");
      setEditPlan(null);
      queryClient.invalidateQueries({ queryKey: ["plan-summary"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      toast.success("Plan deleted");
      setDeletePlanId(null);
      queryClient.invalidateQueries({ queryKey: ["plan-summary"] });
    }
  });

  const handleSubmit = (mode: "create" | "edit") => {
    const payload = {
      name: form.name.trim(),
      priceMonth: Number(form.priceMonth || 0),
      priceYear: Number(form.priceYear || 0),
      taskLimitYear: Number(form.taskLimitYear || 0)
    };

    if (!payload.name || !payload.taskLimitYear) {
      toast.error("Name and task limit are required");
      return;
    }

    if (mode === "create") {
      createMutation.mutate(payload);
      return;
    }

    if (editPlan) {
      updateMutation.mutate({ id: editPlan._id, payload });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button
          className="gap-2"
          variant="default"
          onClick={() => {
            resetForm();
            setCreateOpen(true);
          }}
        >
          Plan New
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-600">+</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))
        ) : (
          <>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted">Free Subscription</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatNumberShort(data?.totals?.free || 0)}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Gem className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted">Premium Subscription</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatNumberShort(data?.totals?.premium || 0)}
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted">Advanced Subscription</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatNumberShort(data?.totals?.advanced || 0)}
              </p>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-3xl" />
          ))
        ) : (
          plans.map((plan) => (
            <Card key={plan._id} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-brand-100 to-brand-300" />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-brand-600">{plan.name}</h3>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-100 text-brand-600 hover:bg-brand-50"
                    onClick={() => setDeletePlanId(plan._id)}
                    aria-label={`Delete ${plan.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 text-4xl font-semibold text-brand-600">
                  {formatMoney(plan.priceMonth)}
                  <span className="ml-2 text-sm font-medium text-muted">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted">
                  Enjoy your {plan.taskLimitYear} Task every year
                </p>
                <div className="mt-6">
                  <Button
                    className="w-full gap-2"
                    variant="default"
                    onClick={() => {
                      resetForm(plan);
                      setEditPlan(plan);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Plan">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Plan Name</label>
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Premium"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Price / month</label>
              <Input
                type="number"
                value={form.priceMonth}
                onChange={(event) => setForm((prev) => ({ ...prev, priceMonth: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Price / year</label>
              <Input
                type="number"
                value={form.priceYear}
                onChange={(event) => setForm((prev) => ({ ...prev, priceYear: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Task limit / year</label>
            <Input
              type="number"
              value={form.taskLimitYear}
              onChange={(event) => setForm((prev) => ({ ...prev, taskLimitYear: event.target.value }))}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleSubmit("create")}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Plan"}
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(editPlan)} onClose={() => setEditPlan(null)} title="Update Plan">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Plan Name</label>
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Price / month</label>
              <Input
                type="number"
                value={form.priceMonth}
                onChange={(event) => setForm((prev) => ({ ...prev, priceMonth: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Price / year</label>
              <Input
                type="number"
                value={form.priceYear}
                onChange={(event) => setForm((prev) => ({ ...prev, priceYear: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Task limit / year</label>
            <Input
              type="number"
              value={form.taskLimitYear}
              onChange={(event) => setForm((prev) => ({ ...prev, taskLimitYear: event.target.value }))}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleSubmit("edit")}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Modal>

      <Modal
        open={Boolean(deletePlanId)}
        onClose={() => setDeletePlanId(null)}
        title="Delete Plan"
      >
        <div className="space-y-6">
          <p className="text-sm text-muted">
            Are you sure you want to delete this plan? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletePlanId(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => deletePlanId && deleteMutation.mutate(deletePlanId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Plan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
