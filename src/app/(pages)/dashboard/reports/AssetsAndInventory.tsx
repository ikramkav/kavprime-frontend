"use client";

import React from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Stack,
  Tabs,
  Tab,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  useGetAssetSummaryReportQuery,
  useGetAssetListReportQuery,
  useGetAssetIssueReturnHistoryReportQuery,
  useGetCurrentlyIssuedAssetsReportQuery,
  useGetLowStockAssetsReportQuery,
  useGetWarrantyExpiryAssetsReportQuery,
} from "@/redux/services/reports/reportsApi";
import {
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  STATUS_OPTIONS,
} from "@/utils/constants";
import {
  AssetListResponse,
  AssetSummaryResponse,
  CurrentlyIssuedResponse,
  IssueReturnResponse,
  LowStockResponse,
  QueryParams,
  WarrantyExpiryResponse,
} from "@/types";

const PAGE_SIZE = 10;

const AssetsAndInventory: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);

  // 1.2 Full asset list filters
  const [category, setCategory] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [condition, setCondition] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);

  // 1.3 Issue / Return filters + pagination
  const [historyAssetId, setHistoryAssetId] = React.useState<string>("");
  const [historyEmployeeId, setHistoryEmployeeId] = React.useState<string>("");
  const [historyStatus, setHistoryStatus] = React.useState<string>("");
  const [historyFrom, setHistoryFrom] = React.useState<string>("");
  const [historyTo, setHistoryTo] = React.useState<string>("");
  const [historyPage, setHistoryPage] = React.useState<number>(1);

  // 1.4 Currently issued pagination
  const [issuedPage, setIssuedPage] = React.useState<number>(1);

  // 1.5 Low stock pagination
  const [lowStockPage, setLowStockPage] = React.useState<number>(1);

  // 1.6 Warranty expiry pagination + filter
  const [warrantyPage, setWarrantyPage] = React.useState<number>(1);
  const [warrantyDays, setWarrantyDays] = React.useState<string>("all");

  const listParams = React.useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      category: category || undefined,
      status: status || undefined,
      condition: condition || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }),
    [page, category, status, condition, fromDate, toDate],
  );

  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetAssetSummaryReportQuery(undefined, { skip: tab !== 0 });
  const summary = summaryData as AssetSummaryResponse | undefined;

  // 1.2 Full asset list
  const {
    data: listData,
    isLoading: listLoading,
    isFetching: listFetching,
    isError: listError,
    error: listErrorObj,
  } = useGetAssetListReportQuery(listParams, { skip: tab !== 1 });
  const report = listData as AssetListResponse | undefined;

  const historyParams: QueryParams = {
    page: historyPage,
    limit: PAGE_SIZE,
    asset_id: historyAssetId || undefined,
    employee_id: historyEmployeeId || undefined,
    status: historyStatus || undefined,
    from_date: historyFrom || undefined,
    to_date: historyTo || undefined,
  };

  const {
    data: historyData,
    isLoading: historyLoading,
    isFetching: historyFetching,
    isError: historyError,
  } = useGetAssetIssueReturnHistoryReportQuery(historyParams, {
    skip: tab !== 2,
  });
  const historyReport = historyData as IssueReturnResponse | undefined;

  const {
    data: issuedData,
    isLoading: issuedLoading,
    isFetching: issuedFetching,
    isError: issuedError,
  } = useGetCurrentlyIssuedAssetsReportQuery(
    {
      page: issuedPage,
      limit: PAGE_SIZE,
    } as QueryParams,
    { skip: tab !== 3 },
  );
  const issuedReport = issuedData as CurrentlyIssuedResponse | undefined;

  const {
    data: lowStockData,
    isLoading: lowStockLoading,
    isFetching: lowStockFetching,
    isError: lowStockError,
  } = useGetLowStockAssetsReportQuery(
    {
      page: lowStockPage,
      limit: PAGE_SIZE,
    } as QueryParams,
    { skip: tab !== 4 },
  );
  const lowStockReport = lowStockData as LowStockResponse | undefined;

  const warrantyParams: QueryParams = {
    page: warrantyPage,
    limit: PAGE_SIZE,
    days:
      warrantyDays === "all"
        ? undefined
        : parseInt(warrantyDays, 10) || undefined,
  };

  const {
    data: warrantyData,
    isLoading: warrantyLoading,
    isFetching: warrantyFetching,
    isError: warrantyError,
  } = useGetWarrantyExpiryAssetsReportQuery(warrantyParams, {
    skip: tab !== 5,
  });
  const warrantyReport = warrantyData as WarrantyExpiryResponse | undefined;

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setPage(1);
    setCategory(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setPage(1);
    setStatus(event.target.value);
  };

  const handleConditionChange = (event: SelectChangeEvent<string>) => {
    setPage(1);
    setCondition(event.target.value);
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setToDate(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
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
        <Tab label="Full Asset List" />
        <Tab label="Issue / Return History" />
        <Tab label="Currently Issued" />
        <Tab label="Low Stock / Out of Stock" />
        <Tab label="Warranty Expiry" />
      </Tabs>

      {/* 1.1 Asset Summary */}
      {tab === 0 && (
        <Box>
          {summaryLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : summaryError ? (
            <Typography color="error">Failed to load asset summary.</Typography>
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
                    Total Assets
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {summary.total_assets}
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
                    Total Purchase Value
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {summary.total_purchase_value.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Status
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_status.map((item) => (
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

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Category
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_category.map((item) => (
                    <Box
                      key={item.category}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.category}: {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Condition
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_condition.map((item) => (
                    <Box
                      key={item.condition}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.condition}: {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Warranty Status
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
                  {summary.by_warranty_status.map((item, idx) => (
                    <Box
                      key={`${item.warranty_status ?? "NONE"}-${idx}`}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {item.warranty_status ?? "NONE"}: {item.count}
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

      {/* 1.2 Full Asset List */}
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
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {CATEGORY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={status}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="condition-filter-label">Condition</InputLabel>
              <Select
                labelId="condition-filter-label"
                value={condition}
                label="Condition"
                onChange={handleConditionChange}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {CONDITION_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="From date"
              type="date"
              size="small"
              value={fromDate}
              onChange={handleFromDateChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To date"
              type="date"
              size="small"
              value={toDate}
              onChange={handleToDateChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {listLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Typography color="error">
              Failed to load asset list.
              {process.env.NODE_ENV === "development" && listErrorObj
                ? ` ${String((listErrorObj as any).status || "")}`
                : ""}
            </Typography>
          ) : (
            <Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset Tag</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Total Qty</TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell>Issued</TableCell>
                      <TableCell>Purchase Date</TableCell>
                      <TableCell>Purchase Price</TableCell>
                      <TableCell>Warranty</TableCell>
                      <TableCell>Warranty End</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report?.assets?.length ? (
                      report.assets.map((asset) => (
                        <TableRow key={asset.asset_id} hover>
                          <TableCell>{asset.asset_tag}</TableCell>
                          <TableCell>{asset.brand}</TableCell>
                          <TableCell>{asset.model_name}</TableCell>
                          <TableCell>{asset.category}</TableCell>
                          <TableCell>{asset.status}</TableCell>
                          <TableCell>{asset.condition}</TableCell>
                          <TableCell>{asset.total_quantity}</TableCell>
                          <TableCell>{asset.available_quantity}</TableCell>
                          <TableCell>{asset.quantity_issued}</TableCell>
                          <TableCell>{asset.purchase_date}</TableCell>
                          <TableCell>
                            {asset.purchase_price.toLocaleString()}
                          </TableCell>
                          <TableCell>{asset.warranty_status}</TableCell>
                          <TableCell>{asset.warranty_end}</TableCell>
                          <TableCell>{asset.assigned_to || "-"}</TableCell>
                          <TableCell>{asset.current_location}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={15} align="center">
                          No assets found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {report && report.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {report.page} of {report.total_pages} · Total{" "}
                    {report.total} assets
                  </Typography>
                  <Pagination
                    color="primary"
                    page={page}
                    count={report.total_pages}
                    onChange={handlePageChange}
                    shape="rounded"
                  />
                </Stack>
              )}

              {listFetching && !listLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* 1.3 Issue / Return History */}
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
            {/* <TextField
              label="Asset ID"
              size="small"
              type="number"
              value={historyAssetId}
              onChange={(e) => {
                setHistoryPage(1);
                setHistoryAssetId(e.target.value);
              }}
            />
            <TextField
              label="Employee ID"
              size="small"
              type="number"
              value={historyEmployeeId}
              onChange={(e) => {
                setHistoryPage(1);
                setHistoryEmployeeId(e.target.value);
              }}
            /> */}
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="history-status-label">Status</InputLabel>
              <Select
                labelId="history-status-label"
                value={historyStatus}
                label="Status"
                onChange={(e: SelectChangeEvent<string>) => {
                  setHistoryPage(1);
                  setHistoryStatus(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="ISSUED">ISSUED</MenuItem>
                <MenuItem value="RETURNED">RETURNED</MenuItem>
                <MenuItem value="DAMAGED">DAMAGED</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="From date"
              type="date"
              size="small"
              value={historyFrom}
              onChange={(e) => {
                setHistoryPage(1);
                setHistoryFrom(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To date"
              type="date"
              size="small"
              value={historyTo}
              onChange={(e) => {
                setHistoryPage(1);
                setHistoryTo(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {historyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : historyError ? (
            <Typography color="error">
              Failed to load issue / return history.
            </Typography>
          ) : historyReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small" sx={{ minWidth: 1050 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Record ID</TableCell>
                      <TableCell>Asset Tag</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Qty Issued</TableCell>
                      <TableCell>Issued By</TableCell>
                      <TableCell>Issued Date</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyReport.records.length ? (
                      historyReport.records.map((record) => (
                        <TableRow key={record.record_id} hover>
                          <TableCell>{record.record_id}</TableCell>
                          <TableCell>{record.asset_tag}</TableCell>
                          <TableCell>{record.asset_category}</TableCell>
                          <TableCell>{record.brand}</TableCell>
                          <TableCell>{record.model_name}</TableCell>
                          <TableCell>{record.employee_name}</TableCell>
                          <TableCell>{record.employee_email}</TableCell>
                          <TableCell>{record.status}</TableCell>
                          <TableCell>{record.quantity_issued}</TableCell>
                          <TableCell>{record.issued_by}</TableCell>
                          <TableCell>
                            {new Date(
                              record.issued_date || "-",
                            ).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell>{(record.remarks, 200)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {historyReport.total_pages >= 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {historyReport.page} of {historyReport.total_pages} ·
                    Total {historyReport.total} records
                  </Typography>
                  <Pagination
                    color="primary"
                    page={historyPage}
                    count={historyReport.total_pages}
                    onChange={(_, value) => setHistoryPage(value)}
                    shape="rounded"
                    disabled={historyReport.total_pages <= 1}
                  />
                </Stack>
              )}

              {historyFetching && !historyLoading && (
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

      {/* 1.4 Currently Issued Assets */}
      {tab === 3 && (
        <Box>
          {issuedLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : issuedError ? (
            <Typography color="error">
              Failed to load currently issued assets.
            </Typography>
          ) : issuedReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Record ID</TableCell>
                      <TableCell>Asset Tag</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Qty Issued</TableCell>
                      <TableCell>Issued Date</TableCell>
                      <TableCell>Days Held</TableCell>
                      <TableCell>Issued By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issuedReport.records.length ? (
                      issuedReport.records.map((record) => (
                        <TableRow key={record.record_id} hover>
                          <TableCell>{record.record_id}</TableCell>
                          <TableCell>{record.asset_tag}</TableCell>
                          <TableCell>{record.category}</TableCell>
                          <TableCell>{record.brand}</TableCell>
                          <TableCell>{record.model_name}</TableCell>
                          <TableCell>{`${record.employee_name} `}</TableCell>
                          <TableCell>{record.quantity_issued}</TableCell>
                          <TableCell>
                            {new Date(
                              record.issued_date || "-",
                            ).toLocaleDateString("en-GB")}
                          </TableCell>
                          <TableCell>{record.days_held}</TableCell>
                          <TableCell>{record.issued_by}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No currently issued assets.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {issuedReport.total_pages >= 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {issuedReport.page} of {issuedReport.total_pages} ·
                    Total {issuedReport.total} records
                  </Typography>
                  <Pagination
                    color="primary"
                    page={issuedPage}
                    count={issuedReport.total_pages}
                    onChange={(_, value) => setIssuedPage(value)}
                    shape="rounded"
                    disabled={issuedReport.total_pages <= 1}
                  />
                </Stack>
              )}

              {issuedFetching && !issuedLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No currently issued assets.
            </Typography>
          )}
        </Box>
      )}

      {/* 1.5 Low Stock / Out of Stock */}
      {tab === 4 && (
        <Box>
          {lowStockLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : lowStockError ? (
            <Typography color="error">
              Failed to load low stock assets.
            </Typography>
          ) : lowStockReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset Tag</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total Qty</TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell>Min Stock Level</TableCell>
                      <TableCell>Vendor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockReport.assets.length ? (
                      lowStockReport.assets.map((asset) => (
                        <TableRow key={asset.asset_id} hover>
                          <TableCell>{asset.asset_tag}</TableCell>
                          <TableCell>{asset.brand}</TableCell>
                          <TableCell>{asset.model_name}</TableCell>
                          <TableCell>{asset.category}</TableCell>
                          <TableCell>{asset.status}</TableCell>
                          <TableCell>{asset.total_quantity}</TableCell>
                          <TableCell>{asset.available_quantity}</TableCell>
                          <TableCell>{asset.minimum_stock_level}</TableCell>
                          <TableCell>{asset.vendor_name || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No low stock or out of stock assets.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {lowStockReport.total_pages >= 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {lowStockReport.page} of {lowStockReport.total_pages} ·
                    Total {lowStockReport.total} assets
                  </Typography>
                  <Pagination
                    color="primary"
                    page={lowStockPage}
                    count={lowStockReport.total_pages}
                    onChange={(_, value) => setLowStockPage(value)}
                    shape="rounded"
                    disabled={lowStockReport.total_pages <= 1}
                  />
                </Stack>
              )}

              {lowStockFetching && !lowStockLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No low stock or out of stock assets.
            </Typography>
          )}
        </Box>
      )}

      {/* 1.6 Warranty Expiry */}
      {tab === 5 && (
        <Box>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="warranty-days-label">Expiry Window</InputLabel>
              <Select
                labelId="warranty-days-label"
                value={warrantyDays}
                label="Expiry Window"
                onChange={(e: SelectChangeEvent<string>) => {
                  setWarrantyPage(1);
                  setWarrantyDays(e.target.value);
                }}
              >
                <MenuItem value="all">Expired Only</MenuItem>
                <MenuItem value="30">Next 30 days</MenuItem>
                <MenuItem value="90">Next 90 days</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {warrantyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : warrantyError ? (
            <Typography color="error">
              Failed to load warranty expiry report.
            </Typography>
          ) : warrantyReport ? (
            <React.Fragment>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset Tag</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Warranty End</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Days Until Expiry</TableCell>
                      <TableCell>Vendor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {warrantyReport.assets.length ? (
                      warrantyReport.assets.map((asset) => (
                        <TableRow key={asset.asset_id} hover>
                          <TableCell>{asset.asset_tag}</TableCell>
                          <TableCell>{asset.brand}</TableCell>
                          <TableCell>{asset.model_name}</TableCell>
                          <TableCell>{asset.category}</TableCell>
                          <TableCell>{asset.warranty_end}</TableCell>
                          <TableCell>
                            {asset.warranty_status ?? "N/A"}
                          </TableCell>
                          <TableCell>{asset.days_until_expiry}</TableCell>
                          <TableCell>{asset.vendor_name || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No assets matching expiry filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {warrantyReport.total_pages > 1 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    Page {warrantyReport.page} of {warrantyReport.total_pages} ·
                    Total {warrantyReport.total} assets
                  </Typography>
                  <Pagination
                    color="primary"
                    page={warrantyPage}
                    count={warrantyReport.total_pages}
                    onChange={(_, value) => setWarrantyPage(value)}
                    shape="rounded"
                  />
                </Stack>
              )}

              {warrantyFetching && !warrantyLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </React.Fragment>
          ) : (
            <Typography color="text.secondary">
              No warranty expiry data.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AssetsAndInventory;
