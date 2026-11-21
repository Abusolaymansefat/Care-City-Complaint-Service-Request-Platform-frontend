
import {
  Bell,
  Bot,
  Building2,
  ClipboardList,
  CreditCard,
  FilePlus2,
  History,
  LayoutDashboard,
  ListChecks,
  Settings,
  Tags,
  Search,
  UserCircle,
  Users,
  MessageSquare,
  ChartNoAxesCombined,
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

// ============================================
// Shared Account Navigation
// ============================================

const account: NavGroup = {
  label: "Account",
  items: [
    { title: "History", href: "/history", icon: History },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Profile", href: "/profile", icon: UserCircle },
    { title: "Settings", href: "/settings", icon: Settings },
  ],
};

// ============================================
// Technician Navigation
// ============================================

const technicianGroups: NavGroup[] = [
  {
    label: "Work",
    items: [
      {
        title: "Dashboard",
        href: "/technician/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Assignments",
        href: "/technician/assignments",
        icon: ListChecks,
      },
      {
        title: "Work Updates",
        href: "/technician/work-updates",
        icon: Bell,
      },
      {
        title: "My Complaints",
        href: "/technician/complaints",
        icon: ClipboardList,
      },
      {
        title: "Map & Location",
        href: "/technician/map",
        icon: Search,
      },
      {
        title: "Completed Tasks",
        href: "/technician/completed",
        icon: FilePlus2,
      },
      {
        title: "Payment History",
        href: "/technician/payment-history",
        icon: CreditCard,
      },
      {
        title: "Work History",
        href: "/technician/work-history",
        icon: History,
      },
    ],
  },
  account,
];

// ============================================
// Department Officer Navigation
// ============================================

const departmentOfficerGroups: NavGroup[] = [
  {
    label: "Department Management",
    items: [
      {
        title: "Dashboard",
        href: "/officer/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Complaints",
        href: "/officer/complaints",
        icon: ClipboardList,
      },
      {
        title: "Assignments",
        href: "/officer/assignments",
        icon: ListChecks,
      },
      {
        title: "Payments",
        href: "/officer/payments",
        icon: CreditCard,
      },
      {
        title: "Departments",
        href: "/officer/departments",
        icon: Building2,
      },
      {
        title: "Categories",
        href: "/officer/categories",
        icon: Tags,
      },
      {
        title: "Feedback",
        href: "/officer/feedback",
        icon: MessageSquare,
      },
      {
        title: "Reports & Analytics",
        href: "/officer/reports",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  account,
];

export const navByRole: Record<Role, NavGroup[]> = {
  // Citizen
  CITIZEN: [
    {
      label: "Menu",
      items: [
        {
          title: "Dashboard",
          href: "/citizen/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Departments",
          href: "/citizen/departments",
          icon: Building2,
        },
        {
          title: "Service Requests",
          href: "/citizen/service-requests",
          icon: Tags,
        },
        {
          title: "My Complaints",
          href: "/citizen/complaints",
          icon: ClipboardList,
        },
        {
          title: "Create Poster",
          href: "/citizen/complaints/create-poster",
          icon: FilePlus2,
        },
        {
          title: "Complaint Tracking",
          href: "/citizen/tracking",
          icon: Search,
        },
        {
          title: "AI Issue Guide",
          href: "/citizen/ai",
          icon: Bot,
        },
        {
          title: "Payments",
          href: "/citizen/payments",
          icon: CreditCard,
        },
      ],
    },
    account,
  ],

  // Technician
  TECHNICIAN: technicianGroups,

  // Department Officer
  DEPARTMENT_OFFICER: departmentOfficerGroups,

  // Legacy Officer
  OFFICER: [account],

  // Admin
  ADMIN: [
    {
      label: "Administration",
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "All Complaints",
          href: "/admin/complaints",
          icon: ClipboardList,
        },
        {
          title: "Departments",
          href: "/admin/departments",
          icon: Building2,
        },
        {
          title: "Categories",
          href: "/admin/categories",
          icon: Tags,
        },
        {
          title: "Assignments",
          href: "/admin/assignments",
          icon: ListChecks,
        },
        {
          title: "Payments",
          href: "/admin/payments",
          icon: CreditCard,
        },
        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
        },
      ],
    },
    account,
  ],
};
