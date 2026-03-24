import {
  AccountManagementIcon,
  DashboardIcon,
  InventoryIcon,
  ReportsIcon,
  TicketIcon,
  VendorsIcon,
  WorkflowIcon,
} from "@/assets/icons";
import { AttachMoney, Visibility } from "@mui/icons-material";
import type { ElementType } from "react";

export interface NavigationItem {
  title: string;
  path: string;
  icon: ElementType;
}

export const getNavigationByRole = (role: string): NavigationItem[] => {
  const navigation: { [key: string]: NavigationItem[] } = {
    ADMIN: [
      { title: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      {
        title: "Account Management",
        path: "/dashboard/accounts",
        icon: AccountManagementIcon,
      },
      {
        title: "Inventory Management",
        path: "/dashboard/inventory",
        icon: InventoryIcon,
      },
      {
        title: "Ticket Management",
        path: "/dashboard/tickets",
        icon: TicketIcon,
      },
      { title: "Workflows", path: "/dashboard/workflow", icon: WorkflowIcon },
      { title: "Vendors", path: "/dashboard/vendors", icon: VendorsIcon },
      { title: "Reports", path: "/dashboard/reports", icon: ReportsIcon },
    ],
    EMPLOYEE: [
      { title: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { title: "View Assets", path: "/dashboard/assets", icon: Visibility },
      {
        title: "Ticket Management",
        path: "/dashboard/tickets",
        icon: TicketIcon,
      },
    ],
    PMO: [
      { title: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { title: "View Assets", path: "/dashboard/assets", icon: Visibility },
      {
        title: "Ticket Management",
        path: "/dashboard/tickets",
        icon: TicketIcon,
      },
    ],
    SENIOR_PMO: [
      { title: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { title: "View All Assets", path: "/dashboard/assets", icon: Visibility },
      {
        title: "Ticket Management",
        path: "/dashboard/tickets",
        icon: TicketIcon,
      },
    ],
    FINANCE: [
      { title: "Dashboard", path: "/dashboard", icon: DashboardIcon },
      { title: "View Assets", path: "/dashboard/assets", icon: Visibility },
      {
        title: "Ticket Management",
        path: "/dashboard/tickets",
        icon: TicketIcon,
      },
      {
        title: "Finance Management",
        path: "/dashboard/finance-management",
        icon: AttachMoney,
      },
      { title: "Reports", path: "/dashboard/reports", icon: ReportsIcon },
    ],
  };

  return navigation[role] || navigation.EMPLOYEE;
};
