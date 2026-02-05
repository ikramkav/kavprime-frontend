"use client";

import React from "react";
import { Box, Typography, CircularProgress, Alert, Grid, Container } from "@mui/material";
import { useGetTicketHistoryQuery, TicketHistoryItem } from "@/redux/services/tickets/ticketsApi";
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

      <Grid container spacing={2}>
        {ticketHistory.map((ticket: TicketHistoryItem) => (
          <Grid item xs={12} key={ticket.ticket_id}>
            <TicketCard
              ticket={ticket}
              canUpdate={false} // History is usually read-only
              onUpdateClick={() => {}}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}