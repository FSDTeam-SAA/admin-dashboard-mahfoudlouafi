"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberShort } from "@/lib/format";
import { StudentGrowthChart } from "@/components/charts/StudentGrowthChart";
import { PerformanceDonut } from "@/components/charts/PerformanceDonut";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ClipboardList, CheckCircle2, DollarSign, GraduationCap } from "lucide-react";

type TopStudent = {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  institution?: string;
  level?: string;
  completedTasks?: number;
  plan?: string;
};

type TopCourse = {
  name: string;
  total: number;
};

function StatCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardOverview
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={formatNumberShort(data?.totals?.students || 0)}
              icon={GraduationCap}
            />
            <StatCard
              title="Total Task"
              value={formatNumberShort(data?.totals?.tasks || 0)}
              icon={ClipboardList}
            />
            <StatCard
              title="Completed Task"
              value={formatNumberShort(data?.totals?.completedTasks || 0)}
              icon={CheckCircle2}
            />
            <StatCard
              title="Total Subscribe"
              value={formatNumberShort(data?.totals?.subscribers || 0)}
              icon={DollarSign}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-brand-600" />
              Student Growth
            </div>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <StudentGrowthChart
                labels={data?.growth?.labels || []}
                values={data?.growth?.values || []}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <CheckCircle2 className="h-5 w-5 text-brand-600" />
              Student Performance
            </div>
            {isLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <PerformanceDonut percent={data?.performance?.percent || 0} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <GraduationCap className="h-5 w-5 text-brand-600" />
              Top Student
            </div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : (
              <div className="space-y-4">
                {(data?.topStudents?.slice(0, 2) ?? []).map((student: TopStudent) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between rounded-2xl bg-brand-300/60 px-4 py-4 text-white"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={student.avatar}
                        fallback={student.name?.slice(0, 1)}
                        className="h-12 w-12"
                      />
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs opacity-80">{student.institution}</p>
                        <p className="text-xs opacity-80">{student.level} level</p>
                      </div>
                    </div>
                    <div className="text-xs opacity-80">
                      {student.completedTasks} task completed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-brand-600" />
              Top Course Task
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : (
              <div className="space-y-3">
                {(data?.topCourses || []).map((course: TopCourse, index: number) => (
                  <div
                    key={course.name}
                    className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold"
                  >
                    <span>
                      <span className="mr-2 text-brand-600">{index + 1}.</span>
                      {course.name}
                    </span>
                    <span className="text-muted">{course.total}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
