import AuthGuard from "@/components/layout/auth-guard";
import RoleComplaintsPage from "@/components/complaints/role-complaints-page";

export default function AdminComplaintsPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <RoleComplaintsPage admin />
    </AuthGuard>
  );
}
