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
} from "@mui/material";
import { useRegisterMutation } from "@/redux/services/auth/authApi";
import { useGetRolesQuery } from "@/redux/services/roles/rolesApi";
import { toast } from "react-toastify";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddUserDialog({ open, onClose }: AddUserDialogProps) {
  const theme = useTheme();
  const [register, { isLoading }] = useRegisterMutation();
  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    designation: "",
    employment_status: "",
    join_date: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    designation: "",
    employment_status: "",
    join_date: "",
  });

  const designationOptions = [
    { value: "associate_se", label: "Associate SE" },
    { value: "senior_se", label: "Senior SE" },
    { value: "manage", label: "Manager" },
  ];

  const employmentStatusOptions = [
    { value: "ONBOARDING", label: "Onboarding" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "OFFBOARDING", label: "offboarding" },
  ];

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      role: "",
      designation: "",
      employment_status: "",
      join_date: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.employment_status) {
      newErrors.employment_status = "Employment status is required";
    }

    if (!formData.join_date) {
      newErrors.join_date = "Join date is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as
          | "ADMIN"
          | "EMPLOYEE"
          | "PMO"
          | "SENIOR_PMO"
          | "FINANCE",
        designation: formData.designation,
        employment_status: formData.employment_status,
        join_date: formData.join_date,
      }).unwrap();

      toast.success(result.message || "User added successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to add user"
      );
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      designation: "",
      employment_status: "",
      join_date: "",
    });
    setErrors({
      name: "",
      email: "",
      password: "",
      role: "",
      designation: "",
      employment_status: "",
      join_date: "",
    });
    onClose();
  };

  const activeRoles = roles?.filter((role) => role.is_active) || [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "18px",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        Add New User
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Enter full name"
            size="small"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="Enter email address"
            size="small"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            placeholder="Enter password"
            size="small"
          />

          <TextField
            fullWidth
            label="Role"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            error={!!errors.role}
            helperText={errors.role}
            size="small"
          >
            {rolesLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading roles...
              </MenuItem>
            ) : activeRoles.length === 0 ? (
              <MenuItem disabled>No active roles available</MenuItem>
            ) : (
              activeRoles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            fullWidth
            label="Designation"
            name="designation"
            select
            value={formData.designation}
            onChange={handleChange}
            error={!!errors.designation}
            helperText={errors.designation}
            size="small"
          >
            {designationOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Employment Status"
            name="employment_status"
            select
            value={formData.employment_status}
            onChange={handleChange}
            error={!!errors.employment_status}
            helperText={errors.employment_status}
            size="small"
          >
            {employmentStatusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Join Date"
            name="join_date"
            type="date"
            value={formData.join_date}
            onChange={handleChange}
            error={!!errors.join_date}
            helperText={errors.join_date}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          p: 2,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            textTransform: "none",
            px: 3,
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Adding...
            </>
          ) : (
            "Add User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}