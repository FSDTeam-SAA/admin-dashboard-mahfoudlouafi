"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptions } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/ui/pagination";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort, formatMoney } from "@/lib/format";

type SubscriptionRow = {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  planDate?: string;
  planAmount?: number;
  plan: string;
  status: "active" | "inactive";
};

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions", page],
    queryFn: () => fetchSubscriptions({ page, limit, plan: "Premium" })
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Premium Subscription</h1>

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
              <TableHead>ID</TableHead>
              <TableHead>Plan Date</TableHead>
              <TableHead>Plans Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.subscriptions || []).map((item: SubscriptionRow) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={item.avatar} fallback={item.name?.slice(0, 1)} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted">{item.email}</TableCell>
                <TableCell className="text-muted">{item._id}</TableCell>
                <TableCell>{formatDateShort(item.planDate)}</TableCell>
                <TableCell>{formatMoney(item.planAmount || 0)}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "neutral" : "danger"}>
                    {item.plan}
                  </Badge>
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
