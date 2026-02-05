"use client";

import React from "react";
import { Box, Typography, Container, useTheme, Avatar } from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 4,
            mb: 4,
          }}
        >
          {/* Brand */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 700,
                }}
              >
                K
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                }}
              >
                Kavprime
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: "300px",
              }}
            >
              Modern inventory management system for organizations of all sizes.
              Streamline your operations today.
            </Typography>
          </Box>

          {/* Contact Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  support@kavprime.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  +92 300 1234567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn
                  sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Lahore, Pakistan
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["Features", "How It Works", "Pricing", "Support"].map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    cursor: "pointer",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            pt: 4,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            © 2024 Kavprime. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}