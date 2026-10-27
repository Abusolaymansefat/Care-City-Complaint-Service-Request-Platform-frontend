import {
  Building2,
  ClipboardList,
  CreditCard,
  FilePlus2,
  LayoutDashboard,
  ListChecks,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

const account: NavGroup = {
  label: "Account",
  items: [{ title: "Profile", href: "/profile", icon: UserCircle }],
};

export const navByRole: Record<Role, NavGroup[]> = {
  CITIZEN: [
    {
      label: "Menu",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "My Complaints", href: "/complaints", icon: ClipboardList },
        { title: "Payments", href: "/payments", icon: CreditCard },
        { title: "Report Issue", href: "/complaints/new", icon: FilePlus2 },
      ],
    },
    account,
  ],
  OFFICER: [
    {
      label: "Menu",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Assigned Complaints", href: "/complaints", icon: ListChecks },
      ],
    },
    account,
  ],
  ADMIN: [
    {
      label: "Admin",
      items: [
        { title: "Overview", href: "/admin", icon: LayoutDashboard },
        { title: "All Complaints", href: "/admin/complaints", icon: ClipboardList },
        { title: "Payments", href: "/admin/payments", icon: CreditCard },
        { title: "Departments", href: "/admin/departments", icon: Building2 },
        { title: "Users", href: "/admin/users", icon: Users },
      ],
    },
    account,
  ],
};