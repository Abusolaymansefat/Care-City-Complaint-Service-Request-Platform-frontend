import AuthGuard from "@/components/layout/auth-guard";
import RoleComplaintsPage from "@/components/complaints/role-complaints-page";

export default function AssignedComplaintsPage() {
  return (
    <AuthGuard roles={["TECHNICIAN", "DEPARTMENT_OFFICER"]}>
      <RoleComplaintsPage />
    </AuthGuard>
  );
}
