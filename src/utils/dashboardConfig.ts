import {
  TrendingUp,
  Inventory,
  People,
  ConfirmationNumber,
  RequestPage,
  CheckCircle,
  PendingActions,
  AttachMoney,
  Assessment,
  AdminPanelSettings,
} from "@mui/icons-material";

export interface StatCard {
  title: string;
  value: string;
  icon: any;
  colorKey: "primary" | "warning" | "success" | "info" | "error";
}

export interface QuickStatItem {
  title: string;
  value: string | number;
  colorKey: "primary" | "warning" | "success" | "info" | "error" | "text";
}

export interface DashboardConfig {
  welcome: {
    title: string;
    subtitle: string;
  };
  stats: StatCard[];
  quickStats: QuickStatItem[];
  showRecentActivity: boolean;
}

export const getDashboardConfig = (role: string): DashboardConfig => {
  const configs: { [key: string]: DashboardConfig } = {
    ADMIN: {
      welcome: {
        title: "Welcome back, Admin!",
        subtitle: "Here's what's happening with your inventory today.",
      },
      stats: [
        {
          title: "Total Assets",
          value: "245",
          icon: Inventory,
          colorKey: "primary",
        },
        {
          title: "Active Requests",
          value: "12",
          icon: ConfirmationNumber,
          colorKey: "warning",
        },
        {
          title: "Total Users",
          value: "48",
          icon: People,
          colorKey: "success",
        },
        {
          title: "Growth",
          value: "+23%",
          icon: TrendingUp,
          colorKey: "info",
        },
      ],
      quickStats: [
        {
          title: "Pending Approvals",
          value: 8,
          colorKey: "text",
        },
        {
          title: "Low Stock Items",
          value: 5,
          colorKey: "warning",
        },
        {
          title: "Active Users",
          value: 42,
          colorKey: "success",
        },
      ],
      showRecentActivity: true,
    },

    EMPLOYEE: {
      welcome: {
        title: "Welcome back!",
        subtitle: "Track your requests and view available assets.",
      },
      stats: [
        {
          title: "My Requests",
          value: "5",
          icon: RequestPage,
          colorKey: "primary",
        },
        {
          title: "Pending",
          value: "2",
          icon: PendingActions,
          colorKey: "warning",
        },
        {
          title: "Approved",
          value: "3",
          icon: CheckCircle,
          colorKey: "success",
        },
        {
          title: "Available Assets",
          value: "245",
          icon: Inventory,
          colorKey: "info",
        },
      ],
      quickStats: [
        {
          title: "Pending Requests",
          value: 2,
          colorKey: "warning",
        },
        {
          title: "Approved This Month",
          value: 3,
          colorKey: "success",
        },
        {
          title: "Total Requests",
          value: 5,
          colorKey: "text",
        },
      ],
      showRecentActivity: true,
    },

    PMO: {
      welcome: {
        title: "Welcome back, PMO!",
        subtitle: "Manage requests and view available assets.",
      },
      stats: [
        {
          title: "My Requests",
          value: "8",
          icon: RequestPage,
          colorKey: "primary",
        },
        {
          title: "Requests to Approve",
          value: "15",
          icon: PendingActions,
          colorKey: "warning",
        },
        {
          title: "Approved Requests",
          value: "42",
          icon: CheckCircle,
          colorKey: "success",
        },
        {
          title: "Available Assets",
          value: "245",
          icon: Inventory,
          colorKey: "info",
        },
      ],
      quickStats: [
        {
          title: "Pending Approvals",
          value: 15,
          colorKey: "warning",
        },
        {
          title: "My Pending Requests",
          value: 3,
          colorKey: "text",
        },
        {
          title: "Approved This Week",
          value: 12,
          colorKey: "success",
        },
      ],
      showRecentActivity: true,
    },

    SENIOR_PMO: {
      welcome: {
        title: "Welcome back, Senior PMO!",
        subtitle: "Oversee all operations and manage critical approvals.",
      },
      stats: [
        {
          title: "Total Requests",
          value: "85",
          icon: RequestPage,
          colorKey: "primary",
        },
        {
          title: "Critical Approvals",
          value: "8",
          icon: AdminPanelSettings,
          colorKey: "error",
        },
        {
          title: "Team Performance",
          value: "94%",
          icon: Assessment,
          colorKey: "success",
        },
        {
          title: "Total Assets",
          value: "245",
          icon: Inventory,
          colorKey: "info",
        },
      ],
      quickStats: [
        {
          title: "Critical Pending",
          value: 8,
          colorKey: "error",
        },
        {
          title: "PMO Requests",
          value: 15,
          colorKey: "warning",
        },
        {
          title: "Approved Today",
          value: 24,
          colorKey: "success",
        },
      ],
      showRecentActivity: true,
    },

    FINANCE: {
      welcome: {
        title: "Welcome back, Finance!",
        subtitle: "Manage financial requests and inventory budgets.",
      },
      stats: [
        {
          title: "Finance Requests",
          value: "18",
          icon: AttachMoney,
          colorKey: "primary",
        },
        {
          title: "Pending Approval",
          value: "6",
          icon: PendingActions,
          colorKey: "warning",
        },
        {
          title: "My Tickets",
          value: "4",
          icon: ConfirmationNumber,
          colorKey: "success",
        },
        {
          title: "Budget Status",
          value: "85%",
          icon: Assessment,
          colorKey: "info",
        },
      ],
      quickStats: [
        {
          title: "Pending Requests",
          value: 6,
          colorKey: "warning",
        },
        {
          title: "Approved This Month",
          value: 12,
          colorKey: "success",
        },
        {
          title: "Total Budget Used",
          value: "85%",
          colorKey: "text",
        },
      ],
      showRecentActivity: true,
    },
  };

  return configs[role] || configs.EMPLOYEE;
};