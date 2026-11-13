import { api } from "@/lib/api";
import type { PaginationMeta, UpdateUserInput, User, UserQuery } from "@/types";

type ApiListResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};

export const fetchUsers = async (params: UserQuery) => {
  const response = await api.get<ApiListResponse<User[]>>("/user/get-users", { params });
  return { data: response.data.data, meta: response.data.meta };
};

export const updateUser = async ({ id, ...input }: UpdateUserInput) => {
  const response = await api.patch<{ data: User }>(`/user/update-user/${id}`, input);
  return response.data.data;
};
