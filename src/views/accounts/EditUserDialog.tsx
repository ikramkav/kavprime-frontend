"use client";

import React, { useState, useEffect } from "react";
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
import { useUpdateUserMutation, User } from "@/redux/services/auth/authApi";
import { toast } from "react-toastify";

interface EditUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const roles = ["ADMIN", "EMPLOYEE", "PMO", "SENIOR_PMO", "FINANCE"];
const designations = ["associate_se", "senior_se", "manager", "senior_manager"];
const employmentStatuses = ["ONBOARDING", "ACTIVE", "EXITED","OFFBOARDING"];

export default function EditUserDialog({
  open,
  user,
  onClose,
}: EditUserDialogProps) {
  const theme = useTheme();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    role: "EMPLOYEE" as "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE",
    designation: "",
    employment_status: "",
    join_date: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        role: user.role,
        designation: user.designation || "",
        employment_status: user.employment_status || "",
        join_date: user.join_date || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const result = await updateUser({
        id: user.id,
        name: formData.name,
        role: formData.role,
        designation: formData.designation,
        employment_status: formData.employment_status,
        join_date: formData.join_date,
      }).unwrap();
      toast.success(result.message || "User updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to update user"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Edit User
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              {designations.map((designation) => (
                <MenuItem key={designation} value={designation}>
                  {designation}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Employment Status"
              name="employment_status"
              value={formData.employment_status}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              {employmentStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
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
              required
              disabled={isLoading}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={onClose}
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
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}