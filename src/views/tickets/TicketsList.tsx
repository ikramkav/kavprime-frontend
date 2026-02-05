"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useGetTicketsListQuery } from "@/redux/services/tickets/ticketsApi";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";
import TicketCard from "./TicketCard";
import UpdateTicketStatusDialog from "./UpdateTicketStatusDialog";
import { Ticket } from "@/redux/services/tickets/ticketsApi";

interface TicketsListProps {
  userRole: string;
  userId: number;
}

export default function TicketsList({ userRole, userId }: TicketsListProps) {
  const { data: tickets, isLoading, isError } = useGetTicketsListQuery(userId.toString());
  const { data: usersData } = useGetUsersQuery();

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Determine if user can update tickets
  const canUpdateTickets = ["ADMIN", "PMO", "SENIOR_PMO"].includes(userRole);

  // Filter tickets based on role
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];

    let filtered = [...tickets];

    // Role-based filtering
    if (userRole === "SENIOR_PMO") {
      filtered = filtered.filter((ticket) => ticket.status === "PENDING_SENIOR_PMO");
    } else if (userRole === "PMO") {
      filtered = filtered.filter((ticket) => ticket.status === "PENDING_TEAM_PMO");
    } else if (userRole === "EMPLOYEE" || userRole === "FINANCE") {
      filtered = filtered.filter((ticket) => ticket.employee_id === userId);
    }
    // ADMIN sees all tickets

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return filtered;
  }, [tickets, userRole, userId, searchQuery, statusFilter]);

  // Get unique statuses for filter
  const availableStatuses = useMemo(() => {
    if (!tickets) return [];
    const statuses = [...new Set(tickets.map((t) => t.status))];
    return statuses;
  }, [tickets]);

  const handleUpdateClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setUpdateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load tickets. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          {availableStatuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace(/_/g, " ")}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <Alert severity="info">No tickets found.</Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredTickets.map((ticket) => {
            const employee = usersData?.users?.find((user) => user.id === ticket.employee_id);
            return (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                employeeName={employee?.name}
                canUpdate={canUpdateTickets}
                onUpdateClick={handleUpdateClick}
              />
            );
          })}
        </Box>
      )}

      {/* Update Status Dialog */}
      {canUpdateTickets && (
        <UpdateTicketStatusDialog
          open={updateDialogOpen}
          onClose={() => {
            setUpdateDialogOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          userRole={userRole}
        />
      )}
    </Box>
  );
}