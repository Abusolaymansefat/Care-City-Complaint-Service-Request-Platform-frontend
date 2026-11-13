"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import {
  createDepartment,
  deleteDepartment,
  fetchDepartment,
  fetchDepartments,
  updateDepartment,
} from "@/lib/departments";
import type { DepartmentInput, DepartmentQuery } from "@/types";

export const useDepartments = (query: DepartmentQuery = {}) =>
  useQuery({
    queryKey: ["departments", query],
    queryFn: () => fetchDepartments(query),
  });

export const useDepartment = (id?: string) =>
  useQuery({
    queryKey: ["department", id],
    queryFn: () => fetchDepartment(id as string),
    enabled: Boolean(id),
  });

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DepartmentInput) => createDepartment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: (department) => {
      void queryClient.invalidateQueries({ queryKey: ["departments"] });
      void queryClient.invalidateQueries({ queryKey: ["department", department.id] });
      toast.success("Department updated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};
