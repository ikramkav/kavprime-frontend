"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Divider,
  Badge,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Logout,
  Settings,
  AccountCircle,
  Notifications,
  NavigateNext,
} from "@mui/icons-material";
import { useThemeMode } from "@/theme/themeProvider";
import { useRouter, usePathname } from "next/navigation";
import { clearUserData, getUserData } from "@/utils/auth";
import { toast } from "react-toastify";
import { getNavigationByRole } from "@/utils/navigation";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const router = useRouter();
  const pathname = usePathname();
  const { role } = getUserData();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearUserData();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
    handleMenuClose();
  };

  // Get navigation items for current role
  const navigationItems = getNavigationByRole(role || "EMPLOYEE");

  // Get page title based on current route
  const getPageTitle = () => {
    // Find matching navigation item
    const currentItem = navigationItems.find((item) => item.path === pathname);
    
    if (currentItem) {
      return currentItem.title;
    }

    // If no exact match, try to find partial match (for nested routes)
    const partialMatch = navigationItems.find((item) => 
      pathname.startsWith(item.path) && item.path !== "/dashboard"
    );

    if (partialMatch) {
      return partialMatch.title;
    }

    return "Dashboard";
  };

  // Generate breadcrumbs from navigation structure
  const getBreadcrumbs = () => {
    const breadcrumbs: { label: string; path: string }[] = [];

    // Always start with Dashboard
    breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });

    // If not on dashboard, add current page
    if (pathname !== "/dashboard") {
      const currentItem = navigationItems.find((item) => item.path === pathname);
      
      if (currentItem) {
        breadcrumbs.push({ label: currentItem.title, path: currentItem.path });
      } else {
        // For nested routes that don't have exact match
        const partialMatch = navigationItems.find((item) => 
          pathname.startsWith(item.path) && item.path !== "/dashboard"
        );

        if (partialMatch) {
          breadcrumbs.push({ label: partialMatch.title, path: partialMatch.path });
          
          // Add the nested page name if it exists
          const nestedPart = pathname.replace(partialMatch.path, "").split("/").filter(Boolean)[0];
          if (nestedPart) {
            const nestedLabel = nestedPart
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            breadcrumbs.push({ label: nestedLabel, path: pathname });
          }
        } else {
          // Fallback: create breadcrumb from URL
          const label = pathname
            .split("/")
            .filter(Boolean)
            .pop()
            ?.split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") || "Page";
          breadcrumbs.push({ label, path: pathname });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        zIndex: theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, sm: 3 } }}>
        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { md: "none" },
            color: theme.palette.text.primary,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title & Breadcrumbs */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: "1.25rem",
              mb: 0.5,
            }}
          >
            {getPageTitle()}
          </Typography>
          {breadcrumbs.length > 1 && (
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{
                display: { xs: "none", sm: "flex" },
                "& .MuiBreadcrumbs-separator": {
                  color: theme.palette.text.secondary,
                },
              }}
            >
              {breadcrumbs.map((crumb, index) => (
                <Link
                  key={index}
                  underline="hover"
                  color={
                    index === breadcrumbs.length - 1
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary
                  }
                  href={crumb.path}
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                    cursor: "pointer",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {crumb.label}
                </Link>
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          <IconButton
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* User Avatar */}
          <IconButton onClick={handleMenuOpen} sx={{ ml: 1, p: 0 }}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                backgroundColor: theme.palette.primary.main,
                fontSize: "1rem",
                fontWeight: 700,
              }}
            >
              {role?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            mt: 1.5,
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              minWidth: 220,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: "0.95rem",
              }}
            >
              {role || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              Role: {role}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              py: 1.2,
              px: 2,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <AccountCircle sx={{ mr: 1.5, fontSize: 20 }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              py: 1.2,
              px: 2,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Settings sx={{ mr: 1.5, fontSize: 20 }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.2,
              px: 2,
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: `${theme.palette.error.main}10`,
              },
            }}
          >
            <Logout sx={{ mr: 1.5, fontSize: 20 }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}