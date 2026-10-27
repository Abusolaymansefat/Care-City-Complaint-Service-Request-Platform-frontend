export type Role = "CITIZEN" | "OFFICER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  emailVerified: boolean;
  imageUrl?: string | null;
  needPasswordChange?: boolean;
  departmentId?: string | null;
  department?: { id: string; name: string } | null;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type PaymentStatus = "PENDING" | "INITIATED" | "PAID" | "FAILED" | "CANCELLED";
export type PaymentTiming = "AFTER_SUBMISSION" | "AFTER_COMPLETION";

export interface Payment {
  id: string;
  userId: string;
  complaintId: string;
  provider: "BKASH";
  status: PaymentStatus;
  timing: PaymentTiming;
  amount: string | number;
  currency: string;
  invoiceNumber: string;
  bkashPaymentId?: string | null;
  transactionId?: string | null;
  paymentUrl?: string | null;
  paidAt?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
  complaint?: {
    id: string;
    trackingCode: string;
    title: string;
    status: string;
    paymentRequired: boolean;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaymentQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  complaintId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}