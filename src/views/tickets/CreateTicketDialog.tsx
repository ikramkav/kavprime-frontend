"use client";

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useCreateTicketMutation } from "@/redux/services/tickets/ticketsApi";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";
import { useGetRolesQuery } from "@/redux/services/roles/rolesApi";

interface CreateTicketDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
}

const ticketTypes = [
  { value: "Request New Item", label: "Request New Item" },
  { value: "Repair an Item", label: "Repair an Item" },
  { value: "General Issue", label: "General Issue" },
];

export default function CreateTicketDialog({
  open,
  onClose,
  employeeId,
}: CreateTicketDialogProps) {
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const [formData, setFormData] = useState({
    ticket_type: "",
    title: "",
    description: "",
  });

  const { data: usersData } = useGetUsersQuery();
  const { data: rolesData } = useGetRolesQuery();

  const [assignedTo, setAssignedTo] = useState<number | "">("");
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [assignedUserEmail, setAssignedUserEmail] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  // Load workflow from localStorage and set the target role of step_order 1
  useEffect(() => {
    if (typeof window !== "undefined") {
      const workflowData = localStorage.getItem("workflow");

      if (workflowData) {
        const workflow = JSON.parse(workflowData);

        const firstStep = workflow?.steps?.find(
          (step: any) => step.step_order === 1
        );

        if (firstStep) {
          setTargetRole(firstStep.target_role);
        }
      }
    }
  }, []);

  // Filter users based on the target role
  const filteredUsers =
    usersData?.users?.filter((user) => user.role === targetRole) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = Number(e.target.value);
    setAssignedTo(userId);

    const selectedUser = filteredUsers.find((user) => user.id === userId);
    setAssignedUserEmail(selectedUser?.email || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!assignedTo) {
      setError("Please select user to assign");
      return;
    }

    if (!formData.ticket_type || !formData.title || !formData.description) {
      setError("Please fill all fields");
      return;
    }

    const role = localStorage.getItem("role");

    try {
      const result = await createTicket({
        employee_id: employeeId,
        ticket_type: formData.ticket_type,
        title: formData.title,
        description: formData.description,
        assigned_to: Number(assignedTo),
        assigned_to_email: assignedUserEmail,
        role: role || undefined,
      }).unwrap();

      toast.success(result.message || "Ticket created successfully!");
      handleClose();
    } catch (err: any) {
      setError(
        err?.data?.error || err?.data?.message || "Failed to create ticket"
      );
    }
  };

  const handleClose = () => {
    setFormData({ ticket_type: "", title: "", description: "" });
    setAssignedTo("");
    setAssignedUserEmail("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Create New Ticket
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Ticket Type"
              name="ticket_type"
              value={formData.ticket_type}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              {ticketTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Brief description of the issue"
            />

            <TextField
              select
              fullWidth
              label="Assign To"
              value={assignedTo}
              onChange={handleAssignedToChange}
              required
              disabled={isLoading}
            >
              {filteredUsers.length === 0 && (
                <MenuItem disabled value="">
                  No users available for this role
                </MenuItem>
              )}

              {filteredUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isLoading}
              multiline
              rows={4}
              placeholder="Provide detailed information about the ticket"
            />

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
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
            sx={{ textTransform: "none", px: 3 }}
          >
            {isLoading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
