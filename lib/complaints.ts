import { api } from "@/lib/api";
import type {
  Category,
  CategoryInput,
  CategoryQuery,
  Assignment,
  Complaint,
  ComplaintQuery,
  CreateAssignmentInput,
  CreateComplaintInput,
  Feedback,
  PaginationMeta,
} from "@/types";

type ApiListResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};

export const createComplaint = async (input: CreateComplaintInput) => {
  const body = new FormData();
  body.append("title", input.title);
  body.append("description", input.description);
  body.append("address", input.address);
  body.append("categoryId", input.categoryId);
  if (input.latitude !== undefined) body.append("latitude", String(input.latitude));
  if (input.longitude !== undefined) body.append("longitude", String(input.longitude));
  input.images?.forEach((image) => body.append("media", image));
  input.videos?.forEach((video) => body.append("media", video));

  const response = await api.post<{ data: Complaint }>("/complaints/create-complaint", body);
  return response.data.data;
};

export const fetchMyComplaints = async (params: ComplaintQuery) => {
  const response = await api.get<ApiListResponse<Complaint[]>>(
    "/complaints/get-my-complaints",
    { params }
  );
  return { data: response.data.data, meta: response.data.meta };
};

export const fetchComplaints = async (params: ComplaintQuery) => {
  const response = await api.get<ApiListResponse<Complaint[]>>("/complaints/get-complaints", {
    params,
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const fetchAssignments = async (params: { page?: number; limit?: number }) => {
  const response = await api.get<ApiListResponse<Assignment[]>>(
    "/assignments/get-assignments",
    { params }
  );
  return { data: response.data.data, meta: response.data.meta };
};

export const fetchAssignment = async (id: string) => {
  const limit = 100;
  const firstPage = await fetchAssignments({ page: 1, limit });
  const firstMatch = firstPage.data.find((assignment) => assignment.id === id);
  if (firstMatch) return firstMatch;

  for (let page = 2; page <= (firstPage.meta?.totalPages ?? 1); page += 1) {
    const result = await fetchAssignments({ page, limit });
    const match = result.data.find((assignment) => assignment.id === id);
    if (match) return match;
  }

  throw new Error("Assignment not found.");
};

export const createAssignment = async (input: CreateAssignmentInput) => {
  const response = await api.post<{ data: Assignment }>("/assignments/create-assignment", input);
  return response.data.data;
};

export const updateAssignmentStatus = async ({
  id,
  status,
  notes,
}: {
  id: string;
  status: Assignment["status"];
  notes?: string;
}) => {
  const response = await api.patch<{ data: Assignment }>(
    `/assignments/update-assignment-status${id}/status`,
    { status, notes }
  );
  return response.data.data;
};

export const fetchComplaint = async (id: string) => {
  const response = await api.get<{ data: Complaint }>(`/complaints/get-complaint/${id}`);
  return response.data.data;
};

export const fetchCategories = async (params: CategoryQuery) => {
  const response = await api.get<ApiListResponse<Category[]>>("/categories/get-categories", {
    params,
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const fetchCategory = async (id: string) => {
  const response = await api.get<{ data: Category }>(`/categories/get-category/${id}`);
  return response.data.data;
};

export const createCategory = async (input: CategoryInput) => {
  const response = await api.post<{ data: Category }>("/categories/create-category", input);
  return response.data.data;
};

export const updateCategory = async ({
  id,
  ...input
}: CategoryInput & { id: string }) => {
  const response = await api.patch<{ data: Category }>(
    `/categories/update-category/${id}`,
    input
  );
  return response.data.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete<{ data: Category }>(`/categories/delete-category/${id}`);
  return response.data.data;
};

export const createFeedback = async (input: {
  complaintId: string;
  rating: number;
  comment?: string;
}) => {
  const response = await api.post<{ data: Feedback }>("/feedback/create-feedback", input);
  return response.data.data;
};
