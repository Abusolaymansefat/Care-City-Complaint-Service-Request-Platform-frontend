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