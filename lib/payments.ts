import { api } from "@/lib/api";
import type { PaginationMeta, Payment, PaymentQuery } from "@/types";

type ApiListResponse<T> = {
  data: T;
  meta?: PaginationMeta;
};

export const fetchMyPayments = async (params: PaymentQuery) => {
  const res = await api.get<ApiListResponse<Payment[]>>("/payments/get-my-payments", {
    params,
  });
  return { data: res.data.data, meta: res.data.meta };
};

export const fetchPayments = async (params: PaymentQuery) => {
  const res = await api.get<ApiListResponse<Payment[]>>("/payments/get-payments", {
    params,
  });
  return { data: res.data.data, meta: res.data.meta };
};

export const fetchPaymentById = async (id: string) => {
  const res = await api.get<{ data: Payment }>(`/payments/get-payment/${id}`);
  return res.data.data;
};

export const initiatePayment = async (complaintId: string) => {
  const res = await api.post<{ data: Payment }>("/payments/initiate-payment", {
    complaintId,
  });
  return res.data.data;
};
