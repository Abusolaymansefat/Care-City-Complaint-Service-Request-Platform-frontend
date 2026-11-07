import { api } from "@/lib/api";
import type {
  Category,
  Complaint,
  ComplaintQuery,
  Department,
  Feedback,
  PaginationMeta,
} from "@/types";

type ApiListResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};

export const fetchMyComplaints = async (params: ComplaintQuery) => {
  const response = await api.get<ApiListResponse<Complaint[]>>(
    "/complaints/get-my-complaints",
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
