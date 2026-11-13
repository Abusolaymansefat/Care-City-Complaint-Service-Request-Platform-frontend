import AuthGuard from "@/components/layout/auth-guard";

export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={["ADMIN"]}>{children}</AuthGuard>;
}