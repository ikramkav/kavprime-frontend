// src/app/dashboard/accounts/RoleTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Switch,
} from "@mui/material";
import { Role } from "@/redux/services/roles/rolesApi";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  isError: boolean;
  onToggleStatus: (role: Role) => void;
}

// System roles that come with dashboard configs
const SYSTEM_ROLES = ["ADMIN", "EMPLOYEE", "PMO", "SENIOR_PMO", "FINANCE"];

export default function RoleTable({
  roles,
  isLoading,
  isError,
  onToggleStatus,
}: RoleTableProps) {
  const theme = useTheme();

  const isSystemRole = (roleName: string) => {
    return SYSTEM_ROLES.includes(roleName.toUpperCase());
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load roles. Please try again.
      </Alert>
    );
  }

  if (roles.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No roles found. Add a new role to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow
              key={role.id}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell>{role.id}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {role.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={isSystemRole(role.name) ? "System" : "Custom"}
                  size="small"
                  sx={{
                    backgroundColor: isSystemRole(role.name)
                      ? `${theme.palette.primary.main}20`
                      : `${theme.palette.info.main}20`,
                    color: isSystemRole(role.name)
                      ? theme.palette.primary.main
                      : theme.palette.info.main,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={role.is_active ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    backgroundColor: role.is_active
                      ? `${theme.palette.success.main}20`
                      : `${theme.palette.error.main}20`,
                    color: role.is_active
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mr: 1 }}
                  >
                    {isSystemRole(role.name) && "(System Role)"}
                  </Typography>
                  <Switch
                    checked={role.is_active}
                    onChange={() => onToggleStatus(role)}
                    disabled={isSystemRole(role.name)} // System roles always active
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: theme.palette.success.main,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: theme.palette.success.main,
                      },
                    }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}