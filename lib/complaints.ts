import { api } from "@/lib/api";
import type {
  Category,
  Assignment,
  Complaint,
  ComplaintQuery,
  CreateComplaintInput,
  Department,
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
  input.images?.forEach((image) => body.append("images", image));

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

export const fetchComplaint = async (id: string) => {
  const response = await api.get<{ data: Complaint }>(`/complaints/get-complaint/${id}`);
  return response.data.data;
};

export const fetchCategories = async (params: { limit?: number; isActive?: boolean }) => {
  const response = await api.get<ApiListResponse<Category[]>>("/categories/get-categories", {
    params,
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const fetchDepartments = async (params: { limit?: number }) => {
  const response = await api.get<ApiListResponse<Department[]>>("/departments/get-departments", {
    params,
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const createFeedback = async (input: {
  complaintId: string;
  rating: number;
  comment?: string;
}) => {
  const response = await api.post<{ data: Feedback }>("/feedback/create-feedback", input);
  return response.data.data;
};
