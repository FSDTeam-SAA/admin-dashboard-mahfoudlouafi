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
import { 
  DollarSign, 
  Gem, 
  Sparkles, 
  Trash2, 
  Pencil, 
  Plus,
  AlertCircle 
} from "lucide-react";

type Plan = {
  _id: string;
  name: string;
  priceMonth: number;
  priceYear?: number;
  taskLimitYear: number;
};

export default function SubscriptionPlansPage() {
  const queryClient = useQueryClient();
  
  // --- Queries ---
  const { data, isLoading } = useQuery({
    queryKey: ["plan-summary"],
    queryFn: fetchPlanSummary
  });

  const plans = useMemo<Plan[]>(() => data?.plans || [], [data?.plans]);

  // --- States ---
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    priceMonth: "0",
    priceYear: "0",
    taskLimitYear: "200"
  });

  // --- Helpers ---
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

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("Plan created successfully");
      setCreateOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["plan-summary"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Plan> }) =>
      updatePlan(id, payload),
    onSuccess: () => {
      toast.success("Plan updated successfully");
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

    if (!payload.name) {
      toast.error("Plan name is required");
      return;
    }

    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (editPlan) {
      updateMutation.mutate({ id: editPlan._id, payload });
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
        <Button
          onClick={() => {
            resetForm();
            setCreateOpen(true);
          }}
          className="h-12 gap-3 rounded-full bg-[#FFB352] px-6 text-white hover:bg-[#e6a14a] shadow-md"
        >
          <span className="font-semibold text-lg">Plan New</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <Plus className="h-4 w-4 text-[#FFB352]" strokeWidth={3} />
          </div>
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)
        ) : (
          <>
            <SummaryCard icon={<DollarSign />} label="Free Subscription" value={data?.totals?.free} />
            <SummaryCard icon={<Gem />} label="Premium Subscription" value={data?.totals?.premium} />
            <SummaryCard icon={<Sparkles />} label="Advanced Subscription" value={data?.totals?.advanced} />
          </>
        )}
      </div>

      {/* Main Pricing Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[450px] rounded-[32px]" />)
        ) : (
          plans.map((plan) => (
            <Card key={plan._id} className="relative flex flex-col overflow-hidden rounded-[40px] border-none bg-white shadow-xl shadow-orange-100/50">
              
              {/* Curved Header Visual */}
              <div className="relative h-48 w-full bg-[#FFCB82] overflow-hidden">
                {/* SVG Curve Overlap */}
                <div className="absolute -bottom-1 left-0 right-0">
                  <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-24 w-full fill-white">
                    <path d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                  </svg>
                </div>

                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-1.5 rounded-full bg-[#D99544]" />
                    <h3 className="text-3xl font-bold text-[#D99544]">{plan.name}</h3>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#D99544]">$</span>
                    <span className="text-6xl font-black text-[#D99544]">
                      {plan.priceMonth}
                      <span className="text-4xl">.00</span>
                    </span>
                    <span className="ml-2 text-sm font-medium text-[#D99544]/70">/month</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="flex flex-1 flex-col px-8 pb-10 pt-2">
                <div className="mb-auto">
                  <p className="text-lg text-gray-400 font-medium">
                    Enjoy your <span className="text-gray-600 font-bold">{plan.taskLimitYear} Task</span> every year
                  </p>
                  <div className="mt-6 h-[1.5px] w-full bg-gray-100" />
                </div>

                {/* Bottom Action Area */}
                <div className="mt-10 flex flex-col items-center gap-4">
                  <Button
                    onClick={() => {
                      resetForm(plan);
                      setEditPlan(plan);
                    }}
                    className="h-14 w-full max-w-[220px] rounded-2xl bg-gradient-to-r from-[#FFCB82] to-[#FFB352] text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-orange-200"
                  >
                    Edit
                  </Button>
                  
                  <button 
                    onClick={() => setDeletePlanId(plan._id)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-300 transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Plan
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add New Pricing Plan">
        <PlanForm form={form} setForm={setForm} onSubmit={() => handleSubmit("create")} isPending={createMutation.isPending} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={Boolean(editPlan)} onClose={() => setEditPlan(null)} title="Modify Plan Details">
        <PlanForm form={form} setForm={setForm} onSubmit={() => handleSubmit("edit")} isPending={updateMutation.isPending} />
      </Modal>

      {/* Delete Confirmation Modal */}
      {deletePlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Plan?</h3>
              <p className="mt-2 text-gray-500">This action is permanent and will remove this plan for all future customers.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => deleteMutation.mutate(deletePlanId)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 text-white">
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Plan"}
              </Button>
              <Button variant="ghost" onClick={() => setDeletePlanId(null)} className="rounded-2xl h-12 text-gray-500">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components for cleaner code ---

function SummaryCard({ icon, label, value }: { icon: React.ReactNode, label: string, value?: number }) {
  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center border-none rounded-[32px] shadow-sm bg-white">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#FFB352]">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-800">
        {formatNumberShort(value || 0)}
      </p>
    </Card>
  );
}

function PlanForm({ form, setForm, onSubmit, isPending }: any) {
  return (
    <div className="space-y-5 py-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Display Name</label>
        <Input 
          className="h-12 rounded-xl"
          value={form.name} 
          onChange={(e) => setForm((p: any) => ({ ...p, name: e.target.value }))} 
          placeholder="e.g. Premium Plus"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Monthly Price ($)</label>
          <Input 
            type="number" 
            className="h-12 rounded-xl"
            value={form.priceMonth} 
            onChange={(e) => setForm((p: any) => ({ ...p, priceMonth: e.target.value }))} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Yearly Price ($)</label>
          <Input 
            type="number" 
            className="h-12 rounded-xl"
            value={form.priceYear} 
            onChange={(e) => setForm((p: any) => ({ ...p, priceYear: e.target.value }))} 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Annual Task Limit</label>
        <Input 
          type="number" 
          className="h-12 rounded-xl"
          value={form.taskLimitYear} 
          onChange={(e) => setForm((p: any) => ({ ...p, taskLimitYear: e.target.value }))} 
        />
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={isPending}
        className="w-full h-14 rounded-2xl bg-[#FFB352] text-lg font-bold text-white hover:bg-[#e6a14a]"
      >
        {isPending ? "Processing..." : "Save Plan"}
      </Button>
    </div>
  );
}