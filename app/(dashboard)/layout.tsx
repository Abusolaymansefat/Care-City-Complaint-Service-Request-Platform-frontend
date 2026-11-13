import AppSidebar from "@/components/layout/app-sidebar";
import AuthGuard from "@/components/layout/auth-guard";
import DashboardTopbar from "@/components/layout/dashboard-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f3f6fb] dark:bg-background">
        <DashboardTopbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <AuthGuard>{children}</AuthGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}