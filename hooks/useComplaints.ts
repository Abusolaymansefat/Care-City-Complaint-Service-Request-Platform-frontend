"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import {
  createFeedback,
  createComplaint,
  fetchCategories,
  fetchAssignments,
  fetchComplaint,
  fetchComplaints,
  fetchDepartments,
  fetchMyComplaints,
} from "@/lib/complaints";
import type {
  Category,
  Complaint,
  ComplaintQuery,
  CreateComplaintInput,
  Department,
  PaginationMeta,
} from "@/types";

export const useMyComplaints = (query: ComplaintQuery = {}, enabled = true) =>
  useQuery({
    queryKey: ["complaints", "mine", query],
    queryFn: () => fetchMyComplaints(query),
    enabled,
  });

export const useComplaints = (query: ComplaintQuery = {}, enabled = true) =>
  useQuery({
    queryKey: ["complaints", "all", query],
    queryFn: () => fetchComplaints(query),
    enabled,
  });

export const useAssignments = (query: { page?: number; limit?: number } = {}, enabled = true) =>
  useQuery({
    queryKey: ["assignments", query],
    queryFn: () => fetchAssignments(query),
    enabled,
  });

export const useComplaint = (id?: string) =>
  useQuery<Complaint>({
    queryKey: ["complaints", id],
    queryFn: () => fetchComplaint(id as string),
    enabled: Boolean(id),
  });

export const useCategories = (query: { limit?: number; isActive?: boolean } = {}) =>
  useQuery<{ data: Category[]; meta?: PaginationMeta }>({
    queryKey: ["categories", query],
    queryFn: () => fetchCategories(query),
  });

export const useDepartments = (query: { limit?: number } = {}) =>
  useQuery<{ data: Department[]; meta?: PaginationMeta }>({
    queryKey: ["departments", query],
    queryFn: () => fetchDepartments(query),
  });

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateComplaintInput) => createComplaint(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["complaints", "mine"] });
      toast.success("Your complaint has been submitted.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["complaints", "mine"] });
      toast.success("Thank you for your feedback.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};
