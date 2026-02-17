// src/components/tickets/AssignedTicketCard.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useAddActionMutation } from "@/redux/services/tickets/ticketsApi";
import { AssignedTicket } from "@/redux/services/tickets/ticketsApi";

interface AssignedTicketCardProps {
  ticket: AssignedTicket;
  onActionComplete?: () => void;
}

const getStatusColor = (status: string) => {
  const statusMap: Record<string, "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
    PENDING_ADMIN: "warning",
    PENDING_SENIOR_PMO: "warning",
    PENDING_FINANCE: "warning",
    APPROVED: "success",
    REJECTED: "error",
    COMPLETED: "success",
  };
  return statusMap[status] || "default";
};

const getStatusLabel = (status: string) => {
  return status.replace(/_/g, " ");
};

export default function AssignedTicketCard({
  ticket,
  onActionComplete,
}: AssignedTicketCardProps) {
  const [addAction, { isLoading }] = useAddActionMutation();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState<"APPROVE" | "REJECT" | null>(null);
  const [remarks, setRemarks] = React.useState("");

  const handleActionClick = (action: "APPROVE" | "REJECT") => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    try {
      await addAction({
        ticket_id: ticket.ticket_id,
        action: selectedAction,
        remarks: remarks || undefined,
      }).unwrap();

      setDialogOpen(false);
      setRemarks("");
      setSelectedAction(null);
      onActionComplete?.();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setRemarks("");
    setSelectedAction(null);
  };

  return (
    <>
      <Card sx={{ mb: 2, border: "1px solid #e0e0e0" }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {ticket.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ticket #{ticket.ticket_id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {ticket.description}
              </Typography>
            </Box>
            <Chip
              label={getStatusLabel(ticket.status)}
              color={getStatusColor(ticket.status)}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Type
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {ticket.ticket_type}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Employee
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {ticket.employee.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Current Role
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {ticket.current_role || "N/A"}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ pt: 0 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckCircle />}
            onClick={() => handleActionClick("APPROVE")}
            disabled={isLoading}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Cancel />}
            onClick={() => handleActionClick("REJECT")}
            disabled={isLoading}
          >
            Reject
          </Button>
        </CardActions>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAction === "APPROVE" ? "Approve Ticket" : "Reject Ticket"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ticket: {ticket.title} (#{ticket.ticket_id})
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Remarks (Optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add any remarks or comments..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={selectedAction === "APPROVE" ? "success" : "error"}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : selectedAction}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}