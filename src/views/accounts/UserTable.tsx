"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { User } from "@/redux/services/auth/authApi";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({
  users,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: UserTableProps) {
  const theme = useTheme();

  const getRoleColor = (role: string) => {
    const colors: any = {
      ADMIN: theme.palette.error.main,
      EMPLOYEE: theme.palette.info.main,
      PMO: theme.palette.warning.main,
      FINANCE: theme.palette.success.main,
    };
    return colors[role] || theme.palette.primary.main;
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
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load users. Please try again.
      </Alert>
    );
  }

  if (users.length === 0) {
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
          No users found. Add a new user to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Designation</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {user.name}
                </Typography>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    backgroundColor: `${getRoleColor(user.role)}20`,
                    color: getRoleColor(user.role),
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>
              <TableCell> 
                {user.designation || "Designation not available"}
              </TableCell>
              <TableCell> 
                {user.employment_status || "Status not available" }
              </TableCell>
              <TableCell> 
                {user.join_date || "Join date not available"}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEdit(user)}
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 1,
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(user)}
                  sx={{
                    color: theme.palette.error.main,
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}