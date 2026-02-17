"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  History as HistoryIcon,
  CheckCircle,
  TripOrigin,
  HourglassEmpty,
} from "@mui/icons-material";

import {
  Ticket,
  TicketHistory,
  useAddActionMutation,
  useGetTicketHistoryQuery,
} from "@/redux/services/tickets/ticketsApi";

interface TicketCardProps {
  ticket: Ticket;
  ticketHistory?: TicketHistory;
  employeeName?: string;
  canUpdate: boolean;
  onUpdateClick: (ticket: Ticket) => void;
}

export default function TicketCard({
  ticket,
  ticketHistory,
  employeeName,
  canUpdate,
  onUpdateClick,
}: TicketCardProps) {
  const theme = useTheme();

  // State for Dialog
  const [historyOpen, setHistoryOpen] = useState(false);
  const [addAction, { isLoading: isActionLoading }] = useAddActionMutation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const [actionTaken, setActionTaken] = useState(false);

  // State for Role
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role.toUpperCase());
    }
  }, []);

  const handleApprove = async () => {
    try {
      await addAction({
        ticket_id: ticket.id,
        action: "APPROVE",
        remarks: `Approved by ${userRole}`,
      }).unwrap();
      setActionTaken(true);
      setSnackbarMessage("Ticket Approved Successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error approving ticket:", error);
      setSnackbarMessage("Failed to approve ticket");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleReject = async () => {
    try {
      await addAction({
        ticket_id: ticket.id,
        action: "REJECT",
        remarks: `Rejected by ${userRole}`,
      }).unwrap();
      setActionTaken(true);
      setSnackbarMessage("Ticket Rejected");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      setSnackbarMessage("Failed to reject ticket");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // RTK Query Hook to fetch history
  const {
    data: apiHistoryData,
    isLoading,
    isError,
  } = useGetTicketHistoryQuery(ticket.id, { skip: !historyOpen });

  const getStatusColor = (status: string) => {
    if (status.includes("PENDING")) return "warning";
    if (status === "APPROVED" || status === "COMPLETED") return "success";
    if (status === "REJECTED") return "error";
    return "default";
  };

  const getTicketTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentStatus = ticket.status.toUpperCase();

  const isPendingTeamPmo = currentStatus.includes("PENDING_TEAM_PMO");
  const isPendingSeniorPmo = currentStatus.includes("PENDING_SENIOR_PMO");
  const isPendingAdmin = currentStatus.includes("PENDING_ADMIN");

  const canCurrentUserApprove =
    (userRole === "TEAM_PMO" && isPendingTeamPmo) ||
    (userRole === "SENIOR_PMO" && isPendingSeniorPmo) ||
    (userRole === "PMO" && isPendingTeamPmo) ||
    (userRole === "ADMIN" && isPendingAdmin);

  const isApproverRole =
    userRole === "ADMIN" ||
    userRole === "SENIOR_PMO" ||
    userRole === "PMO" ||
    userRole === "TEAM_PMO";

  const showButtons =
    canCurrentUserApprove &&
    !actionTaken &&
    !currentStatus.includes("REJECTED") &&
    !currentStatus.includes("APPROVED") &&
    !currentStatus.includes("COMPLETED");

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          marginBottom: 3,
          transition: "all 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {ticket.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {ticket.description}
              </Typography>
            </Box>

            <Box>
              <IconButton
                onClick={() => setHistoryOpen(true)}
                color="info"
                size="small"
                title="View History"
              >
                <HistoryIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Chip
              label={ticket.status.replace(/_/g, " ")}
              size="small"
              sx={{
                backgroundColor:
                  ticket.status === "REJECTED"
                    ? "#d32f2f" // custom red
                    : getStatusColor(ticket.status) === "warning"
                      ? "#ed6c02"
                      : getStatusColor(ticket.status) === "success"
                        ? "#2e7d32"
                        : "grey.400",
                color: "white",
              }}
            />

            <Chip
              label={getTicketTypeLabel(ticket.ticket_type)}
              variant="outlined"
              size="small"
              sx={{
                borderColor:
                  theme.palette.mode === "dark" ? "primary.main" : "grey.400",
              }}
            />
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}
          >
            {employeeName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Person sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {employeeName}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Created: {formatDate(ticket.created_at)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* --- History Dialog --- */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryIcon /> Ticket History
        </DialogTitle>
        <Divider />
        <DialogContent>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Alert severity="error">Failed to load ticket history.</Alert>
          )}

          {!isLoading &&
            !isError &&
            apiHistoryData &&
            apiHistoryData.steps &&
            apiHistoryData.steps.length > 0 && (
              <List>
                {apiHistoryData.steps.map((step, index) => (
                  <ListItem
                    key={index}
                    alignItems="flex-start"
                    sx={{
                      bgcolor: index % 2 === 0 ? "action.hover" : "transparent",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      {step.action_date ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <TripOrigin color="disabled" fontSize="small" />
                      )}
                    </Box>

                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            Step {step.step_order}:{" "}
                            {step.role.replace(/_/g, " ")}
                          </Typography>
                          <Typography variant="body2">
                            SLA Hours: {step.sla_hours}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(step.action_date)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          State: {step.state}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

          {!isLoading &&
            !isError &&
            (!apiHistoryData ||
              !apiHistoryData.steps ||
              apiHistoryData.steps.length === 0) && (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No history found.
                </Typography>
              </Box>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
