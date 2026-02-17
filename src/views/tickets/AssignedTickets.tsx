"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { getUserData } from "@/utils/auth";
import {
  useGetAssignedTicketsQuery,
  useAddActionMutation,
} from "@/redux/services/tickets/ticketsApi";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";

export default function AssignedTickets() {
  const { userId } = getUserData();

  const { data, isLoading, isError } = useGetAssignedTicketsQuery(Number(userId));
  const [addAction] = useAddActionMutation();

  const [remarksMap, setRemarksMap] = useState<{ [key: number]: string }>({});
  const { data: usersData } = useGetUsersQuery();

  const [processedTickets, setProcessedTickets] = useState<number[]>([]);
  const [assignedTo, setAssignedTo] = useState<{ [ticketId: number]: number | "" }>({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Log all users to console
  useEffect(() => {
    if (usersData?.users) {
      console.log("All Users from GetUsers API:");
      usersData.users.forEach((user) => {
        console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
  }, [usersData]);

  const filteredUsers = usersData?.users || [];

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Unified function for approve/reject
  const handleAction = async (
    ticketId: number,
    actionType: "approve" | "reject"
  ) => {
    if (processedTickets.includes(ticketId)) return;

    const selectedUserId = assignedTo[ticketId];
    const selectedUser = filteredUsers.find((user) => user.id === selectedUserId);

    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: "Please select a user to assign before proceeding",
        severity: "error",
      });
      return;
    }

    const payload = {
      ticket_id: ticketId,
      action: actionType,
      remarks:
        remarksMap[ticketId] ||
        (actionType === "approve" ? "Checked and approved" : "Rejected"),
      role_email_map: {
        [selectedUser.role]: selectedUser.email,
      },
      role: "",
    };

    console.log("Payload to send:", payload);

    try {
      await addAction(payload).unwrap();
      setProcessedTickets((prev) => [...prev, ticketId]);

      setSnackbar({
        open: true,
        message: `Ticket "${ticketId}" ${actionType === "approve" ? "approved" : "rejected"} successfully`,
        severity: "success",
      });
    } catch (error) {
      console.log("Action failed", error);
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
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ p: 3, textAlign: "center" }}
      >
        No assigned tickets found
      </Typography>
    );

  // Sort tickets by ticket_id descending (latest on top)
  const sortedTickets = [...data.tickets].sort((a, b) => b.ticket_id - a.ticket_id);

  return (
    <Box>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {sortedTickets.map((ticket) => {
        const isProcessed = processedTickets.includes(ticket.ticket_id);

        return (
          <Paper key={ticket.ticket_id} sx={{ p: 3, mb: 2 }} elevation={2}>
            <Typography variant="h6" fontWeight={600}>
              {ticket.title}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {ticket.description}
            </Typography>

            {/* Assign To Dropdown */}
            <TextField
              select
              fullWidth
              label="Assign To"
              value={assignedTo[ticket.ticket_id] || ""}
              onChange={(e) =>
                setAssignedTo((prev) => ({
                  ...prev,
                  [ticket.ticket_id]: Number(e.target.value),
                }))
              }
              required
              disabled={isLoading || isProcessed}
              sx={{ mt: 2 }}
            >
              {filteredUsers.length === 0 && (
                <MenuItem disabled value="">
                  No users available
                </MenuItem>
              )}
              {filteredUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Status: {ticket.status}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Employee: {ticket.employee.name}
            </Typography>

            {/* Remarks Field */}
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

            {/* Approve / Reject Buttons */}
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
