"use client";

import React from "react";
import { Box, Typography, CircularProgress, Alert, Container } from "@mui/material";
import { useGetTicketHistoryQuery, TicketHistory } from "@/redux/services/tickets/ticketsApi";
import TicketCard from "./TicketCard"; // Adjust path as necessary

export default function TicketHistoryView() {
  // 1. Call the API for employee_id: 44
  const { data: ticketHistory, isLoading, error } = useGetTicketHistoryQuery(44);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load ticket history.</Alert>
      </Box>
    );
  }

  if (!ticketHistory || ticketHistory.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">No ticket history found for Employee #44.</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        My Ticket History
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {ticketHistory.map((ticket: TicketHistory) => (
          <Box key={ticket.ticket_id}>
            <TicketCard
              ticket={{
                id: ticket.ticket_id,
                employee_id: ticket.employee_id,
                ticket_type: ticket.ticket_type,
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                created_at: ticket.created_at,
                updated_at: ticket.created_at,
                workflow_id: ticket.workflow_id,
                current_step: ticket.current_step,
                current_role: null,
              }}
              ticketHistory={ticket}
              canUpdate={false} // History is usually read-only
              onUpdateClick={() => {}}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}