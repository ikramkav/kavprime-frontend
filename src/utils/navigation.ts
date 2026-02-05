import {
  Dashboard,
  People,
  Inventory,
  ConfirmationNumber,
  Visibility,
  RequestPage,
  ManageAccounts,
  AttachMoney,
  AdminPanelSettings,
  Assessment,
} from "@mui/icons-material";
import WorkspacesIcon from '@mui/icons-material/Workspaces';

export interface NavigationItem {
  title: string;
  path: string;
  icon: any;
}

export const getNavigationByRole = (role: string): NavigationItem[] => {
  const navigation: { [key: string]: NavigationItem[] } = {
    ADMIN: [
      { title: "Dashboard", path: "/dashboard", icon: Dashboard },
      { title: "Account Management", path: "/dashboard/accounts", icon: ManageAccounts },
      { title: "Inventory Management", path: "/dashboard/inventory", icon: Inventory },
      { title: "Ticket Management", path: "/dashboard/tickets", icon: ConfirmationNumber },
      { title: "Workflows", path: "/dashboard/workflow", icon: WorkspacesIcon },
    ],
    EMPLOYEE: [
      { title: "Dashboard", path: "/dashboard", icon: Dashboard },
      { title: "View Assets", path: "/dashboard/assets", icon: Visibility },
      { title: "Ticket Management", path: "/dashboard/tickets", icon: ConfirmationNumber },
    ],
    PMO: [
      { title: "Dashboard", path: "/dashboard", icon: Dashboard },
      { title: "View Assets", path: "/dashboard/assets", icon: Visibility },
      { title: "Ticket Management", path: "/dashboard/tickets", icon: ConfirmationNumber },
    ],
    SENIOR_PMO: [
      { title: "Dashboard", path: "/dashboard", icon: Dashboard },
      { title: "View All Assets", path: "/dashboard/assets", icon: Visibility },
      { title: "Ticket Management", path: "/dashboard/tickets", icon: ConfirmationNumber },
    ],
    FINANCE: [
      { title: "Dashboard", path: "/dashboard", icon: Dashboard },
      { title: "View Assets", path: "/dashboard/assets", icon: Visibility },
      { title: "Ticket Management", path: "/dashboard/tickets", icon: ConfirmationNumber },
      { title: "Finance Management", path: "/dashboard/finance-management", icon: AttachMoney },
    ],
  };

  return navigation[role] || navigation.EMPLOYEE;
};