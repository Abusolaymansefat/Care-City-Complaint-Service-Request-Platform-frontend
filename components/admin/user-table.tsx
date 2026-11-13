"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserActions } from "@/components/admin/user-actions";
import type { Department, User } from "@/types";

export function UserTable({
  users,
  departments,
  currentUserId,
}: {
  users: User[];
  departments: Department[];
  currentUserId?: string;
}) {
  if (!users.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No users found</CardTitle>
          <CardDescription>Try changing your search or filters.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={`${user.id}-${user.updatedAt ?? user.status}`}>
          <CardHeader className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="min-w-0 space-y-1">
              <CardTitle className="truncate text-base">{user.name}</CardTitle>
              <CardDescription className="break-all">{user.email}</CardDescription>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant={user.status === "ACTIVE" ? "default" : user.status === "BANNED" ? "destructive" : "secondary"}>
                  {user.status}
                </Badge>
                <Badge variant="outline">{user.role.replaceAll("_", " ")}</Badge>
                {user.department && (
                  <span className="text-xs text-muted-foreground">{user.department.name}</span>
                )}
                {user.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    Joined {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </span>
                )}
                {!user.emailVerified && (
                  <span className="text-xs text-destructive">Email not verified</span>
                )}
              </div>
            </div>
            <UserActions
              user={user}
              departments={departments}
              currentUserId={currentUserId}
            />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}