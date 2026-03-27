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
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Logout,
  Settings,
  AccountCircle,
  Notifications,
  Search,
  Add,
} from "@mui/icons-material";
import { useThemeMode } from "@/theme/themeProvider";
import { useRouter, usePathname } from "next/navigation";
import { clearUserData, getUserData } from "@/utils/auth";
import { toast } from "react-toastify";
import { getNavigationByRole } from "@/utils/navigation";
import { useGetEmployeeStatsQuery } from "@/redux/services/stats/stats";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const router = useRouter();
  const pathname = usePathname();
  const { role, userId } = getUserData();

  const { data: statsData } = useGetEmployeeStatsQuery(
    userId ? userId.toString() : "",
    { skip: !userId }
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearUserData();
    toast.success("Logged out successfully");
    router.replace("/auth/login");
    handleMenuClose();
  };

  const navigationItems = getNavigationByRole(role || "EMPLOYEE");

  const getPageTitle = () => {
    const currentItem = navigationItems.find((item) => item.path === pathname);
    if (currentItem) return currentItem.title;
    const partialMatch = navigationItems.find(
      (item) => pathname.startsWith(item.path) && item.path !== "/dashboard"
    );
    if (partialMatch) return partialMatch.title;
    return "Dashboard Overview";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const userName = statsData?.employee?.name || role || "User";
  const userEmail = statsData?.employee?.email || `${(role || "user").toLowerCase()}@kavprime.com`;
  const userInitial = userName.charAt(0).toUpperCase();

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
      <Toolbar sx={{ minHeight: "70px !important", px: { xs: 2, sm: 3 }, gap: 2 }}>
        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: "none" }, color: theme.palette.text.primary }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title & Date */}
        <Box sx={{ flexShrink: 0 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: "1.15rem",
              lineHeight: 1.2,
            }}
          >
            {getPageTitle()}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}
          >
            {today}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <TextField
          size="small"
          placeholder="Search..."
          sx={{
            display: { xs: "none", md: "flex" },
            width: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: theme.palette.background.default,
              fontSize: "0.875rem",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Create New Button */}
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={() => router.push("/dashboard/tickets")}
          sx={{
            display: { xs: "none", sm: "flex" },
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            py: 0.8,
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
          }}
        >
          Create New
        </Button>

        {/* Notifications */}
        <IconButton sx={{ color: theme.palette.text.primary }}>
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Theme Toggle */}
        <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.primary }}>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* User Info + Avatar */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            pl: 1,
            borderLeft: `1px solid ${theme.palette.divider}`,
          }}
          onClick={handleMenuOpen}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.85rem", lineHeight: 1.2 }}
            >
              {userName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}
            >
              {userEmail}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: theme.palette.primary.main,
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            {userInitial}
          </Avatar>
        </Box>

        {/* Mobile avatar only */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{ display: { xs: "flex", sm: "none" }, p: 0 }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: theme.palette.primary.main,
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            {userInitial}
          </Avatar>
        </IconButton>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1.5 }}
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
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {userEmail}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, px: 2 }}>
            <AccountCircle sx={{ mr: 1.5, fontSize: 20 }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, px: 2 }}>
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
              "&:hover": { backgroundColor: `${theme.palette.error.main}10` },
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
