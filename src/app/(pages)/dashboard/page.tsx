"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  Cancel,
  HourglassTop,
} from "@mui/icons-material";
import { getUserData } from "@/utils/auth";
import { useGetEmployeeStatsQuery } from "@/redux/services/stats/stats";

export default function DashboardPage() {
  const theme = useTheme();

  // Get employeeId and role (safe on server)
  const { userId, role } = getUserData();

  // Fetch employee stats only if employeeId exists
  const { data: statsData, isLoading, isError } = useGetEmployeeStatsQuery(
    userId ? userId.toString() : ""
  );

  console.log("Dashboard Stats Data:", statsData);

  // Helper function to get color from theme
  const getColor = (colorKey: string) => {
    const colorMap: any = {
      primary: theme.palette.primary.main,
      warning: theme.palette.warning.main,
      success: theme.palette.success.main,
      info: theme.palette.info.main,
      error: theme.palette.error.main,
      text: theme.palette.text.primary,
    };
    return colorMap[colorKey] || theme.palette.primary.main;
  };

  // Stats for top cards
  const stats = statsData
    ? [
        {
          title: "Total Created",
          value: statsData.tickets.total_created || 0,
          colorKey: "primary",
          icon: Assignment,
        },
        {
          title: "Approved",
          value: statsData.tickets.by_status?.APPROVED || 0,
          colorKey: "success",
          icon: CheckCircle,
        },
        {
          title: "Rejected",
          value: statsData.tickets.by_status?.REJECTED || 0,
          colorKey: "error",
          icon: Cancel,
        },
        {
          title: "In Progress",
          value: statsData.tickets.by_status
            ? Object.keys(statsData.tickets.by_status)
                .filter((k) => k.startsWith("INPROGRESS"))
                .reduce((acc, k) => acc + statsData.tickets.by_status[k], 0)
            : 0,
          colorKey: "warning",
          icon: HourglassTop,
        },
      ]
    : [];

  // Quick Stats (assets)
  const quickStats =
    statsData && statsData.assets
      ? [
          {
            title: "Total Assets",
            value: statsData.assets.total_assets_rows || 0,
            colorKey: "primary",
          },
          {
            title: "Quantity Issued",
            value: statsData.assets.total_quantity_issued || 0,
            colorKey: "success",
          },
        ]
      : [];

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
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: "2rem",
          }}
        >
          Welcome, {statsData?.employee?.name || "Employee"}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1rem",
          }}
        >
          Here's your dashboard summary
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const color = getColor(stat.colorKey);

          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                flex: "1 1 calc(25% - 24px)",
                minWidth: "220px",
                p: 3,
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "14px",
                  backgroundColor: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Icon sx={{ color: color, fontSize: 28 }} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontSize: "2rem",
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              >
                {stat.title}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Recent Activity */}
        <Paper
          elevation={0}
          sx={{
            flex: "1 1 65%",
            minWidth: "300px",
            p: 3,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3,
              fontSize: "1.15rem",
            }}
          >
            Recent Activity
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "250px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.95rem",
              }}
            >
              Your recent activity will appear here...
            </Typography>
          </Box>
        </Paper>

        {/* Quick Stats */}
        <Paper
          elevation={0}
          sx={{
            flex: "1 1 30%",
            minWidth: "280px",
            p: 3,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3,
              fontSize: "1.15rem",
            }}
          >
            Quick Stats
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {quickStats.length > 0 ? (
              quickStats.map((item, index) => {
                const color = getColor(item.colorKey);

                return (
                  <Box
                    key={index}
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: color,
                        fontSize: "1.75rem",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                No quick stats available
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
