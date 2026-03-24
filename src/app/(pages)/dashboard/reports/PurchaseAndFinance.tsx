import { EllipsesText } from "@/components/common/EllipsesText";
import {
  useGetPurchaseListReportQuery,
  useGetPurchaseSummaryReportQuery,
  useGetVendorSummaryReportQuery,
} from "@/redux/services/reports/reportsApi";
import {
  PurchaseSummaryResponse,
  QueryParams,
  VendorSummaryResponse,
} from "@/types";
import { PURCHASE_STATUS_OPTIONS } from "@/utils/constants";
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

const PAGE_SIZE = 10;

export const PurchaseAndFinance: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);

  // Summary date filter
  const [summaryFromDate, setSummaryFromDate] = React.useState<string>("");
  const [summaryToDate, setSummaryToDate] = React.useState<string>("");

  // Purchase list filters + pagination
  const [status, setStatus] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);

  // Vendor pagination
  const [vendorPage, setVendorPage] = React.useState<number>(1);

  const summaryParams: QueryParams = {
    from_date: summaryFromDate || undefined,
    to_date: summaryToDate || undefined,
  };

  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetPurchaseSummaryReportQuery(summaryParams, { skip: tab !== 0 });
  const summary = summaryData as PurchaseSummaryResponse | undefined;

  // 4.2 Purchase list
  interface PurchaseRequest {
    id: number;
    asset_id: number;
    asset_name: string;
    request_type: string;
    triggered_by: string;
    created_by: string | null;
    quantity_needed: number;
    status: string;
    remarks: string | null;
    invoice_attachment: string | null;
    created_at: string;
    updated_at: string;
  }

  interface PurchaseListResponse {
    report: string;
    generated_at: string;
    total: number;
    total_pages: number;
    page: number;
    limit: number;
    has_next: boolean;
    has_prev: boolean;
    purchase_requests: PurchaseRequest[];
  }

  const listParams: QueryParams = {
    page,
    limit: PAGE_SIZE,
    status: status || undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  };

  const {
    data: listData,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listError,
  } = useGetPurchaseListReportQuery(listParams, { skip: tab !== 1 });
  const purchaseReport = listData as PurchaseListResponse | undefined;

  const {
    data: vendorData,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
    isError: vendorError,
  } = useGetVendorSummaryReportQuery(
    {
      page: vendorPage,
      limit: PAGE_SIZE,
    } as QueryParams,
    { skip: tab !== 2 },
  );
  const vendorReport = vendorData as VendorSummaryResponse | undefined;

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
        <Tab label="Purchase Requests" />
        <Tab label="Vendor Summary" />
      </Tabs>

      {/* 4.1 Purchase Request Summary */}
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
              Failed to load purchase summary.
            </Typography>
          ) : summary ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                    Total Requests
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {summary.total_requests}
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Status
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_status.length ? (
                    summary.by_status.map((item) => (
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
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No status breakdown available.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Request Type
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_request_type.length ? (
                    summary.by_request_type.map((item) => (
                      <Box
                        key={item.request_type}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 999,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {item.request_type}: {item.count}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No request type breakdown available.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Triggered By
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_triggered_by.length ? (
                    summary.by_triggered_by.map((item) => (
                      <Box
                        key={item.triggered_by}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 999,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {item.triggered_by}: {item.count}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No triggered-by breakdown available.
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

      {/* 4.2 Purchase Request List */}
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
            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel id="purchase-status-label">Status</InputLabel>
              <Select
                labelId="purchase-status-label"
                value={status}
                label="Status"
                onChange={(e: SelectChangeEvent<string>) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {PURCHASE_STATUS_OPTIONS.map((s) => (
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

          {listLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Typography color="error">
              Failed to load purchase requests.
            </Typography>
          ) : purchaseReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Asset</TableCell>
                      <TableCell>Request Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Triggered By</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Invoice</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseReport.purchase_requests.length ? (
                      purchaseReport.purchase_requests.map((pr) => (
                        <TableRow key={pr.id} hover>
                          <TableCell>{pr.id}</TableCell>
                          <TableCell>
                            {`${pr.asset_name} (#${pr.asset_id})`}
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={pr.request_type} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={pr.status} />
                          </TableCell>
                          <TableCell>{pr.quantity_needed}</TableCell>
                          <TableCell>
                            <EllipsesText value={pr.triggered_by} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={pr.created_by} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={pr.remarks} />
                          </TableCell>
                          <TableCell>
                            {pr.invoice_attachment ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={pr.remarks} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No purchase requests found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {purchaseReport.total_pages >= 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {purchaseReport.page} of {purchaseReport.total_pages} ·
                    Total {purchaseReport.total} requests
                  </Typography>
                  <Pagination
                    color="primary"
                    page={page}
                    count={purchaseReport.total_pages}
                    onChange={(_, value) => setPage(value)}
                    shape="rounded"
                    disabled={purchaseReport.total_pages <= 1}
                  />
                </Stack>
              )}

              {listFetching && !listLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No purchase request data.
            </Typography>
          )}
        </Box>
      )}

      {/* 4.3 Vendor Summary */}
      {tab === 2 && (
        <Box>
          {vendorLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : vendorError ? (
            <Typography color="error">
              Failed to load vendor summary.
            </Typography>
          ) : vendorReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Contact Person</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>GST</TableCell>
                      <TableCell>Assets Purchased</TableCell>
                      <TableCell>Total Spend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendorReport.vendors.length ? (
                      vendorReport.vendors.map((v) => (
                        <TableRow key={v.vendor_id} hover>
                          <TableCell>
                            <EllipsesText value={v.name} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={v.contact_person} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={v.phone} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={v.email} />
                          </TableCell>
                          <TableCell>
                            <EllipsesText value={v.gst_number} />
                          </TableCell>
                          <TableCell>{v.total_assets_purchased}</TableCell>
                          <TableCell>
                            {v.total_spend.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No vendor data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {vendorReport.total_pages >= 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {vendorReport.page} of {vendorReport.total_pages} ·
                    Total {vendorReport.total_vendors} vendors
                  </Typography>
                  <Pagination
                    color="primary"
                    page={vendorPage}
                    count={vendorReport.total_pages}
                    onChange={(_, value) => setVendorPage(value)}
                    shape="rounded"
                    disabled={vendorReport.total_pages <= 1}
                  />
                </Stack>
              )}

              {vendorFetching && !vendorLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">No vendor data.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
