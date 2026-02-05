"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useThemeMode } from "@/theme/themeProvider";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

export default function LandingNavbar() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleTheme } = useThemeMode();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor:
            mode === "light"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(30, 30, 30, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: theme.palette.primary.main,
                fontWeight: 700,
              }}
            >
              K
            </Avatar>
            <Box
              sx={{
                fontWeight: 800,
                fontSize: "1.5rem",
                color: theme.palette.text.primary,
                letterSpacing: "-0.02em",
              }}
            >
              Kavprime
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              {navItems.map((item) => (
                <Box
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.primary }}>
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {!isMobile && (
              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  borderRadius: "10px",
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            )}

            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => scrollToSection(item.href)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogin}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                }}
              >
                Login
              </Button>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}