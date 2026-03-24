"use client";

import { EllipsesText } from "@/components/common/EllipsesText";
import {
  QueryParams,
  useGetPendingTicketsByRoleReportQuery,
  useGetTicketApprovalHistoryReportQuery,
  useGetTicketListReportQuery,
  useGetTicketSlaBreachReportQuery,
  useGetTicketSummaryReportQuery,
} from "@/redux/services/reports/reportsApi";
import {
  ApprovalHistoryResponse,
  PendingByRoleResponse,
  SlaBreachResponse,
  TicketListResponse,
  TicketSummaryResponse,
} from "@/types";
import {
  APPROVAL_STATUS_OPTIONS,
  ROLE_OPTIONS,
  TICKET_STATUS_OPTIONS,
  TICKET_TYPE_OPTIONS,
} from "@/utils/constants";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
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

const TicketAndWorkflow: React.FC = () => {
  const theme = useTheme();
  const [innerTab, setInnerTab] = React.useState(0);
  const PAGE_SIZE = 10;

  // Shared filters: date range for summary and list
  const [summaryFromDate, setSummaryFromDate] = React.useState<string>("");
  const [summaryToDate, setSummaryToDate] = React.useState<string>("");

  const [listStatus, setListStatus] = React.useState<string>("");
  const [listType, setListType] = React.useState<string>("");
  const [listEmployeeId, setListEmployeeId] = React.useState<string>("");
  const [listFromDate, setListFromDate] = React.useState<string>("");
  const [listToDate, setListToDate] = React.useState<string>("");
  const [listPage, setListPage] = React.useState<number>(1);

  const [approvalTicketId, setApprovalTicketId] = React.useState<string>("");
  const [approvalRole, setApprovalRole] = React.useState<string>("");
  const [approvalStatus, setApprovalStatus] = React.useState<string>("");
  const [approvalFromDate, setApprovalFromDate] = React.useState<string>("");
  const [approvalToDate, setApprovalToDate] = React.useState<string>("");
  const [approvalPage, setApprovalPage] = React.useState<number>(1);

  const [slaPage, setSlaPage] = React.useState<number>(1);

  // 2.1 Ticket Summary
  const summaryParams: QueryParams = {
    from_date: summaryFromDate || undefined,
    to_date: summaryToDate || undefined,
  };
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetTicketSummaryReportQuery(summaryParams, { skip: innerTab !== 0 });

  const ticketSummary = summaryData as TicketSummaryResponse | undefined;

  // 2.2 Full Ticket List
  const listParams: QueryParams = {
    page: listPage,
    limit: PAGE_SIZE,
    status: listStatus || undefined,
    ticket_type: listType || undefined,
    employee_id: listEmployeeId || undefined,
    from_date: listFromDate || undefined,
    to_date: listToDate || undefined,
  };
  const {
    data: listData,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listError,
  } = useGetTicketListReportQuery(listParams, { skip: innerTab !== 1 });

  const ticketReport = listData as TicketListResponse | undefined;

  // 2.3 Ticket Approval / Rejection History
  const approvalParams: QueryParams = {
    page: approvalPage,
    limit: PAGE_SIZE,
    ticket_id: approvalTicketId || undefined,
    role: approvalRole || undefined,
    status: approvalStatus || undefined,
    from_date: approvalFromDate || undefined,
    to_date: approvalToDate || undefined,
  };
  const {
    data: approvalData,
    isLoading: approvalLoading,
    isFetching: approvalFetching,
    isError: approvalError,
  } = useGetTicketApprovalHistoryReportQuery(approvalParams, {
    skip: innerTab !== 2,
  });

  const approvalReport = approvalData as ApprovalHistoryResponse | undefined;

  // 2.4 SLA Breach Report
  const {
    data: slaData,
    isLoading: slaLoading,
    isFetching: slaFetching,
    isError: slaError,
  } = useGetTicketSlaBreachReportQuery(
    {
      page: slaPage,
      limit: PAGE_SIZE,
    } as QueryParams,
    { skip: innerTab !== 3 },
  );
  const slaReport = slaData as SlaBreachResponse | undefined;

  // 2.5 Pending Tickets by Role
  const {
    data: pendingByRoleData,
    isLoading: pendingByRoleLoading,
    isError: pendingByRoleError,
  } = useGetPendingTicketsByRoleReportQuery(undefined, {
    skip: innerTab !== 4,
  });

  const pendingReport = pendingByRoleData as PendingByRoleResponse | undefined;

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs
        value={innerTab}
        onChange={(_, v) => setInnerTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 2,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
        }}
      >
        <Tab label="Summary" />
        <Tab label="Full Ticket List" />
        <Tab label="Approval / Rejection History" />
        <Tab label="SLA Breach" />
        <Tab label="Pending by Role" />
      </Tabs>

      {/* 2.1 Ticket Summary */}
      {innerTab === 0 && (
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
              value={summaryFromDate}
              onChange={(e) => setSummaryFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To date"
              type="date"
              size="small"
              value={summaryToDate}
              onChange={(e) => setSummaryToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {summaryLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : summaryError ? (
            <Typography color="error">
              Failed to load ticket summary.
            </Typography>
          ) : ticketSummary ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Top cards */}
              <Stack direction="row" flexWrap="wrap" spacing={2} useFlexGap>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Tickets
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {ticketSummary.total_tickets}
                  </Typography>
                </Box>
              </Stack>

              {/* By Status */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Status
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {ticketSummary.by_status.map((item) => (
                    <Box
                      key={item.status}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.status}: {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* By Ticket Type */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Ticket Type
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {ticketSummary.by_ticket_type.map((item) => (
                    <Box
                      key={item.ticket_type}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.ticket_type}: {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* By Created By Role */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Created By Role
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {ticketSummary.by_created_by_role.map((item) => (
                    <Box
                      key={item.created_by_role}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.created_by_role}: {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Pending by Role */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Pending by Role
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {ticketSummary.pending_by_role.map((item) => (
                    <Box
                      key={item.current_role}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.current_role}: {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">No summary data.</Typography>
          )}
        </Box>
      )}

      {/* 2.2 Full Ticket List */}
      {innerTab === 1 && (
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
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="ticket-status-label">Status</InputLabel>
              <Select
                labelId="ticket-status-label"
                value={listStatus}
                label="Status"
                onChange={(e: SelectChangeEvent<string>) => (
                  setListPage(1),
                  setListStatus(e.target.value)
                )}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {TICKET_STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
              <Select
                labelId="ticket-type-label"
                value={listType}
                label="Ticket Type"
                onChange={(e: SelectChangeEvent<string>) => (
                  setListPage(1),
                  setListType(e.target.value)
                )}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {TICKET_TYPE_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Employee ID"
              size="small"
              type="number"
              value={listEmployeeId}
              onChange={(e) => {
                setListPage(1);
                setListEmployeeId(e.target.value);
              }}
            />

            <TextField
              label="From date"
              type="date"
              size="small"
              value={listFromDate}
              onChange={(e) => {
                setListPage(1);
                setListFromDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To date"
              type="date"
              size="small"
              value={listToDate}
              onChange={(e) => {
                setListPage(1);
                setListToDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {listLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Typography color="error">Failed to load ticket list.</Typography>
          ) : (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Current Role</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticketReport?.tickets?.length ? (
                      ticketReport.tickets.map((ticket) => (
                        <TableRow key={ticket.ticket_id} hover>
                          <TableCell>{ticket.ticket_id}</TableCell>
                          <TableCell>
                            <EllipsesText value={ticket.title} />
                          </TableCell>
                          <TableCell>{ticket.ticket_type}</TableCell>
                          <TableCell>{ticket.status}</TableCell>
                          <TableCell>{ticket.employee_name}</TableCell>
                          <TableCell>{ticket.assigned_to || "-"}</TableCell>
                          <TableCell>{ticket.current_role || "-"}</TableCell>
                          <TableCell>
                            {new Date(
                              ticket.created_at || "-",
                            ).toLocaleDateString("en-GB")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No tickets found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {ticketReport && ticketReport.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {ticketReport.page} of {ticketReport.total_pages} ·
                    Total {ticketReport.total} tickets
                  </Typography>
                  <Pagination
                    color="primary"
                    page={listPage}
                    count={ticketReport.total_pages}
                    onChange={(_, value) => setListPage(value)}
                    shape="rounded"
                  />
                </Stack>
              )}

              {listFetching && !listLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          )}
        </Box>
      )}

      {/* 2.3 Ticket Approval / Rejection History */}
      {innerTab === 2 && (
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
              label="Ticket ID"
              size="small"
              type="number"
              value={approvalTicketId}
              onChange={(e) => setApprovalTicketId(e.target.value)}
            />

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="approval-role-label">Role</InputLabel>
              <Select
                labelId="approval-role-label"
                value={approvalRole}
                label="Role"
                onChange={(e: SelectChangeEvent<string>) => (
                  setApprovalPage(1),
                  setApprovalRole(e.target.value)
                )}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {ROLE_OPTIONS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel id="approval-status-label">Status</InputLabel>
              <Select
                labelId="approval-status-label"
                value={approvalStatus}
                label="Status"
                onChange={(e: SelectChangeEvent<string>) => (
                  setApprovalPage(1),
                  setApprovalStatus(e.target.value)
                )}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {APPROVAL_STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="From date"
              type="date"
              size="small"
              value={approvalFromDate}
              onChange={(e) => {
                setApprovalPage(1);
                setApprovalFromDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To date"
              type="date"
              size="small"
              value={approvalToDate}
              onChange={(e) => {
                setApprovalPage(1);
                setApprovalToDate(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {approvalLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : approvalError ? (
            <Typography color="error">
              Failed to load approval history.
            </Typography>
          ) : approvalReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Actor</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Action Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvalReport.history.length ? (
                      approvalReport.history.map((entry) => (
                        <TableRow key={entry.history_id} hover>
                          <TableCell>{entry.ticket_id}</TableCell>
                          <TableCell>
                            <EllipsesText value={entry.ticket_title} />
                          </TableCell>
                          <TableCell>{entry.ticket_type}</TableCell>
                          <TableCell>{entry.role}</TableCell>
                          <TableCell>{entry.action}</TableCell>
                          <TableCell>{entry.actioned_by_name}</TableCell>
                          <TableCell>
                            <EllipsesText value={entry.remarks} />
                          </TableCell>
                          <TableCell>
                            {new Date(
                              entry.action_date || "-",
                            ).toLocaleDateString("en-GB")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No approval history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {approvalReport.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {approvalReport.page} of {approvalReport.total_pages} ·
                    Total {approvalReport.total} entries
                  </Typography>
                  <Pagination
                    color="primary"
                    page={approvalPage}
                    count={approvalReport.total_pages}
                    onChange={(_, value) => setApprovalPage(value)}
                    shape="rounded"
                  />
                </Stack>
              )}

              {approvalFetching && !approvalLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No approval history data.
            </Typography>
          )}
        </Box>
      )}

      {/* 2.4 SLA Breach Report */}
      {innerTab === 3 && (
        <Box>
          {slaLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : slaError ? (
            <Typography color="error">
              Failed to load SLA breach list.
            </Typography>
          ) : slaReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Current Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Step Deadline</TableCell>
                      <TableCell>Overdue (hrs)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {slaReport.tickets.length ? (
                      slaReport.tickets.map((ticket) => (
                        <TableRow key={ticket.ticket_id} hover>
                          <TableCell>{ticket.ticket_id}</TableCell>

                          <TableCell>
                            <EllipsesText value={ticket.title} />
                          </TableCell>
                          <TableCell>{ticket.ticket_type}</TableCell>
                          <TableCell>{ticket.current_role}</TableCell>
                          <TableCell>
                            <EllipsesText value={ticket.status} />
                          </TableCell>

                          <TableCell>
                            {" "}
                            {new Date(ticket.step_deadline).toLocaleDateString(
                              "en-GB",
                            )}
                          </TableCell>
                          <TableCell>{ticket.overdue_by_hours}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No SLA-breached tickets found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {slaReport.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {slaReport.page} of {slaReport.total_pages} · Total{" "}
                    {slaReport.total_breached} breached tickets
                  </Typography>
                  <Pagination
                    color="primary"
                    page={slaPage}
                    count={slaReport.total_pages}
                    onChange={(_, value) => setSlaPage(value)}
                    shape="rounded"
                  />
                </Stack>
              )}

              {slaFetching && !slaLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">No SLA breach data.</Typography>
          )}
        </Box>
      )}

      {/* 2.5 Pending Tickets by Role */}
      {innerTab === 4 && (
        <Box>
          {pendingByRoleLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : pendingByRoleError ? (
            <Typography color="error">
              Failed to load pending tickets by role.
            </Typography>
          ) : pendingReport ? (
            <TableContainer>
              <Table size="small" sx={{ minWidth: 80 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Open Tickets</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReport.pending_by_role.length ? (
                    pendingReport.pending_by_role.map((row) => (
                      <TableRow key={row.current_role} hover>
                        <TableCell>{row.current_role}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No pending ticket data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">
              No pending ticket data.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TicketAndWorkflow;
