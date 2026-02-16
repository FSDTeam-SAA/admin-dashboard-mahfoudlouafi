"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopStudents } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/ui/pagination";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateShort } from "@/lib/format";

type TopStudentRow = {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  institute?: string;
  level?: string;
  joinedAt?: string;
  totalTasks: number;
  completedTasks: number;
  plan: string;
};

export default function TopStudentsPage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["top-students", page],
    queryFn: () => fetchTopStudents({ page, limit })
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Top Students</h1>
        <Select defaultValue="daily">
          <SelectTrigger className="w-32 bg-brand-500 text-white">
            <SelectValue placeholder="Daily" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Institute</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Total Task</TableHead>
              <TableHead>Completed Task</TableHead>
              <TableHead>Plan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.students || []).map((student: TopStudentRow) => (
              <TableRow key={student._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={student.avatar} fallback={student.name?.slice(0, 1)} />
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted">{student.email}</TableCell>
                <TableCell>{student.institute}</TableCell>
                <TableCell>{student.level}</TableCell>
                <TableCell>{formatDateShort(student.joinedAt)}</TableCell>
                <TableCell>{student.totalTasks}</TableCell>
                <TableCell>{student.completedTasks}</TableCell>
                <TableCell className="font-semibold text-brand-600">{student.plan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PaginationBar
        page={page}
        limit={limit}
        total={data?.total || 0}
        onPageChange={setPage}
      />
    </div>
  );
}
