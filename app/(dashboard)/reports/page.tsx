"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchReportAnalytics } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EngagementChart } from "@/components/charts/EngagementChart";
import { ContentPieChart } from "@/components/charts/ContentPieChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, BookOpen } from "lucide-react";

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReportAnalytics
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Report & Analysis</h1>
        <Select defaultValue="daily">
          <SelectTrigger className="w-36 bg-brand-500 text-white">
            <SelectValue placeholder="Daily" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-brand-600" />
            Student Engagement Trends
          </div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <EngagementChart
              labels={data?.engagement?.labels || []}
              totalTasks={data?.engagement?.totalTasks || []}
              completedTasks={data?.engagement?.completedTasks || []}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-brand-600" />
              Students Performance Statics
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold">
                  <span>Daily Active Students</span>
                  <span className="text-brand-600">{data?.performance?.dailyActive || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold">
                  <span>Weekly Active Students</span>
                  <span className="text-brand-600">{data?.performance?.weeklyActive || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold">
                  <span>Monthly Active Students</span>
                  <span className="text-brand-600">{data?.performance?.monthlyActive || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-brand-600" />
              Content Management
            </div>
            {isLoading ? (
              <Skeleton className="h-52" />
            ) : (
              <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                <ContentPieChart
                  files={data?.content?.files || 0}
                  links={data?.content?.links || 0}
                  notes={data?.content?.notes || 0}
                />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#f28c28]" />
                    Files .Image.Video
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#f8b446]" />
                    Links
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#f2de4d]" />
                    Notes
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
