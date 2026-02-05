"use client";

import React from "react";
import { Box, Typography, Container, Paper, useTheme } from "@mui/material";
import {
  Inventory,
  People,
  Assignment,
  Analytics,
  Security,
  Speed,
} from "@mui/icons-material";

const features = [
  {
    icon: Inventory,
    title: "Inventory Tracking",
    description:
      "Real-time tracking of all your assets with detailed information and availability status.",
  },
  {
    icon: People,
    title: "User Management",
    description:
      "Role-based access control for Admin, Employee, PMO, and Finance teams.",
  },
  {
    icon: Assignment,
    title: "Request Management",
    description:
      "Streamlined request workflow with approval system and status tracking.",
  },
  {
    icon: Analytics,
    title: "Analytics & Reports",
    description:
      "Comprehensive dashboards and reports to track inventory performance.",
  },
  {
    icon: Security,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security to protect your sensitive inventory data.",
  },
  {
    icon: Speed,
    title: "Fast & Efficient",
    description:
      "Lightning-fast performance with optimized database queries and caching.",
  },
];

export default function FeaturesSection() {
  const theme = useTheme();

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3rem" },
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Everything you need to manage your inventory efficiently and
            effectively
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  flex: "1 1 calc(33.333% - 32px)",
                  minWidth: "280px",
                  maxWidth: "350px",
                  p: 4,
                  borderRadius: "20px",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    backgroundColor: `${theme.palette.primary.main}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Icon
                    sx={{ fontSize: 32, color: theme.palette.primary.main }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}