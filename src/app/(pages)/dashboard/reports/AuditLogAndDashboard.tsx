"use client";

import { EllipsesText } from "@/components/common/EllipsesText";
import {
  useGetAuditLogReportQuery,
  useGetDashboardStatsReportQuery,
} from "@/redux/services/reports/reportsApi";
import { AuditLogResponse, DashboardStatsResponse } from "@/types";
import {
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

type QueryParams = Record<string, string | number | boolean | undefined>;

const PAGE_SIZE = 10;

export const AuditLogAndDashboard: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);

  // Audit log filters
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);

  const auditParams: QueryParams = {
    page,
    limit: PAGE_SIZE,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  };

  const {
    data: auditData,
    isLoading: auditLoading,
    isFetching: auditFetching,
    isError: auditError,
  } = useGetAuditLogReportQuery(auditParams, { skip: tab !== 0 });
  const auditReport = auditData as AuditLogResponse | undefined;

  // 5.2 Dashboard Stats

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useGetDashboardStatsReportQuery(undefined, { skip: tab !== 1 });
  const dashboard = dashboardData as DashboardStatsResponse | undefined;

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 2,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
        }}
      >
        <Tab label="Master Audit Log" />
        <Tab label="Dashboard Stats" />
      </Tabs>

      {/* 5.1 Master Audit Log */}
      {tab === 0 && (
        <Box>
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              label="From date"
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => {
                setPage(1);
                setFromDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To date"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => {
                setPage(1);
                setToDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {auditLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : auditError ? (
            <Typography color="error">Failed to load audit log.</Typography>
          ) : auditReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Actor</TableCell>
                      <TableCell>Actor Email</TableCell>
                      <TableCell>Target User</TableCell>
                      <TableCell>Target Email</TableCell>
                      <TableCell>Detail</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditReport.events.length ? (
                      auditReport.events.map((event, idx) => (
                        <TableRow key={`${event.timestamp}-${idx}`} hover>
                          <TableCell>{event.event_type}</TableCell>
                          <TableCell>{event.action}</TableCell>
                          <TableCell>
                            {new Date(
                              event.timestamp || "-",
                            ).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell>{event.actor}</TableCell>
                          <TableCell>
                            <EllipsesText value={event.actor_email} />
                          </TableCell>
                          <TableCell>{event.target_user}</TableCell>
                          <TableCell>
                            <EllipsesText value={event.target_user_email} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={event.detail} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={event.remarks} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No audit events found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {auditReport.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {auditReport.page} of {auditReport.total_pages} - Total{" "}
                    {auditReport.total_events} events
                  </Typography>
                  <Pagination
                    color="primary"
                    page={page}
                    count={auditReport.total_pages}
                    onChange={(_, value) => setPage(value)}
                    shape="rounded"
                  />
                </Stack>
              )}

              {auditFetching && !auditLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">No audit data.</Typography>
          )}
        </Box>
      )}

      {/* 5.2 Dashboard Stats */}
      {tab === 1 && (
        <Box>
          {dashboardLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : dashboardError ? (
            <Typography color="error">
              Failed to load dashboard stats.
            </Typography>
          ) : dashboard ? (
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Assets
                  </Typography>
                  <Typography variant="body2">
                    Total: {dashboard.assets.total}
                  </Typography>
                  <Typography variant="body2">
                    Available: {dashboard.assets.available}
                  </Typography>
                  <Typography variant="body2">
                    Issued: {dashboard.assets.issued}
                  </Typography>
                  <Typography variant="body2">
                    Low/Out of stock: {dashboard.assets.low_or_out_of_stock}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Tickets
                  </Typography>
                  <Typography variant="body2">
                    Total: {dashboard.tickets.total}
                  </Typography>
                  <Typography variant="body2">
                    Open: {dashboard.tickets.open}
                  </Typography>
                  <Typography variant="body2">
                    Completed: {dashboard.tickets.completed}
                  </Typography>
                  <Typography variant="body2">
                    Rejected: {dashboard.tickets.rejected}
                  </Typography>
                  <Typography variant="body2">
                    SLA breached: {dashboard.tickets.sla_breached}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Users
                  </Typography>
                  <Typography variant="body2">
                    Total: {dashboard.users.total}
                  </Typography>
                  <Typography variant="body2">
                    Active: {dashboard.users.active}
                  </Typography>
                  <Typography variant="body2">
                    Onboarding: {dashboard.users.onboarding}
                  </Typography>
                  <Typography variant="body2">
                    Offboarding: {dashboard.users.offboarding}
                  </Typography>
                  <Typography variant="body2">
                    Exited: {dashboard.users.exited}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Purchases
                  </Typography>
                  <Typography variant="body2">
                    Pending approval: {dashboard.purchases.pending_approval}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Generated at:{" "}
                {new Date(dashboard.generated_at).toLocaleDateString("en-GB")}
              </Typography>
            </Stack>
          ) : (
            <Typography color="text.secondary">No dashboard stats.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AuditLogAndDashboard;
