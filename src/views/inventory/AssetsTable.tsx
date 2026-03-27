"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AssignmentReturn, Visibility } from "@mui/icons-material";
import {
  AssetDetail,
  useReturnAssetMutation,
} from "@/redux/services/inventory/inventoryApi";
import { EllipsesText } from "@/components/common/EllipsesText";
import { toast } from "react-toastify";

interface AssetsTableProps {
  assets: AssetDetail[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onViewDetail: (asset: AssetDetail) => void;
}

export default function AssetsTable({
  assets,
  isLoading,
  isError,
  page,
  totalPages,
  totalItems,
  hasNext,
  hasPrev,
  onPageChange,
  onViewDetail,
}: AssetsTableProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [returnDrawerOpen, setReturnDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetDetail | null>(null);
  const [returnStatus, setReturnStatus] = useState<"RETURNED" | "DAMAGED">("RETURNED");
  const [remarks, setRemarks] = useState("");

  const [returnAsset, { isLoading: isReturning }] = useReturnAssetMutation();

  const handleOpenReturnDrawer = (asset: AssetDetail) => {
    setSelectedAsset(asset);
    setReturnStatus("RETURNED");
    setRemarks("");
    setReturnDrawerOpen(true);
  };

  const handleCloseReturnDrawer = () => {
    setReturnDrawerOpen(false);
    setSelectedAsset(null);
    setReturnStatus("RETURNED");
    setRemarks("");
  };

  const handleReturnAsset = async () => {
    if (!selectedAsset) return;

    try {
      await returnAsset({
        asset_ids: [selectedAsset.id],
        status: returnStatus,
        remarks: remarks.trim() || undefined,
      }).unwrap();

      toast.success(`Asset returned successfully as ${returnStatus}.`);
      handleCloseReturnDrawer();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to return asset.";
      toast.error(message);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load issued assets. Please try again.
      </Alert>
    );
  }

  if (assets.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No issued assets found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
              <TableCell sx={{ fontWeight: 600 }}>Asset Tag</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Issued Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset.id}
                sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
              >
                <TableCell>
                  <EllipsesText value={asset.asset_tag} />
                </TableCell>
                <TableCell>{asset.category || "-"}</TableCell>
                <TableCell>
                  <EllipsesText value={asset.model_name} />
                </TableCell>
                <TableCell>
                  <EllipsesText value={asset.brand} />
                </TableCell>
                <TableCell>{asset.employee_name}</TableCell>
                <TableCell>{asset.quantity_issued}</TableCell>
                <TableCell>{asset.status || "-"}</TableCell>
                <TableCell>
                  {asset.issued_date ? formatDate(asset.issued_date) : "-"}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetail(asset)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {asset.status === "ISSUED" && (
                      <Tooltip title="Return Asset">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenReturnDrawer(asset)}
                          sx={{ color: theme.palette.warning.main }}
                        >
                          <AssignmentReturn fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 2,
          }}
        >
          <Typography color="text.secondary">
            Page {page} of {totalPages} | Total {totalItems} records
          </Typography>
          <Pagination
            page={page}
            count={totalPages}
            color="primary"
            disabled={totalPages <= 1}
            onChange={(_, value) => {
              if (
                value !== page &&
                ((value > page && hasNext) ||
                  (value < page && hasPrev) ||
                  value === 1)
              ) {
                onPageChange(value);
              }
            }}
          />
        </Box>
      )}

      {/* Return Asset Drawer */}
      <Drawer
        anchor="right"
        open={returnDrawerOpen}
        onClose={handleCloseReturnDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420, md: 520 },
            p: 2.5,
          },
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Return Asset
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedAsset?.asset_tag || "-"}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {/* Asset Details */}
        <Stack spacing={1.25} sx={{ mb: 3 }}>
          {[
            { label: "Asset Tag", value: selectedAsset?.asset_tag },
            { label: "Category", value: selectedAsset?.category },
            { label: "Model", value: selectedAsset?.model_name },
            { label: "Brand", value: selectedAsset?.brand },
            { label: "Employee", value: selectedAsset?.employee_name },
            { label: "Quantity Issued", value: selectedAsset?.quantity_issued },
            { label: "Current Status", value: selectedAsset?.status },
            {
              label: "Issued Date",
              value: selectedAsset?.issued_date
                ? formatDate(selectedAsset.issued_date)
                : "-",
            },
          ].map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: isSmallScreen ? "flex-start" : "space-between",
                alignItems: isSmallScreen ? "flex-start" : "center",
                gap: 0.5,
                py: 0.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {value ?? "-"}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Return Form */}
        <Stack spacing={2}>
          <TextField
            select
            label="Return Status"
            value={returnStatus}
            onChange={(e) => setReturnStatus(e.target.value as "RETURNED" | "DAMAGED")}
            fullWidth
            size="small"
          >
            <MenuItem value="RETURNED">RETURNED</MenuItem>
            <MenuItem value="DAMAGED">DAMAGED</MenuItem>
          </TextField>

          <TextField
            label="Remarks (Optional)"
            placeholder="Add remarks for return operation..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            size="small"
          />

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleCloseReturnDrawer}
              disabled={isReturning}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleReturnAsset}
              disabled={isReturning}
              color={returnStatus === "DAMAGED" ? "error" : "primary"}
            >
              {isReturning ? "Submitting..." : "Confirm Return"}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}
