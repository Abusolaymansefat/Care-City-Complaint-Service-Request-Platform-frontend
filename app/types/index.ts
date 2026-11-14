export type Role =
  | "CITIZEN"
  | "TECHNICIAN"
  | "DEPARTMENT_OFFICER"
  | "OFFICER"
  | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  imageUrl?: string | null;
  needPasswordChange?: boolean;
  departmentId?: string | null;
  department?: { id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ManagedUserRole = Exclude<Role, "OFFICER">;

export interface UserQuery {
  searchTerm?: string;
  role?: ManagedUserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface UpdateUserInput {
  id: string;
  role?: ManagedUserRole;
  status?: UserStatus;
  departmentId?: string | null;
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
  period?: PaymentPeriod;
  sortBy?: "createdAt" | "updatedAt" | "amount" | "status";
  sortOrder?: "asc" | "desc";
}

export type PaymentPeriod = "all" | "7d" | "1m" | "1y";

export interface PaymentStats {
  period: PaymentPeriod;
  totalAmount: string;
  paidCount: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type NotificationType =
  | "GENERAL"
  | "COMPLAINT_CREATED"
  | "COMPLAINT_STATUS_CHANGED"
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_STATUS_CHANGED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_PAID"
  | "PAYMENT_FAILED"
  | "FEEDBACK_SUBMITTED";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED"
  | "REOPENED"
  | "CANCELLED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  slaHours: number;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  department?: { id: string; name: string } | null;
}

export interface CategoryQuery {
  searchTerm?: string;
  departmentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "slaHours" | "isActive" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CategoryInput {
  name: string;
  description?: string;
  slaHours: number;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentInput {
  name: string;
  description?: string;
}

export interface DepartmentQuery {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "isActive" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  comment?: string | null;
  createdAt: string;
  updater?: { id: string; name: string; role: Role } | null;
}

export interface Complaint {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrls?: string[];
  videoUrls?: string[];
  status: ComplaintStatus;
  priority: Priority;
  paymentRequired: boolean;
  slaDueAt?: string | null;
  resolvedAt?: string | null;
  citizenId: string;
  departmentId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slaHours: number } | null;
  department?: { id: string; name: string } | null;
  citizen?: { id: string; name: string; email: string } | null;
  updates?: ComplaintUpdate[];
  payments?: Payment[];
}

export interface PublicComplaint {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  address: string;
  imageUrls: string[];
  priority: Priority;
  status: ComplaintStatus;
  createdAt: string;
  category?: { id: string; name: string } | null;
}

export interface UpdateComplaintInput {
  id: string;
  title: string;
  description: string;
  address: string;
  categoryId?: string;
}

export type AssignmentStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface Assignment {
  id: string;
  complaintId: string;
  technicianId: string;
  assignedById: string;
  status: AssignmentStatus;
  notes?: string | null;
  assignedAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  complaint: {
    id: string;
    trackingCode: string;
    title: string;
    status: ComplaintStatus;
  };
  technician?: { id: string; name: string; email: string };
  assignedBy?: { id: string; name: string; email: string };
}

export interface CreateAssignmentInput {
  complaintId: string;
  technicianId: string;
  notes?: string;
}

export interface ComplaintQuery {
  searchTerm?: string;
  categoryId?: string;
  departmentId?: string;
  status?: ComplaintStatus;
  priority?: Priority;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  categoryId: string;
  videos?: File[];
  images?: File[];
}

export interface Feedback {
  id: string;
  complaintId: string;
  citizenId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  complaint?: { id: string; trackingCode: string; title: string; status: ComplaintStatus } | null;

}