"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PaginationBar } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort } from "@/lib/format";

type StudentRow = {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  joinedAt?: string;
  totalTasks: number;
  completedTasks: number;
  level?: string;
  status: "active" | "inactive";
  plan: string;
};

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["students", page],
    queryFn: () => fetchStudents({ page, limit })
  });

  const students = data?.students || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Students List</h1>

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
              <TableHead>Joined Date</TableHead>
              <TableHead>Total Task</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student: StudentRow) => (
              <TableRow key={student._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={student.avatar}
                      fallback={student.name?.slice(0, 1)}
                    />
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted">{student.email}</TableCell>
                <TableCell>{formatDateShort(student.joinedAt)}</TableCell>
                <TableCell>{student.totalTasks}</TableCell>
                <TableCell>{student.level}</TableCell>
                <TableCell>
                  <Badge variant={student.status === "active" ? "success" : "danger"}>
                    {student.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-brand-600">
                  {student.plan}
                </TableCell>
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
