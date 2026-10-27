"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/auth";
import {
  fetchMyPayments,
  fetchPaymentById,
  fetchPayments,
  initiatePayment,
} from "@/lib/payments";
import type { PaymentQuery } from "@/types";

export const useMyPayments = (query: PaymentQuery) =>
  useQuery({
    queryKey: ["payments", "mine", query],
    queryFn: () => fetchMyPayments(query),
  });

export const useAdminPayments = (query: PaymentQuery) =>
  useQuery({
    queryKey: ["payments", "admin", query],
    queryFn: () => fetchPayments(query),
  });

export const usePayment = (id?: string) =>
  useQuery({
    queryKey: ["payments", id],
    queryFn: () => fetchPaymentById(id as string),
    enabled: Boolean(id),
  });

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (complaintId: string) => initiatePayment(complaintId),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (payment.paymentUrl) {
        toast.success("Redirecting to bKash...");
        window.location.href = payment.paymentUrl;
        return;
      }
      toast.success("Payment initiated");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
};
