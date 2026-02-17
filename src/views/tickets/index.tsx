"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Fab,
  Tabs,
  Tab,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { getUserData } from "@/utils/auth";
import CreateTicketDialog from "./CreateTicketDialog";
import {
  useGetTicketsListQuery,
  useGetAllTicketsQuery,
} from "@/redux/services/tickets/ticketsApi";
import TicketCard from "./TicketCard";
import AssignedTickets from "./AssignedTickets";

export default function TicketManagement() {
  const { userId, role } = getUserData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  // Check if user can create tickets (all except ADMIN)
  const canCreateTicket = role !== "ADMIN" && role !== null;
  const employeeId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id")
      : null;

  // Determine if user is admin or approver role
  const isAdminOrApprover =
    role === "ADMIN" ||
    role === "SENIOR_PMO" ||
    role === "PMO";

  // Fetch employee tickets if not admin/approver
  const {
    data: employeeTickets = [],
    isLoading: employeeLoading,
    isError: employeeError,
  } = useGetTicketsListQuery(employeeId!, {
    skip: !employeeId || isAdminOrApprover,
  });

  // Fetch all tickets if admin/approver
  const {
    data: allTickets = [],
    isLoading: allTicketsLoading,
    isError: allTicketsError,
  } = useGetAllTicketsQuery(undefined, {
    skip: !isAdminOrApprover,
  });

  // Determine which data and loading state to use
  const tickets = isAdminOrApprover
    ? allTickets
    : employeeTickets;

  const isLoading = isAdminOrApprover
    ? allTicketsLoading
    : employeeLoading;

  const isError = isAdminOrApprover
    ? allTicketsError
    : employeeError;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  // 🔹 Sort tickets (keeping your logic)
  const sortedTickets = [...tickets].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  // 🔹 Assigned Tickets (adjust field if needed)
  const assignedTickets = sortedTickets.filter(
    (ticket) => ticket.assigned_to === Number(userId)
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Ticket Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role === "ADMIN" && "View and manage all tickets"}
            {role === "SENIOR_PMO" &&
              "Review and approve tickets pending senior PMO approval"}
            {role === "PMO" &&
              "Review and approve tickets pending team PMO approval"}
            {(role === "EMPLOYEE" || role === "FINANCE") &&
              "Create and track your tickets"}
          </Typography>
        </Box>

        {canCreateTicket && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Create Ticket
          </Button>
        )}
      </Box>

      {/* 🔹 Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="All Tickets" />
        <Tab label="Assigned Tickets" />
      </Tabs>

      {/* No Tickets Message */}
      {tabValue === 0 && sortedTickets.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ p: 3, textAlign: "center" }}
        >
          No tickets found
        </Typography>
      )}

     {tabValue === 1 && <AssignedTickets />}
      {/* Ticket Cards */}
      <Box>
        {(tabValue === 0
          ? sortedTickets
          : assignedTickets
        ).map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            canUpdate={true}
            employeeName={`Employee ${ticket.employee_id}`}
            onUpdateClick={(t) =>
              console.log("Update clicked", t)
            }
          />
        ))}
      </Box>

      {/* Floating Action Button for Mobile */}
      {canCreateTicket && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "flex", sm: "none" },
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Create Ticket Dialog */}
      {canCreateTicket && userId && (
        <CreateTicketDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          employeeId={userId}
        />
      )}
    </Box>
  );
}
