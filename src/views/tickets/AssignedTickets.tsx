"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { getUserData } from "@/utils/auth";
import {
  useGetAssignedTicketsQuery,
  useAddActionMutation,
  AssignedTicket,
} from "@/redux/services/tickets/ticketsApi";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";
import { useGetWorkflowsQuery } from "@/redux/services/workflow/workflowApi";

export default function AssignedTickets() {
  const { userId } = getUserData();

  const { data, isLoading, isError } = useGetAssignedTicketsQuery(Number(userId));
  const [addAction] = useAddActionMutation();
  const { data: usersData } = useGetUsersQuery();
  const { data: workflowsData } = useGetWorkflowsQuery();

  const [remarksMap, setRemarksMap] = useState<{ [key: number]: string }>({});
  const [processedTickets, setProcessedTickets] = useState<number[]>([]);
  const [assignedTo, setAssignedTo] = useState<{ [ticketId: number]: number | "" }>({});
  const [criticalMap, setCriticalMap] = useState<{ [ticketId: number]: boolean }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Get next target_role by searching within each role's steps independently
  const getNextTargetRole = (ticket: AssignedTicket): string | null => {
    const activeWorkflow = workflowsData?.find((w) => w.is_active) || workflowsData?.[0];
    if (!activeWorkflow?.roles?.length) return null;

    const statusRole = ticket.status
      ?.replace("PENDING_", "")
      ?.toUpperCase()
      ?.replace(/\s/g, "_");

    if (!statusRole) return null;

    // Search within EACH role's steps independently (do NOT merge across roles)
    for (const roleObj of activeWorkflow.roles) {
      const sortedSteps = [...roleObj.steps].sort((a, b) => a.step_order - b.step_order);

      const currentIndex = sortedSteps.findIndex(
        (s) => s.target_role?.toUpperCase().replace(/\s/g, "_") === statusRole
      );

      if (currentIndex !== -1) {
        // Found the current step in this role's chain
        const nextStep = sortedSteps[currentIndex + 1];
        return nextStep?.target_role || null;
      }
    }

    return null;
  };

  // Check if this is the last step (no next step needed)
  const isLastStep = (ticket: AssignedTicket): boolean => {
    return getNextTargetRole(ticket) === null;
  };

  // Get users filtered by the next target role
  const getUsersForNextStep = (ticket: AssignedTicket) => {
    const nextRole = getNextTargetRole(ticket);
    if (!nextRole || !usersData?.users) return [];
    return usersData.users.filter(
      (u) => u.role?.toUpperCase().replace(/\s/g, "_") === nextRole.toUpperCase().replace(/\s/g, "_")
    );
  };

  const handleAction = async (ticketId: number, actionType: "approve" | "reject") => {
    if (processedTickets.includes(ticketId)) return;

    const ticket = data?.tickets.find((t) => t.ticket_id === ticketId);
    if (!ticket) return;

    const lastStep = isLastStep(ticket);
    const selectedUserId = assignedTo[ticketId];
    const nextStepUsers = getUsersForNextStep(ticket);
    const selectedUser = nextStepUsers.find((u) => u.id === selectedUserId);

    if (actionType === "approve" && !lastStep && !selectedUser) {
      setSnackbar({
        open: true,
        message: "Please select a user to assign before approving",
        severity: "error",
      });
      return;
    }

    // Use priority from previous step if already set, otherwise use the checkbox value
    const priority = ticket.priority
      ? ticket.priority
      : criticalMap[ticketId]
      ? "CRITICAL"
      : "NON_CRITICAL";

    const basePayload = {
      ticket_id: ticketId,
      action: actionType,
      remarks:
        remarksMap[ticketId] ||
        (actionType === "approve" ? "Checked and approved" : "Rejected"),
      role: "",
      ...(actionType === "approve" && { priority }),
    };

    const payload =
      actionType === "approve" && selectedUser
        ? {
            ...basePayload,
            role_email_map: {
              [selectedUser.role]: selectedUser.email,
            },
          }
        : basePayload;

    try {
      await addAction(payload).unwrap();
      setProcessedTickets((prev) => [...prev, ticketId]);
      setSnackbar({
        open: true,
        message: `Ticket #${ticketId} ${actionType === "approve" ? "approved" : "rejected"} successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Action failed. Please try again.",
        severity: "error",
      });
    }
  };

  if (isLoading) return <p>Loading assigned tickets...</p>;
  if (isError) return <p>Something went wrong</p>;
  if (!data || data.tickets.length === 0)
    return (
      <Typography variant="body1" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
        No assigned tickets found
      </Typography>
    );

  const sortedTickets = [...data.tickets].sort((a, b) => b.ticket_id - a.ticket_id);

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {sortedTickets.map((ticket) => {
        const isProcessed = processedTickets.includes(ticket.ticket_id);
        const nextStepUsers = getUsersForNextStep(ticket);
        const lastStep = isLastStep(ticket);
        const nextRole = getNextTargetRole(ticket);

        return (
          <Paper key={ticket.ticket_id} sx={{ p: 3, mb: 2 }} elevation={2}>
            <Typography variant="h6" fontWeight={600}>
              {ticket.title}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {ticket.description}
            </Typography>

            {/* Assign To — only shown if there is a next step */}
            {!lastStep && (
              <TextField
                select
                fullWidth
                label={`Assign To${nextRole ? ` (${nextRole.replace(/_/g, " ")})` : " *"}`}
                value={assignedTo[ticket.ticket_id] || ""}
                onChange={(e) =>
                  setAssignedTo((prev) => ({
                    ...prev,
                    [ticket.ticket_id]: Number(e.target.value),
                  }))
                }
                required
                disabled={isProcessed}
                sx={{ mt: 2 }}
              >
                {nextStepUsers.length === 0 ? (
                  <MenuItem disabled value="">
                    No {nextRole?.replace(/_/g, " ")} users available
                  </MenuItem>
                ) : (
                  nextStepUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}

            <Typography variant="body2" sx={{ mt: 1 }}>
              Status: {ticket.status}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Employee: {ticket.employee.email}
            </Typography>

            {/* If ticket already has priority from previous step — show as read-only badge */}
            {ticket.priority ? (
              <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">Priority:</Typography>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.25,
                    borderRadius: "6px",
                    backgroundColor: ticket.priority === "CRITICAL" ? "#FEF2F2" : "#F0FDF4",
                    color: ticket.priority === "CRITICAL" ? "#DC2626" : "#16A34A",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {ticket.priority}
                </Box>
              </Box>
            ) : (
              /* First step — allow setting Critical */
              <FormControlLabel
                control={
                  <Checkbox
                    checked={criticalMap[ticket.ticket_id] || false}
                    onChange={(e) =>
                      setCriticalMap((prev) => ({
                        ...prev,
                        [ticket.ticket_id]: e.target.checked,
                      }))
                    }
                    disabled={isProcessed}
                  />
                }
                label="Critical"
                sx={{ mt: 1 }}
              />
            )}

            <TextField
              fullWidth
              size="small"
              label="Remarks"
              sx={{ mt: 2 }}
              disabled={isProcessed}
              value={remarksMap[ticket.ticket_id] || ""}
              onChange={(e) =>
                setRemarksMap((prev) => ({
                  ...prev,
                  [ticket.ticket_id]: e.target.value,
                }))
              }
            />

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                disabled={isProcessed}
                onClick={() => handleAction(ticket.ticket_id, "approve")}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={isProcessed}
                onClick={() => handleAction(ticket.ticket_id, "reject")}
              >
                Reject
              </Button>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
