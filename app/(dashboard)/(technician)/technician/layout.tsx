import AuthGuard from "@/components/layout/auth-guard";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={["TECHNICIAN"]}>{children}</AuthGuard>;
}