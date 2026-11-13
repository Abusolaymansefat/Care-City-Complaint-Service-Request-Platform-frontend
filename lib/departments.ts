import { api } from "@/lib/api";
import type { Department, DepartmentInput, DepartmentQuery, PaginationMeta } from "@/types";

type ApiListResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};

export const fetchDepartments = async (params: DepartmentQuery) => {
  const response = await api.get<ApiListResponse<Department[]>>("/departments/get-departments", {
    params,
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const fetchDepartment = async (id: string) => {
  const response = await api.get<{ data: Department }>(
    `/departments/get-departmentBy-by/${id}`
  );
  return response.data.data;
};

export const createDepartment = async (input: DepartmentInput) => {
  const response = await api.post<{ data: Department }>("/departments/create-department", input);
  return response.data.data;
};

export const updateDepartment = async ({
  id,
  ...input
}: DepartmentInput & { id: string }) => {
  const response = await api.patch<{ data: Department }>(
    `/departments/update-department/${id}`,
    input
  );
  return response.data.data;
};

export const deleteDepartment = async (id: string) => {
  const response = await api.delete<{ data: Department }>(
    `/departments/delete-department/${id}`
  );
  return response.data.data;
};
