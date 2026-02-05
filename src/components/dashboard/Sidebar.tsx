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
  useTheme,
  Avatar,
  Chip,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationByRole } from "@/utils/navigation";
import { getUserData } from "@/utils/auth";

const DRAWER_WIDTH = 260; // Reduced from 280

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { role } = getUserData();

  const navigationItems = getNavigationByRole(role || "EMPLOYEE");

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            backgroundColor: theme.palette.primary.main,
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          K
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              letterSpacing: "-0.02em",
              fontSize: "1.1rem",
            }}
          >
            Kavprime
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.7rem",
            }}
          >
            Inventory System
          </Typography>
        </Box>
      </Box>

      {/* Role Badge */}
      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Chip
          label={role || "EMPLOYEE"}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            fontSize: "0.7rem",
            height: "24px",
          }}
        />
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
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
                    ? theme.palette.primary.main
                    : "transparent",
                  color: isActive
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: isActive
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                  }}
                >
                  <Icon sx={{ fontSize: "1.3rem" }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: "block",
            textAlign: "center",
            fontSize: "0.7rem",
          }}
        >
          © 2024 Kavprime
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
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
            borderRight: `1px solid ${theme.palette.divider}`,
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