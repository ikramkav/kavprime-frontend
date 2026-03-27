"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  Grid,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import {
  Add,
  Inventory2,
  TrendingUp,
  TrendingDown,
  Assignment,
  Warning,
  PersonAdd,
} from "@mui/icons-material";
import { getUserData } from "@/utils/auth";
import { useGetEmployeeStatsQuery } from "@/redux/services/stats/stats";
import { useGetTicketsListQuery } from "@/redux/services/tickets/ticketsApi";
import { useRouter } from "next/navigation";
import { Chip } from "@mui/material";
import {
  AcceptIcon,
  CreatedIcon,
  RejectIcon,
  WaitingIcon,
} from "@/assets/icons";

export default function DashboardPage() {
  const theme = useTheme();
  const router = useRouter();
  const { userId, role } = getUserData();
  const isAdmin = role === "ADMIN";

  const { data: statsData, isLoading, isError } = useGetEmployeeStatsQuery(
    userId ? userId.toString() : ""
  );

  const { data: myTickets = [] } = useGetTicketsListQuery(
    userId ? userId.toString() : "",
    { skip: !userId || isAdmin }
  );

  const recentTickets = Array.isArray(myTickets)
    ? [...myTickets]
        .filter((t: any) => t.employee_id === userId || t.employee_id === Number(userId))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    : [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = statsData
    ? [
        {
          title: "Total Created",
          value: statsData.tickets.total_created || 0,
          color: theme.palette.primary.main,
          bg: "#EEF2FF",
          icon: CreatedIcon,
          change: "+12%",
          positive: true,
        },
        {
          title: "Approved",
          value: (statsData.tickets.by_status?.APPROVED || 0) + (statsData.tickets.by_status?.COMPLETED || 0),
          color: theme.palette.success.main,
          bg: "#ECFDF5",
          icon: AcceptIcon,
          change: "0%",
          positive: true,
        },
        {
          title: "Rejected",
          value: statsData.tickets.by_status?.REJECTED || 0,
          color: theme.palette.error.main,
          bg: "#FEF2F2",
          icon: RejectIcon,
          change: "-5%",
          positive: false,
        },
        {
          title: "In Progress",
          value: statsData.tickets.by_status
            ? Object.keys(statsData.tickets.by_status)
                .filter((k) => k.startsWith("INPROGRESS"))
                .reduce((acc, k) => acc + statsData.tickets.by_status[k], 0)
            : 0,
          color: theme.palette.warning.main,
          bg: "#FFFBEB",
          icon: WaitingIcon,
          change: "-8%",
          positive: false,
        },
      ]
    : [];

  const quickActions = [
    {
      label: "New Request",
      description: "Create inventory request",
      icon: Add,
      color: theme.palette.primary.main,
      bg: "#EEF2FF",
      onClick: () => router.push("/dashboard/tickets"),
    },
    {
      label: "Add Item",
      description: "Add to inventory",
      icon: Inventory2,
      color: "#7C3AED",
      bg: "#F5F3FF",
      onClick: () => router.push("/dashboard/inventory"),
    },
  ];

  const recentActivities = [
    {
      title: "Inventory Request Created",
      description: "Request #1234 has been submitted for approval",
      time: "2 min ago",
      icon: Assignment,
      color: theme.palette.primary.main,
      bg: "#EEF2FF",
    },
    {
      title: "Stock Level Alert",
      description: "Item 'Office Supplies' is running low",
      time: "1 hour ago",
      icon: Warning,
      color: theme.palette.warning.main,
      bg: "#FFFBEB",
    },
    {
      title: "New User Added",
      description: "John Doe has been added to the system",
      time: "3 hours ago",
      icon: PersonAdd,
      color: theme.palette.success.main,
      bg: "#ECFDF5",
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography color="error">Failed to load dashboard stats.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Welcome Banner */}
      <Box
        sx={{
          borderRadius: "16px",
          background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
          p: { xs: 3, sm: 4 },
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            right: 80,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9, fontSize: "0.9rem" }}>
          Welcome back! 👋
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
          {getGreeting()}, {statsData?.employee?.name || "Admin"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, fontSize: "0.9rem" }}>
          Here's what's happening with your inventory system today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5, fontSize: "2rem" }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}
                >
                  {stat.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {stat.positive ? (
                    <TrendingUp sx={{ fontSize: 14, color: theme.palette.success.main }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14, color: theme.palette.error.main }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: stat.positive ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 600,
                    }}
                  >
                    {stat.change}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    vs last month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={2}>
        {/* Quick Actions - Admin only */}
        {isAdmin && <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: "1.05rem" }}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Box
                    key={index}
                    onClick={action.onClick}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: "12px",
                      border: `1px solid ${theme.palette.divider}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        borderColor: action.color,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        backgroundColor: action.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ color: action.color, fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {action.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {action.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>}

        {/* My Recent Tickets - Non-admin only */}
        {!isAdmin && (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.05rem" }}>
                  My Recent Tickets
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.primary.main, cursor: "pointer", fontWeight: 500 }}
                  onClick={() => router.push("/dashboard/tickets")}
                >
                  View All
                </Typography>
              </Box>

              {recentTickets.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No tickets created yet. Click "View All" to create your first ticket.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {recentTickets.map((ticket) => {
                    const statusColors: Record<string, { bg: string; color: string }> = {
                      APPROVED: { bg: "#ECFDF5", color: "#059669" },
                      REJECTED: { bg: "#FEF2F2", color: "#DC2626" },
                      PENDING: { bg: "#FFFBEB", color: "#D97706" },
                      INPROGRESS: { bg: "#EEF2FF", color: "#4F46E5" },
                    };
                    const statusKey = Object.keys(statusColors).find((k) =>
                      ticket.status?.toUpperCase().includes(k)
                    ) || "PENDING";
                    const statusStyle = statusColors[statusKey] || { bg: "#F3F4F6", color: "#6B7280" };

                    return (
                      <Box
                        key={ticket.id}
                        onClick={() => router.push("/dashboard/tickets")}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          borderRadius: "10px",
                          border: `1px solid ${theme.palette.divider}`,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: theme.palette.action.hover },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{ticket.id} · {ticket.ticket_type} ·{" "}
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            flexShrink: 0,
                            ml: 2,
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </Grid>
        )}

        {/* Recent Activity - Admin only */}
        {isAdmin && <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.05rem" }}>
                Recent Activity
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.primary.main, cursor: "pointer", fontWeight: 500 }}
                onClick={() => router.push("/dashboard/tickets")}
              >
                View All
              </Typography>
            </Box>
            <Stack spacing={2}>
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "10px",
                        backgroundColor: activity.bg,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ color: activity.color, fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {activity.description}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary, flexShrink: 0 }}
                    >
                      {activity.time}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>}
      </Grid>
    </Stack>
  );
}
