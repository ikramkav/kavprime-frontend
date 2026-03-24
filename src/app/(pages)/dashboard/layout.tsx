"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, useTheme } from "@mui/material";
import Sidebar, { DRAWER_WIDTH } from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import { isAuthenticated } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.replace("/auth/login");
    }
  }, [authenticated, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!authenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
