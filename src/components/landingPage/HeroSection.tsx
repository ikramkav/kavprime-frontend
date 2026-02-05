"use client";

import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { ArrowForward, Inventory2 } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      id="home"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(100px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(100px)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            color: "white",
            py: { xs: 8, md: 12 },
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "inline-flex",
              p: 2.5,
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              mb: 4,
            }}
          >
            <Inventory2 sx={{ fontSize: 60 }} />
          </Box>

          {/* Heading */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              mb: 3,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 20px rgba(0,0,0,0.2)",
            }}
          >
            Modern Inventory
            <br />
            Management System
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
              mb: 5,
              opacity: 0.95,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Streamline your inventory operations with our powerful,
            user-friendly platform. Track assets, manage requests, and boost
            productivity.
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => router.push("/auth/login")}
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "12px",
                backgroundColor: "white",
                color: theme.palette.primary.main,
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "12px",
                borderColor: "white",
                color: "white",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white",
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}