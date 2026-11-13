"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import { fetchUsers, updateUser } from "@/lib/users";
import type { UpdateUserInput, UserQuery } from "@/types";

export const useUsers = (query: UserQuery = {}) =>
  useQuery({
    queryKey: ["users", query],
    queryFn: () => fetchUsers(query),
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated.");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};
