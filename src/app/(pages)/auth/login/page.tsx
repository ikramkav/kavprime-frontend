// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   InputAdornment,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock,
//   LoginOutlined,
//   Brightness4,
//   Brightness7,
// } from "@mui/icons-material";
// import { useThemeMode } from "@/theme/themeProvider";
// import { useLoginMutation } from "@/redux/services/auth/authApi";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// export default function LoginPage() {
//   const theme = useTheme();
//   const router = useRouter();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { mode, toggleTheme } = useThemeMode();

//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // RTK Query mutation hook
//   const [login, { isLoading }] = useLoginMutation();

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const result = await login(formData).unwrap();

//     // Save basic user data
//     localStorage.setItem("user_id", result.user_id.toString());
//     localStorage.setItem("role", result.role);
//     localStorage.setItem("employment_status", result.employment_status);

//     // ✅ Save complete workflow object
//     if (result.workflow) {
//       localStorage.setItem("workflow", JSON.stringify(result.workflow));

//       // ✅ Save only steps separately (if you need direct access)
//       localStorage.setItem(
//         "workflow_steps",
//         JSON.stringify(result.workflow.steps)
//       );
//     }

//     toast.success(result.message || "Login successful!");

//     setTimeout(() => {
//       router.push("/dashboard");
//     }, 1000);

//   } catch (err: any) {
//     toast.error(
//       err?.data?.error ||
//       err?.data?.message ||
//       "Login failed. Please try again."
//     );
//     console.error("Login failed:", err);
//   }
// };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         height: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: theme.palette.background.default,
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Theme Toggle Button */}
//       <IconButton
//         onClick={toggleTheme}
//         sx={{
//           position: "absolute",
//           top: 20,
//           right: 20,
//           color: theme.palette.text.primary,
//           backgroundColor: theme.palette.background.paper,
//           boxShadow: 2,
//           zIndex: 10,
//           "&:hover": {
//             backgroundColor: theme.palette.background.paper,
//             transform: "scale(1.1)",
//           },
//         }}
//       >
//         {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
//       </IconButton>

//       {/* Subtle Background Decoration */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: "-20%",
//           left: "-10%",
//           width: "500px",
//           height: "500px",
//           borderRadius: "50%",
//           backgroundColor:
//             mode === "light"
//               ? "rgba(0, 0, 0, 0.02)"
//               : "rgba(255, 255, 255, 0.02)",
//           filter: "blur(100px)",
//         }}
//       />
//       <Box
//         sx={{
//           position: "absolute",
//           bottom: "-20%",
//           right: "-10%",
//           width: "600px",
//           height: "600px",
//           borderRadius: "50%",
//           backgroundColor:
//             mode === "light"
//               ? "rgba(0, 0, 0, 0.02)"
//               : "rgba(255, 255, 255, 0.02)",
//           filter: "blur(120px)",
//         }}
//       />

//       {/* Login Card - Centered */}
//       <Container maxWidth="xs" sx={{ padding: 2 }}>
//         <Paper
//           elevation={mode === "light" ? 1 : 3}
//           sx={{
//             padding: isMobile ? "40px 28px" : "48px 40px",
//             borderRadius: "24px",
//             backgroundColor: theme.palette.background.paper,
//             border: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           {/* Logo/Brand Name */}
//           <Box sx={{ textAlign: "center", mb: 4 }}>
//             <Typography
//               variant={isMobile ? "h4" : "h3"}
//               sx={{
//                 fontWeight: 800,
//                 color: theme.palette.text.primary,
//                 letterSpacing: "-0.02em",
//                 mb: 1,
//               }}
//             >
//               Kavprime
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: theme.palette.text.secondary,
//                 fontWeight: 500,
//                 fontSize: "0.95rem",
//               }}
//             >
//               Inventory Management System
//             </Typography>
//           </Box>

//           {/* Login Form */}
//           <Box component="form" onSubmit={handleSubmit}>
//             {/* Email Field */}
//             <Box sx={{ mb: 2.5 }}>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   mb: 1,
//                   fontWeight: 600,
//                   color: theme.palette.text.primary,
//                 }}
//               >
//                 Email Address
//               </Typography>
//               <TextField
//                 fullWidth
//                 name="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Email
//                         sx={{
//                           color: theme.palette.text.secondary,
//                           fontSize: "1.3rem",
//                         }}
//                       />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor:
//                       mode === "light"
//                         ? theme.palette.background.default
//                         : theme.palette.background.default,
//                     "&:hover fieldset": {
//                       borderColor: theme.palette.primary.main,
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: theme.palette.primary.main,
//                       borderWidth: "2px",
//                     },
//                   },
//                   "& .MuiOutlinedInput-input": {
//                     padding: "14px",
//                   },
//                 }}
//               />
//             </Box>

//             {/* Password Field */}
//             <Box sx={{ mb: 3.5 }}>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   mb: 1,
//                   fontWeight: 600,
//                   color: theme.palette.text.primary,
//                 }}
//               >
//                 Password
//               </Typography>
//               <TextField
//                 fullWidth
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Lock
//                         sx={{
//                           color: theme.palette.text.secondary,
//                           fontSize: "1.3rem",
//                         }}
//                       />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={handleClickShowPassword}
//                         edge="end"
//                         disabled={isLoading}
//                         sx={{
//                           color: theme.palette.text.secondary,
//                           "&:hover": {
//                             color: theme.palette.text.primary,
//                           },
//                         }}
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     backgroundColor:
//                       mode === "light"
//                         ? theme.palette.background.default
//                         : theme.palette.background.default,
//                     "&:hover fieldset": {
//                       borderColor: theme.palette.primary.main,
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: theme.palette.primary.main,
//                       borderWidth: "2px",
//                     },
//                   },
//                   "& .MuiOutlinedInput-input": {
//                     padding: "14px",
//                   },
//                 }}
//               />
//             </Box>

//             {/* Login Button */}
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={isLoading}
//               endIcon={
//                 isLoading ? (
//                   <CircularProgress size={20} color="inherit" />
//                 ) : (
//                   <LoginOutlined />
//                 )
//               }
//               sx={{
//                 py: 1.8,
//                 fontSize: "1rem",
//                 fontWeight: 700,
//                 backgroundColor: theme.palette.primary.main,
//                 color: theme.palette.primary.contrastText,
//                 borderRadius: "12px",
//                 textTransform: "none",
//                 boxShadow: "none",
//                 "&:hover": {
//                   backgroundColor: theme.palette.primary.dark,
//                   transform: "translateY(-2px)",
//                   boxShadow: 3,
//                 },
//                 "&:disabled": {
//                   backgroundColor: theme.palette.primary.main,
//                   opacity: 0.6,
//                 },
//                 transition: "all 0.3s ease",
//               }}
//             >
//               {isLoading ? "Logging in..." : "Login"}
//             </Button>

//             {/* Forgot Password */}
//             <Box sx={{ textAlign: "center", mt: 2.5 }}>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: theme.palette.primary.main,
//                   cursor: "pointer",
//                   fontWeight: 600,
//                   "&:hover": {
//                     textDecoration: "underline",
//                   },
//                 }}
//               >
//                 Forgot Password?
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>
//       </Container>

//       {/* Footer - Positioned at Bottom */}
//       <Typography
//         variant="body2"
//         sx={{
//           position: "absolute",
//           bottom: 20,
//           left: "50%",
//           transform: "translateX(-50%)",
//           textAlign: "center",
//           color: theme.palette.text.secondary,
//           fontWeight: 500,
//           whiteSpace: "nowrap",
//         }}
//       >
//         © 2025 Kavprime. All rights reserved.
//       </Typography>
//     </Box>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useLoginMutation } from "@/redux/services/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { isAuthenticated, saveAuthData } from "@/utils/auth";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

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

      saveAuthData({
        userId: result.user_id,
        role: result.role,
        employmentStatus: result.employment_status,
        workflow: result.workflow,
        tokens: result.tokens,
      });

      toast.success(result.message || "Login successful!");

      const nextRoute = result.redirect_url?.startsWith("/dashboard")
        ? result.redirect_url
        : "/dashboard";

      setTimeout(() => {
        router.replace(nextRoute);
      }, 1000);
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError | SerializedError;
      const apiError =
        "data" in err && err.data && typeof err.data === "object"
          ? (err.data as { error?: string; message?: string })
          : null;

      toast.error(
        apiError?.error || apiError?.message || "Login failed. Please try again.",
      );
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          minHeight: "420px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          backgroundColor: "#fff",
        }}
      >
        {/* ── LEFT PANEL ── */}
        {/* ── LEFT PANEL ── */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              position: "relative",
              background: "linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src="/images/loginleftimage.png"
              alt="Login Illustration"
              sx={{
                width: "100%",
                maxWidth: "380px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        {/* ── RIGHT PANEL ── */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "40px 28px" : "48px 48px",
            backgroundColor: "#fff",
            position: "relative",
          }}
        >
          {/* Close button (decorative) */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#9e9e9e",
              "&:hover": { color: "#333" },
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>

          {/* Logo */}
          <Box sx={{ mb: 3 }}>
            {/* K icon */}
            <Box
              component="img"
              src="/images/kavprimelogo.png"
              alt="Login Illustration"
              sx={{
                width: "100%",
                maxWidth: "380px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#111",
                mb: 0.5,
                fontSize: "1.7rem",
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: "#888", fontWeight: 400 }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 600,
                  color: "#555",
                  fontSize: "0.8rem",
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="domat@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#bbb", fontSize: "1.1rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fafafa",
                    fontSize: "0.88rem",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#3949ab" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3949ab",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiOutlinedInput-input": { padding: "11px 12px" },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 600,
                  color: "#555",
                  fontSize: "0.8rem",
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
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#bbb", fontSize: "1.1rem" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={isLoading}
                        size="small"
                        sx={{ color: "#bbb", "&:hover": { color: "#555" } }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fafafa",
                    fontSize: "0.88rem",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#3949ab" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3949ab",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiOutlinedInput-input": { padding: "11px 12px" },
                }}
              />
            </Box>

            {/* Remember me + Forgot password row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{
                      color: "#3949ab",
                      "&.Mui-checked": { color: "#3949ab" },
                      padding: "4px",
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", fontSize: "0.8rem" }}
                  >
                    Remember me
                  </Typography>
                }
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#3949ab",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot Password
              </Typography>
            </Box>

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.4,
                fontSize: "0.95rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)",
                color: "#fff",
                borderRadius: "10px",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(57,73,171,0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #303f9f 0%, #3949ab 100%)",
                  boxShadow: "0 6px 20px rgba(57,73,171,0.45)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)",
                  opacity: 0.6,
                  color: "#fff",
                },
                transition: "all 0.25s ease",
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={18} color="inherit" />
                  <span>Signing in...</span>
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Typography
        variant="body2"
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#aaa",
          fontWeight: 500,
          fontSize: "0.75rem",
          whiteSpace: "nowrap",
        }}
      >
        © 2025 Kavprime. All rights reserved.
      </Typography>
    </Box>
  );
}
