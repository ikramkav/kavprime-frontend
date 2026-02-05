// src/theme/color.ts

export const colors = {
  // Base colors
  white: "#FFFFFF",
  black: "#000000",
  
  // Grey scale
  grey: {
    light: "#F5F5F5",
    main: "#9E9E9E",
    dark: "#424242",
  },

  // Primary color
  primary: "#2196F3",
  
  // Secondary color
  secondary: "#9C27B0",
  
  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#03A9F4",
};

// Theme settings for light and dark modes
export const themeSettings = (mode: "light" | "dark") => {
  return {
    palette: {
      mode: mode,
      ...(mode === "light"
        ? {
            // Light mode
            primary: {
              main: colors.primary,
            },
            secondary: {
              main: colors.secondary,
            },
            background: {
              default: colors.grey.light,
              paper: colors.white,
            },
            text: {
              primary: colors.black,
              secondary: colors.grey.dark,
            },
            success: {
              main: colors.success,
            },
            error: {
              main: colors.error,
            },
            warning: {
              main: colors.warning,
            },
            info: {
              main: colors.info,
            },
          }
        : {
            // Dark mode
            primary: {
              main: colors.primary,
            },
            secondary: {
              main: colors.secondary,
            },
            background: {
              default: "#121212",
              paper: "#1E1E1E",
            },
            text: {
              primary: colors.white,
              secondary: colors.grey.main,
            },
            success: {
              main: colors.success,
            },
            error: {
              main: colors.error,
            },
            warning: {
              main: colors.warning,
            },
            info: {
              main: colors.info,
            },
          }),
    },
  };
};

// Glassmorphism effect
export const glassEffect = {
  light: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  },
  dark: {
    background: "rgba(30, 30, 30, 0.7)",
    backdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },
};