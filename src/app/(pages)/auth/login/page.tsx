"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LoginOutlined,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useThemeMode } from "@/theme/themeProvider";
import { useLoginMutation } from "@/redux/services/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, toggleTheme } = useThemeMode();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // RTK Query mutation hook
  const [login, { isLoading }] = useLoginMutation();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const result = await login(formData).unwrap();

    // Save user data to localStorage
    localStorage.setItem("user_id", result.user_id.toString());
    localStorage.setItem("role", result.role);
    
    // Show success toast
    toast.success(result.message || "Login successful!");
    
    // Redirect based on the response
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  } catch (err: any) {
    // Show error toast - Fixed to use err.data.error
    toast.error(err?.data?.error || err?.data?.message || "Login failed. Please try again.");
    console.error("Login failed:", err);
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Theme Toggle Button */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 2,
          zIndex: 10,
          "&:hover": {
            backgroundColor: theme.palette.background.paper,
            transform: "scale(1.1)",
          },
        }}
      >
        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      {/* Subtle Background Decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          backgroundColor:
            mode === "light"
              ? "rgba(0, 0, 0, 0.02)"
              : "rgba(255, 255, 255, 0.02)",
          filter: "blur(100px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          backgroundColor:
            mode === "light"
              ? "rgba(0, 0, 0, 0.02)"
              : "rgba(255, 255, 255, 0.02)",
          filter: "blur(120px)",
        }}
      />

      {/* Login Card - Centered */}
      <Container maxWidth="xs" sx={{ padding: 2 }}>
        <Paper
          elevation={mode === "light" ? 1 : 3}
          sx={{
            padding: isMobile ? "40px 28px" : "48px 40px",
            borderRadius: "24px",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Logo/Brand Name */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 800,
                color: theme.palette.text.primary,
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Kavprime
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              Inventory Management System
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "1.3rem",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      mode === "light"
                        ? theme.palette.background.default
                        : theme.palette.background.default,
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "14px",
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 3.5 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "1.3rem",
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={isLoading}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            color: theme.palette.text.primary,
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      mode === "light"
                        ? theme.palette.background.default
                        : theme.palette.background.default,
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "14px",
                  },
                }}
              />
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              endIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginOutlined />
                )
              }
              sx={{
                py: 1.8,
                fontSize: "1rem",
                fontWeight: 700,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: "12px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
                "&:disabled": {
                  backgroundColor: theme.palette.primary.main,
                  opacity: 0.6,
                },
                transition: "all 0.3s ease",
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Forgot Password */}
            <Box sx={{ textAlign: "center", mt: 2.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Footer - Positioned at Bottom */}
      <Typography
        variant="body2"
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: theme.palette.text.secondary,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        © 2025 Kavprime. All rights reserved.
      </Typography>
    </Box>
  );
}