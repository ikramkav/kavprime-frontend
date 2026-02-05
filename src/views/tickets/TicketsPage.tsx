// src/views/tickets/TicketsPage.tsx
"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { useGetTicketsListQuery } from "@/redux/services/tickets/ticketsApi";
import TicketCard from "./TicketCard";

export default function TicketsPage() {
  const [employeeId, setEmployeeId] = useState<number>(44);

  // Fetch tickets for the selected employee
  const { data: tickets = [], isLoading, error } = useGetTicketsListQuery(employeeId);

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = parseInt(e.target.value);
    if (!isNaN(newId)) {
      setEmployeeId(newId);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all support tickets
        </Typography>
      </Box>

      {/* Employee ID Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Employee ID"
          type="number"
          value={employeeId}
          onChange={handleEmployeeIdChange}
          variant="outlined"
          size="small"
          inputProps={{ min: 1 }}
          sx={{ width: 200 }}
        />
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load tickets. Please try again later.
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && tickets.length === 0 && (
        <Alert severity="info">
          No tickets found for this employee.
        </Alert>
      )}

      {/* Tickets Grid */}
      {!isLoading && !error && tickets.length > 0 && (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}