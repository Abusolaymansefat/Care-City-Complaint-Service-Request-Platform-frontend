"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTable } from "@/components/admin/user-table";
import { useDepartments } from "@/hooks/useDepartments";
import { useUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/auth.store";
import type { ManagedUserRole, UserStatus } from "@/types";

const roles: ManagedUserRole[] = [
  "CITIZEN",
  "TECHNICIAN",
  "DEPARTMENT_OFFICER",
  "ADMIN",
];
const statuses: UserStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<ManagedUserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsers({
    page,
    limit: 10,
    searchTerm: searchTerm.trim() || undefined,
    role: role || undefined,
    status: status || undefined,
  });
  const departments = useDepartments({ limit: 100, sortBy: "name", sortOrder: "asc" });
  const currentUserId = useAuthStore((state) => state.user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">User management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search accounts, change roles or status, and block or unblock access.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
        <Input
          aria-label="Search users"
          placeholder="Search name or email"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
        />
        <select
          aria-label="Filter users by role"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={role}
          onChange={(event) => {
            setRole(event.target.value as ManagedUserRole | "");
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          {roles.map((value) => (
            <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
          ))}
        </select>
        <select
          aria-label="Filter users by status"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as UserStatus | "");
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>

      {isError ? (
        <Card role="alert">
          <CardHeader>
            <CardTitle>Could not load users</CardTitle>
            <CardDescription>Confirm your admin access and refresh the page.</CardDescription>
          </CardHeader>
        </Card>
      ) : isLoading || departments.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => <Skeleton key={item} className="h-28 w-full" />)}
        </div>
      ) : (
        <>
          {departments.isError && (
            <Card role="alert">
              <CardHeader>
                <CardTitle>Could not load departments</CardTitle>
                <CardDescription>
                  Users are still available, but department-role assignments may need a refresh.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          <p className="text-sm text-muted-foreground">
            Showing {data?.data.length ?? 0} of {data?.meta?.total ?? 0} users
          </p>
          <UserTable
            users={data?.data ?? []}
            departments={departments.data?.data ?? []}
            currentUserId={currentUserId}
          />
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  isDisabled={page <= 1 || isLoading}
                  onPress={() => setPage((value) => value - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  isDisabled={page >= data.meta.totalPages || isLoading}
                  onPress={() => setPage((value) => value + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
