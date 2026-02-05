"use client";

import React from "react";
import { Box, Typography, Container, Paper, useTheme } from "@mui/material";
import {
  PersonAdd,
  AddBox,
  TaskAlt,
  TrendingUp,
} from "@mui/icons-material";

const steps = [
  {
    icon: PersonAdd,
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up and get assigned a role based on your responsibilities in the organization.",
  },
  {
    icon: AddBox,
    number: "02",
    title: "Add Inventory Items",
    description:
      "Add all your assets with detailed information including quantities, prices, and vendors.",
  },
  {
    icon: TaskAlt,
    number: "03",
    title: "Manage Requests",
    description:
      "Generate requests for assets and manage approvals through a streamlined workflow.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Track & Optimize",
    description:
      "Monitor your inventory levels, analyze trends, and optimize your operations.",
  },
];

export default function HowItWorksSection() {
  const theme = useTheme();

  return (
    <Box
      id="how-it-works"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.paper,
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
            How It Works
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Get started in four simple steps and transform your inventory
            management
          </Typography>
        </Box>

        {/* Steps */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: isEven ? "row" : "row-reverse" },
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {/* Icon Side */}
                <Box
                  sx={{
                    flex: "0 0 auto",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "24px",
                      backgroundColor: `${theme.palette.primary.main}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 48,
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -16,
                        right: -16,
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                      }}
                    >
                      {step.number}
                    </Box>
                  </Box>
                </Box>

                {/* Content Side */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 4,
                    borderRadius: "20px",
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: { xs: "center", md: isEven ? "left" : "right" },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      fontSize: "1.05rem",
                    }}
                  >
                    {step.description}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}