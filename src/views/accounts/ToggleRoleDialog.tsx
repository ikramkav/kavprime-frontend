// src/app/dashboard/accounts/ToggleRoleDialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useUpdateRoleStatusMutation, Role } from "@/redux/services/roles/rolesApi";
import { toast } from "react-toastify";

interface ToggleRoleDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
}

export default function ToggleRoleDialog({
  open,
  role,
  onClose,
}: ToggleRoleDialogProps) {
  const theme = useTheme();
  const [updateRoleStatus, { isLoading }] = useUpdateRoleStatusMutation();

  const handleToggle = async () => {
    if (!role) return;

    try {
      await updateRoleStatus({
        roleId: role.id,
        is_active: !role.is_active,
      }).unwrap();
      toast.success(
        `Role ${role.is_active ? "deactivated" : "activated"} successfully!`
      );
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to update role status"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
        {role?.is_active ? "Deactivate" : "Activate"} Role
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Are you sure you want to {role?.is_active ? "deactivate" : "activate"}{" "}
          the <strong>{role?.name}</strong> role?
        </Typography>
        {role?.is_active && (
          <Alert severity="warning">
            Users with this role may lose access to certain features when deactivated.
          </Alert>
        )}
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
          onClick={handleToggle}
          variant="contained"
          color={role?.is_active ? "error" : "success"}
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={16} />}
          sx={{
            textTransform: "none",
            px: 3,
          }}
        >
          {isLoading
            ? "Updating..."
            : role?.is_active
            ? "Deactivate"
            : "Activate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}