"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/hooks/useUsers";
import type {
  Department,
  ManagedUserRole,
  UpdateUserInput,
  User,
  UserStatus,
} from "@/types";

const roles: ManagedUserRole[] = [
  "CITIZEN",
  "TECHNICIAN",
  "DEPARTMENT_OFFICER",
  "ADMIN",
];
const statuses: UserStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"];

export function UserActions({
  user,
  departments,
  currentUserId,
}: {
  user: User;
  departments: Department[];
  currentUserId?: string;
}) {
  const update = useUpdateUser();
  const [role, setRole] = useState<ManagedUserRole>(
    user.role === "OFFICER" ? "CITIZEN" : user.role
  );
  const [status, setStatus] = useState(user.status);
  const [departmentId, setDepartmentId] = useState(user.departmentId ?? "");
  const isSelf = user.id === currentUserId;
  const needsDepartment = role === "TECHNICIAN" || role === "DEPARTMENT_OFFICER";
  const changed =
    role !== user.role ||
    status !== user.status ||
    (needsDepartment && departmentId !== (user.departmentId ?? ""));

  const submit = (input: UpdateUserInput) => update.mutate(input);
  const save = () =>
    submit({
      id: user.id,
      role,
      status,
      departmentId: needsDepartment ? departmentId || null : null,
    });
  const toggleBlock = () =>
    submit({
      id: user.id,
      status: user.status === "BANNED" ? "ACTIVE" : "BANNED",
    });

  return (
    <div className="flex flex-col gap-2 sm:min-w-72">
      <label className="sr-only" htmlFor={`role-${user.id}`}>Role for {user.name}</label>
      <select
        id={`role-${user.id}`}
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={role}
        onChange={(event) => setRole(event.target.value as ManagedUserRole)}
        disabled={isSelf || update.isPending}
      >
        {roles.map((value) => (
          <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor={`status-${user.id}`}>Status for {user.name}</label>
      <select
        id={`status-${user.id}`}
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        value={status}
        onChange={(event) => setStatus(event.target.value as UserStatus)}
        disabled={isSelf || update.isPending}
      >
        {statuses.map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>

      {needsDepartment && (
        <>
          <label className="sr-only" htmlFor={`department-${user.id}`}>
            Department for {user.name}
          </label>
          <select
            id={`department-${user.id}`}
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
            disabled={isSelf || update.isPending}
          >
            <option value="">Select department</option>
            {departments.filter((department) => department.isActive).map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={user.status === "BANNED" ? "outline" : "destructive"}
          isDisabled={isSelf || update.isPending}
          onPress={toggleBlock}
        >
          {user.status === "BANNED" ? "Unblock" : "Block"}
        </Button>
        <Button
          size="sm"
          isDisabled={
            isSelf ||
            !changed ||
            update.isPending ||
            (needsDepartment && !departmentId)
          }
          onPress={save}
        >
          {update.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}