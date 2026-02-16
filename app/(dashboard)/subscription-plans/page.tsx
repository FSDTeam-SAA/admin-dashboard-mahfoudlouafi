"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPlanSummary } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberShort, formatMoney } from "@/lib/format";
import { DollarSign, Gem, Sparkles } from "lucide-react";

type Plan = {
  _id: string;
  name: string;
  priceMonth: number;
  taskLimitYear: number;
};

export default function SubscriptionPlansPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["plan-summary"],
    queryFn: fetchPlanSummary
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button className="gap-2" variant="default">
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
          (data?.plans || []).map((plan: Plan) => (
            <Card key={plan._id} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-brand-100 to-brand-300" />
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-brand-600">{plan.name}</h3>
                <div className="mt-4 text-4xl font-semibold text-brand-600">
                  {formatMoney(plan.priceMonth)}
                  <span className="ml-2 text-sm font-medium text-muted">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted">
                  Enjoy your {plan.taskLimitYear} Task every year
                </p>
                <div className="mt-6">
                  <Button className="w-full" variant="default">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
