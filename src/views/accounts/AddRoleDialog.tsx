// src/app/dashboard/accounts/AddRoleDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  useTheme,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { useCreateRoleMutation } from "@/redux/services/roles/rolesApi";
import { toast } from "react-toastify";

interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
}

// Base roles that custom roles can inherit permissions from
const BASE_ROLES = [
  { 
    value: "EMPLOYEE", 
    label: "Employee", 
    description: "Basic access - view assets and submit requests"
  },
  { 
    value: "PMO", 
    label: "PMO/Manager", 
    description: "Approve requests and manage team"
  },
  { 
    value: "SENIOR_PMO", 
    label: "Senior PMO", 
    description: "Advanced management and oversight"
  },
  { 
    value: "FINANCE", 
    label: "Finance", 
    description: "Financial management and budgets"
  },
];

export default function AddRoleDialog({ open, onClose }: AddRoleDialogProps) {
  const theme = useTheme();
  const [createRole, { isLoading }] = useCreateRoleMutation();

  const [formData, setFormData] = useState({
    name: "",
    baseRole: "EMPLOYEE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createRole({ name: formData.name }).unwrap();
      toast.success("Role added successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to add role"
      );
    }
  };

  const handleClose = () => {
    setFormData({ name: "", baseRole: "EMPLOYEE" });
    onClose();
  };

  const selectedBaseRole = BASE_ROLES.find(r => r.value === formData.baseRole);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
        }}
      >
        Add New Role
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* <Alert severity="info">
              Custom roles will inherit permissions from the selected base role. You can create roles like "Senior Developer", "HR Manager", "Team Lead", etc.
            </Alert> */}

            <TextField
              fullWidth
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="e.g., Senior Developer, HR Manager, Team Lead"
              helperText="Enter a unique role name for your organization"
            />

            {/* <TextField
              fullWidth
              select
              label="Base Role Template"
              name="baseRole"
              value={formData.baseRole}
              onChange={handleChange}
              required
              disabled={isLoading}
              helperText="Permissions will be inherited from this role"
            >
              {BASE_ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {role.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField> */}

            {/* {selectedBaseRole && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Inherited Permissions:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedBaseRole.description}
                </Typography>
              </Box>
            )} */}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading && <CircularProgress size={16} />}
            sx={{
              textTransform: "none",
              px: 3,
            }}
          >
            {isLoading ? "Adding..." : "Add Role"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}