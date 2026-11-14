"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import {
  createFeedback,
  createComplaint,
  createAssignment,
  createCategory,
  deleteComplaint,
  deleteCategory,
  fetchCategories,
  fetchCategory,
  fetchAssignment,
  fetchAssignments,
  fetchComplaint,
  fetchComplaints,
  fetchMyComplaints,
  fetchPublicComplaint,
  fetchPublicComplaints,
  updateAssignmentStatus,
  updateComplaint,
  updateCategory,
} from "@/lib/complaints";
import type {
  Category,
  CategoryInput,
  Complaint,
  ComplaintQuery,
  CreateAssignmentInput,
  CreateComplaintInput,
  PublicComplaint,
  CategoryQuery,
  PaginationMeta,
  UpdateComplaintInput,
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

export const usePublicComplaints = (
  query: Pick<ComplaintQuery, "page" | "limit"> = {}
) =>
  useQuery({
    queryKey: ["complaints", "public", query],
    queryFn: () => fetchPublicComplaints(query),
  });

export const usePublicComplaint = (id?: string) =>
  useQuery<PublicComplaint>({
    queryKey: ["complaints", "public", id],
    queryFn: () => fetchPublicComplaint(id as string),
    enabled: Boolean(id),
  });

export const useAssignments = (query: { page?: number; limit?: number } = {}, enabled = true) =>
  useQuery({
    queryKey: ["assignments", query],
    queryFn: () => fetchAssignments(query),
    enabled,
  });

export const useAssignment = (id?: string) =>
  useQuery({
    queryKey: ["assignment", id],
    queryFn: () => fetchAssignment(id as string),
    enabled: Boolean(id),
  });

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAssignmentInput) => createAssignment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["assignments"] });
      void queryClient.invalidateQueries({ queryKey: ["assignment"] });
      void queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Assignment created.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useUpdateAssignmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAssignmentStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["assignments"] });
      void queryClient.invalidateQueries({ queryKey: ["assignment"] });
      void queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Assignment status updated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useComplaint = (id?: string) =>
  useQuery<Complaint>({
    queryKey: ["complaints", id],
    queryFn: () => fetchComplaint(id as string),
    enabled: Boolean(id),
  });

export const useCategories = (query: CategoryQuery = {}) =>
  useQuery<{ data: Category[]; meta?: PaginationMeta }>({
    queryKey: ["categories", query],
    queryFn: () => fetchCategories(query),
  });

export const useCategory = (id?: string) =>
  useQuery<Category>({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id as string),
    enabled: Boolean(id),
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (category) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["category", category.id] });
      toast.success("Category updated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deactivated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

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

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateComplaintInput) => updateComplaint(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Your complaint has been updated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComplaint,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint archived.");
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
