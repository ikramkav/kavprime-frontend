"use client";

import { EllipsesText } from "@/components/common/EllipsesText";
import {
  useGetEmployeeAssetHistoryReportQuery,
  useGetExitedEmployeesReportQuery,
  useGetOffboardingChecklistReportQuery,
  useGetUserSummaryReportQuery,
} from "@/redux/services/reports/reportsApi";
import {
  AssetHistoryResponse,
  ExitedEmployeesResponse,
  OffboardingResponse,
  UserSummaryResponse,
} from "@/types";
import {
  Box,
  Chip,
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

export const UserAndEmployee: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);
  // Filters and pagination
  const [historyUserId, setHistoryUserId] = React.useState<string>("");
  const [historyPage, setHistoryPage] = React.useState<number>(1);

  const [offboardingUserId, setOffboardingUserId] = React.useState<string>("");

  const [exitedPage, setExitedPage] = React.useState<number>(1);

  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetUserSummaryReportQuery(undefined, { skip: tab !== 0 });
  const summary = summaryData as UserSummaryResponse | undefined;

  const {
    data: assetHistoryData,
    isLoading: assetHistoryLoading,
    isFetching: assetHistoryFetching,
    isError: assetHistoryError,
  } = useGetEmployeeAssetHistoryReportQuery(
    {
      userId: historyUserId,
      params: { page: historyPage, limit: PAGE_SIZE } as QueryParams,
    },
    { skip: tab !== 1 || !historyUserId },
  );
  const assetHistory = assetHistoryData as AssetHistoryResponse | undefined;

  const {
    data: offboardingData,
    isLoading: offboardingLoading,
    isError: offboardingError,
  } = useGetOffboardingChecklistReportQuery(
    { userId: offboardingUserId },
    { skip: tab !== 2 || !offboardingUserId },
  );
  const offboarding = offboardingData as OffboardingResponse | undefined;

  const {
    data: exitedData,
    isLoading: exitedLoading,
    isFetching: exitedFetching,
    isError: exitedError,
  } = useGetExitedEmployeesReportQuery(
    {
      page: exitedPage,
      limit: PAGE_SIZE,
    } as QueryParams,
    { skip: tab !== 3 },
  );
  const exitedReport = exitedData as ExitedEmployeesResponse | undefined;

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
        <Tab label="Summary" />
        <Tab label="Employee Asset History" />
        <Tab label="Offboarding Checklist" />
        <Tab label="Exited Employees" />
      </Tabs>

      {/* 3.1 User summary */}
      {tab === 0 && (
        <Box>
          {summaryLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : summaryError ? (
            <Typography color="error">Failed to load user summary.</Typography>
          ) : summary ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {summary.total_users}
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
                    Active Accounts
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {summary.active_accounts}
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
                    Inactive Accounts
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {summary.inactive_accounts}
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Role
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_role.length ? (
                    summary.by_role.map((item) => (
                      <Box
                        key={item.role}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 999,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {item.role}: {item.count}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No role breakdown available.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Employment Status
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_employment_status.length ? (
                    summary.by_employment_status.map((item) => (
                      <Box
                        key={item.employment_status}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 999,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {item.employment_status}: {item.count}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No employment status breakdown available.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">No summary data.</Typography>
          )}
        </Box>
      )}

      {/* 3.2 Employee asset history */}
      {tab === 1 && (
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
              label="User ID"
              type="number"
              size="small"
              value={historyUserId}
              onChange={(e) => {
                setHistoryPage(1);
                setHistoryUserId(e.target.value);
              }}
            />
          </Box>

          {!historyUserId ? (
            <Typography color="text.secondary">
              Enter a User ID to view asset history.
            </Typography>
          ) : assetHistoryLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : assetHistoryError ? (
            <Typography color="error">
              Failed to load asset history for user {historyUserId}.
            </Typography>
          ) : assetHistory ? (
            <React.Fragment>
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                mb={2}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 260,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {assetHistory.employee_name} ({assetHistory.employee_email})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Role: {assetHistory.role} | Status:{" "}
                    {assetHistory.employment_status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Joined: {assetHistory.join_date}{" "}
                    {assetHistory.exit_date
                      ? `| Exited: ${assetHistory.exit_date}`
                      : ""}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 180,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Records
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {assetHistory.total}
                  </Typography>
                </Box>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Record ID</TableCell>
                      <TableCell>Asset Tag</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Qty Issued</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Issued By</TableCell>
                      <TableCell>Issued Date</TableCell>
                      <TableCell>Return Date</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assetHistory.issue_return_history.length ? (
                      assetHistory.issue_return_history.map((record) => (
                        <TableRow key={record.record_id} hover>
                          <TableCell>
                            <EllipsesText value={record.type} />
                          </TableCell>

                          <TableCell>{record.record_id}</TableCell>
                          <TableCell>
                            <EllipsesText value={record.asset_tag} />
                          </TableCell>

                          <TableCell>
                            <EllipsesText value={record.category} />
                          </TableCell>

                          <TableCell>
                            <EllipsesText value={record.brand} />
                          </TableCell>

                          <TableCell>
                            <EllipsesText value={record.model_name} />
                          </TableCell>

                          <TableCell>{record.quantity_issued}</TableCell>
                          <TableCell>
                            <EllipsesText value={record.status} />
                          </TableCell>

                          <TableCell>
                            <EllipsesText value={record.issued_by} />
                          </TableCell>

                          <TableCell>
                            {new Date(
                              record.issued_date || "-",
                            ).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={record.return_date} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={record.remarks} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          No history records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {assetHistory.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {assetHistory.page} of {assetHistory.total_pages} -
                    Total {assetHistory.total} records
                  </Typography>
                  <Pagination
                    color="primary"
                    page={historyPage}
                    count={assetHistory.total_pages}
                    onChange={(_, value) => setHistoryPage(value)}
                    shape="rounded"
                  />
                </Stack>
              )}

              {assetHistoryFetching && !assetHistoryLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">No history data.</Typography>
          )}
        </Box>
      )}

      {/* 3.3 Offboarding checklist */}
      {tab === 2 && (
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
              label="User ID"
              type="number"
              size="small"
              value={offboardingUserId}
              onChange={(e) => setOffboardingUserId(e.target.value)}
            />
          </Box>

          {!offboardingUserId ? (
            <Typography color="text.secondary">
              Enter a User ID to view offboarding checklist.
            </Typography>
          ) : offboardingLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : offboardingError ? (
            <Typography color="error">
              Failed to load offboarding checklist for user {offboardingUserId}.
            </Typography>
          ) : offboarding ? (
            <React.Fragment>
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                mb={2}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 240,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {offboarding.employee_name} (ID: {offboarding.employee_id})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {offboarding.employment_status}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 200,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Offboarding Clear
                  </Typography>
                  <Chip
                    label={offboarding.offboarding_clear ? "Yes" : "No"}
                    color={
                      offboarding.offboarding_clear ? "success" : "warning"
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    minWidth: 200,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Summary
                  </Typography>
                  <Typography variant="body2">
                    Unreturned assets:{" "}
                    {offboarding.summary.unreturned_asset_records}
                  </Typography>
                  <Typography variant="body2">
                    Directly assigned:{" "}
                    {offboarding.summary.directly_assigned_assets}
                  </Typography>
                  <Typography variant="body2">
                    Open tickets: {offboarding.summary.open_tickets}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Unreturned Issued Assets
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Asset Tag</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Detail</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {offboarding.unreturned_issued_assets.length ? (
                          offboarding.unreturned_issued_assets.map((asset) => (
                            <TableRow key={asset.id} hover>
                              <TableCell>{asset.id}</TableCell>
                              <TableCell>
                                <EllipsesText value={asset.asset_tag} />
                              </TableCell>
                              <TableCell>
                                <EllipsesText value={asset.category} />
                              </TableCell>
                              <TableCell>{asset.quantity_issued}</TableCell>
                              <TableCell>
                                <EllipsesText value={asset.detail} />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No unreturned assets.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Directly Assigned Assets
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Asset Tag</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Detail</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {offboarding.directly_assigned_assets.length ? (
                          offboarding.directly_assigned_assets.map((asset) => (
                            <TableRow key={asset.id} hover>
                              <TableCell>{asset.id}</TableCell>
                              <TableCell>
                                <EllipsesText value={asset.asset_tag} />
                              </TableCell>
                              <TableCell>
                                <EllipsesText value={asset.category} />
                              </TableCell>
                              <TableCell>{asset.quantity_issued}</TableCell>
                              <TableCell>
                                <EllipsesText value={asset.detail} />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No directly assigned assets.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Open Tickets
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Asset Tag</TableCell>
                          <TableCell>Detail</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {offboarding.open_tickets.length ? (
                          offboarding.open_tickets.map((ticket) => (
                            <TableRow key={ticket.id} hover>
                              <TableCell>{ticket.id}</TableCell>
                              <TableCell>
                                <EllipsesText value={ticket.category} />
                              </TableCell>
                              <TableCell>
                                <EllipsesText value={ticket.asset_tag} />
                              </TableCell>
                              <TableCell>
                                <EllipsesText value={ticket.detail} />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              No open tickets.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Stack>
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No offboarding checklist data.
            </Typography>
          )}
        </Box>
      )}

      {/* 3.4 Exited employees */}
      {tab === 3 && (
        <Box>
          {exitedLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : exitedError ? (
            <Typography color="error">
              Failed to load exited employees.
            </Typography>
          ) : exitedReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell>Exit Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exitedReport.employees.length ? (
                      exitedReport.employees.map((emp) => (
                        <TableRow key={emp.employee_id} hover>
                          <TableCell>{emp.employee_id}</TableCell>
                          <TableCell>
                            <EllipsesText value={emp.name} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={emp.email} />
                          </TableCell>
                          <TableCell>{emp.role}</TableCell>
                          <TableCell>
                            {new Date(emp.join_date).toLocaleDateString(
                              "en-GB",
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(emp.exit_date).toLocaleDateString(
                              "en-GB",
                            )}
                          </TableCell>
                          <TableCell>
                            {emp.is_active ? "Active" : "Inactive"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No exited employees found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {exitedReport.total_pages >= 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {exitedReport.page} of {exitedReport.total_pages} -
                    Total {exitedReport.total} employees
                  </Typography>
                  <Pagination
                    color="primary"
                    page={exitedPage}
                    count={exitedReport.total_pages}
                    onChange={(_, value) => setExitedPage(value)}
                    shape="rounded"
                    disabled={exitedReport.total_pages <= 1}
                  />
                </Stack>
              )}

              {exitedFetching && !exitedLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No exited employee data.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserAndEmployee;
