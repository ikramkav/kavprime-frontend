// src/theme/theme.ts

import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { themeSettings, glassEffect } from "./color";

export const getTheme = (mode: "light" | "dark") => {
  const colors = themeSettings(mode);
  const glass = mode === "light" ? glassEffect.light : glassEffect.dark;

  let theme = createTheme({
    palette: colors.palette,
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "Arial",
        "sans-serif",
      ].join(","),
      h1: { fontWeight: 700, fontSize: "2.5rem" },
      h2: { fontWeight: 700, fontSize: "2rem" },
      h3: { fontWeight: 600, fontSize: "1.75rem" },
      h4: { fontWeight: 600, fontSize: "1.5rem" },
      h5: { fontWeight: 600, fontSize: "1.25rem" },
      h6: { fontWeight: 600, fontSize: "1rem" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 24px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: "translateY(-2px)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            ...glass,
            borderRadius: 16,
            "&:hover": {
              transform: "translateY(-4px)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            ...glass,
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            ...glass,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: glass,
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              ...glass,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            ...glass,
            borderRadius: 8,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            ...glass,
            borderRadius: 16,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            ...glass,
            borderRadius: 12,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
};