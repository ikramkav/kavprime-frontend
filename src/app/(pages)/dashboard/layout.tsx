"use client";

import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import Sidebar, { DRAWER_WIDTH } from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflow: "hidden",
        }}
      >
        {/* Navbar */}
        <Navbar onMenuClick={handleDrawerToggle} />

        {/* Main Content - SCROLLABLE AREA */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            p: 4,
            overflow: "auto", // This enables scrolling
            height: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}