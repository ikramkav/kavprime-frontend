"use client";

import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-30%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", color: "white" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 3,
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 5,
              opacity: 0.95,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Join organizations worldwide who trust Kavprime for their inventory
            management needs. Start your free trial today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => router.push("/auth/login")}
            sx={{
              textTransform: "none",
              px: 5,
              py: 2,
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
            Start Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
}