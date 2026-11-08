import AuthGuard from "@/components/layout/auth-guard";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={["DEPARTMENT_OFFICER"]}>{children}</AuthGuard>;
}