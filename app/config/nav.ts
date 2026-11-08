import {
  Bot,
  Bell,
  Building2,
  ClipboardList,
  CreditCard,
  FilePlus2,
  LayoutDashboard,
  ListChecks,
  Settings,
  Tags,
  Search,
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
  items: [
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Profile", href: "/profile", icon: UserCircle },
    { title: "Settings", href: "/settings", icon: Settings },
  ],
};

const legacyOfficerGroups: NavGroup[] = [
  {
    label: "Menu",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  account,
];

const technicianGroups: NavGroup[] = [
  {
    label: "Work",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "My Assignments", href: "/complaints", icon: ListChecks },
    ],
  },
  account,
];

const departmentOfficerGroups: NavGroup[] = [
  {
    label: "Department",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Department Complaints", href: "/complaints", icon: ListChecks },
    ],
  },
  account,
];

export const navByRole: Record<Role, NavGroup[]> = {
  CITIZEN: [
    {
      label: "Menu",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Departments", href: "/citizen/departments", icon: Building2 },
        { title: "Categories", href: "/citizen/categories", icon: Tags },
        { title: "My Complaints", href: "/citizen/complaints", icon: ClipboardList },
        { title: "Create Poster", href: "/citizen/complaints/create-poster", icon: FilePlus2 },
        { title: "Track Complaint", href: "/citizen/tracking", icon: Search },
        { title: "AI Issue Guide", href: "/citizen/ai", icon: Bot },
        { title: "Payments", href: "/payments", icon: CreditCard },
      ],
    },
    account,
  ],
  TECHNICIAN: technicianGroups,
  DEPARTMENT_OFFICER: departmentOfficerGroups,
  OFFICER: legacyOfficerGroups,
  ADMIN: [
    {
      label: "Admin",
      items: [
        { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { title: "All Complaints", href: "/admin/complaints", icon: ClipboardList },
        { title: "Users", href: "/admin/users", icon: Users },
      ],
    },
    account,
  ],
};