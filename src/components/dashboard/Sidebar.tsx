"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationByRole } from "@/utils/navigation";
import { getUserData } from "@/utils/auth";
import { Settings, Logout } from "@mui/icons-material";
import { clearUserData } from "@/utils/auth";
import { toast } from "react-toastify";

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = getUserData();

  const navigationItems = getNavigationByRole(role || "EMPLOYEE");

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    clearUserData();
    toast.success("Logged out successfully");
    router.replace("/auth/login");
  };

  const SIDEBAR_BG = "linear-gradient(180deg, #1a237e 0%, #1565c0 60%, #1976d2 100%)";

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: SIDEBAR_BG,
      }}
    >
      {/* Logo Section */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
            K
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}
          >
            Kavprime
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.7rem" }}>
            Inventory System
          </Typography>
        </Box>
      </Box>

      {/* Role Badge */}
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Chip
          label={role || "EMPLOYEE"}
          size="small"
          sx={{
            backgroundColor: "#F59E0B",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.65rem",
            height: "22px",
            letterSpacing: "0.05em",
          }}
        />
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 1.5, py: 0.5 }}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: "10px",
                  py: 1,
                  px: 1.5,
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.18)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(255,255,255,0.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "rgba(255,255,255,0.85)" }}>
                  <Icon sx={{ fontSize: "1.25rem" }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: "#fff",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom: Settings & Logout */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mx: 2 }} />
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation("/dashboard/settings")}
            sx={{
              borderRadius: "10px",
              py: 1,
              px: 1.5,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "rgba(255,255,255,0.75)" }}>
              <Settings sx={{ fontSize: "1.25rem" }} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: "10px",
              py: 1,
              px: 1.5,
              "&:hover": { backgroundColor: "rgba(239,68,68,0.15)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#F87171" }}>
              <Logout sx={{ fontSize: "1.25rem" }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: "#F87171" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
