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
} from "@mui/material";
import { useCreateTicketMutation } from "@/redux/services/tickets/ticketsApi";
import { toast } from "react-toastify";

interface CreateTicketDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
}

const ticketTypes = [
  { value: "request_new_item", label: "Request New Item" },
  { value: "repair", label: "Repair an Item" },
  { value: "general_issue", label: "General Issue" },
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

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.ticket_type || !formData.title || !formData.description) {
      setError("Please fill all fields");
      return;
    }

    try {
      const result = await createTicket({
        employee_id: employeeId,
        ticket_type: formData.ticket_type,
        title: formData.title,
        description: formData.description,
      }).unwrap();

      toast.success(result.message || "Ticket created successfully!");
      handleClose();
    } catch (err: any) {
      setError(err?.data?.error || err?.data?.message || "Failed to create ticket");
    }
  };

  const handleClose = () => {
    setFormData({ ticket_type: "", title: "", description: "" });
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
            {isLoading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}