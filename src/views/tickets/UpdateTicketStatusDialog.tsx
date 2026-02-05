"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";
import { Person, Email } from "@mui/icons-material";
import { useUpdateTicketStatusMutation } from "@/redux/services/tickets/ticketsApi";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";
import { toast } from "react-toastify";
import { Ticket } from "@/redux/services/tickets/ticketsApi";

interface UpdateTicketStatusDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  userRole: string;
}

export default function UpdateTicketStatusDialog({
  open,
  onClose,
  ticket,
  userRole,
}: UpdateTicketStatusDialogProps) {
  const [updateStatus, { isLoading }] = useUpdateTicketStatusMutation();
  const { data: usersData } = useGetUsersQuery();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get employee details
  const employee = usersData?.users?.find((user) => user.id === ticket?.employee_id);

  // Status options based on user role
  const getStatusOptions = () => {
    if (userRole === "ADMIN") {
      return [
        { value: "APPROVED", label: "Approve" },
        { value: "REJECTED", label: "Reject" },
        { value: "PENDING_TEAM_PMO", label: "Send to Team PMO" },
        { value: "PENDING_SENIOR_PMO", label: "Send to Senior PMO" },
      ];
    } else if (userRole === "SENIOR_PMO") {
      return [
        { value: "APPROVED", label: "Approve" },
        { value: "REJECTED", label: "Reject" },
      ];
    } else if (userRole === "PMO") {
      return [
        { value: "APPROVED", label: "Approve" },
        { value: "REJECTED", label: "Reject" },
        { value: "PENDING_SENIOR_PMO", label: "Escalate to Senior PMO" },
      ];
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedStatus || !ticket) {
      setError("Please select a status");
      return;
    }

    try {
      const result = await updateStatus({
        employee_id: ticket.employee_id,
        status: selectedStatus,
      }).unwrap();

      toast.success(result.message || "Ticket status updated successfully!");
      handleClose();
    } catch (err: any) {
      setError(err?.data?.error || err?.data?.message || "Failed to update status");
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setError(null);
    onClose();
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Update Ticket Status
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Ticket Details */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ticket Details
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {ticket.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {ticket.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Type: {ticket.ticket_type.replace(/_/g, " ").toUpperCase()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Current Status: {ticket.status.replace(/_/g, " ")}
              </Typography>
            </Box>

            <Divider />

            {/* Employee Details */}
            {employee && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Employee Details
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Person color="primary" fontSize="small" />
                  <Typography variant="body2">
                    <strong>Name:</strong> {employee.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Email color="primary" fontSize="small" />
                  <Typography variant="body2">
                    <strong>Email:</strong> {employee.email}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  <strong>Role:</strong> {employee.role}
                </Typography>
              </Box>
            )}

            <Divider />

            {/* Status Selection */}
            <TextField
              select
              fullWidth
              label="New Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
              disabled={isLoading}
            >
              {getStatusOptions().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleClose} disabled={isLoading} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading && <CircularProgress size={16} />}
            sx={{ textTransform: "none", px: 3 }}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}