"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import {
  fetchDepartmentTechnician,
  fetchDepartmentTechnicians,
  fetchUsers,
  updateUser,
} from "@/lib/users";
import type { UpdateUserInput, UserQuery } from "@/types";

export const useUsers = (query: UserQuery = {}) =>
  useQuery({
    queryKey: ["users", query],
    queryFn: () => fetchUsers(query),
  });

export const useDepartmentTechnicians = (
  query: Pick<UserQuery, "searchTerm" | "page" | "limit"> = {}
) =>
  useQuery({
    queryKey: ["department-technicians", query],
    queryFn: () => fetchDepartmentTechnicians(query),
  });

export const useDepartmentTechnician = (id?: string) =>
  useQuery({
    queryKey: ["department-technician", id],
    queryFn: () => fetchDepartmentTechnician(id as string),
    enabled: Boolean(id),
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      void queryClient.invalidateQueries({
        queryKey: ["department-technicians"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["department-technician"],
      });
      toast.success("User updated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};
