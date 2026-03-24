"use client";

import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  useTheme,
} from "@mui/material";
import { AssignmentReturn, Visibility } from "@mui/icons-material";
import {
  AssetDetail,
  IssuedAssetAssignment,
  useGetIssuedAssetsWithAssignmentsQuery,
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
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedAssetRow, setSelectedAssetRow] = useState<AssetDetail | null>(
    null
  );
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<number[]>(
    []
  );
  const [remarks, setRemarks] = useState("");

  const {
    data: issuedAssetsData,
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
  } = useGetIssuedAssetsWithAssignmentsQuery(
      {
        page: 1,
        limit: 10,
        issued: true,
        status: "ISSUED",
        asset_id: selectedAssetRow?.asset_id,
        search: selectedAssetRow?.asset_id
          ? undefined
          : selectedAssetRow?.asset_tag,
      },
      {
        skip: !returnDialogOpen || !selectedAssetRow,
      }
    );

  const [returnAsset, { isLoading: isReturning }] = useReturnAssetMutation();

  const assignments: IssuedAssetAssignment[] = useMemo(() => {
    if (!issuedAssetsData?.assets?.length || !selectedAssetRow) {
      return [];
    }

    const exactById = selectedAssetRow.asset_id
      ? issuedAssetsData.assets.find(
          (asset) => asset.asset_id === selectedAssetRow.asset_id
        )
      : undefined;

    const exactByTag = issuedAssetsData.assets.find(
      (asset) => asset.asset_tag === selectedAssetRow.asset_tag
    );

    return (exactById || exactByTag || issuedAssetsData.assets[0])?.assignments || [];
  }, [issuedAssetsData, selectedAssetRow]);

  const issuedAssignments = assignments.filter(
    (assignment) => assignment.status === "ISSUED"
  );

  const allIssuedSelected =
    issuedAssignments.length > 0 &&
    issuedAssignments.every((assignment) =>
      selectedAssignmentIds.includes(assignment.issue_record_id)
    );

  const someIssuedSelected =
    selectedAssignmentIds.length > 0 && !allIssuedSelected;

  const handleOpenReturnDialog = (asset: AssetDetail) => {
    setSelectedAssetRow(asset);
    setSelectedAssignmentIds([]);
    setRemarks("");
    setReturnDialogOpen(true);
  };

  const handleCloseReturnDialog = () => {
    setReturnDialogOpen(false);
    setSelectedAssetRow(null);
    setSelectedAssignmentIds([]);
    setRemarks("");
  };

  const toggleAssignment = (issueRecordId: number) => {
    setSelectedAssignmentIds((prev) =>
      prev.includes(issueRecordId)
        ? prev.filter((id) => id !== issueRecordId)
        : [...prev, issueRecordId]
    );
  };

  const handleToggleSelectAll = () => {
    if (allIssuedSelected) {
      setSelectedAssignmentIds([]);
      return;
    }
    setSelectedAssignmentIds(
      issuedAssignments.map((assignment) => assignment.issue_record_id)
    );
  };

  const handleReturnAssets = async () => {
    if (!selectedAssignmentIds.length) {
      toast.error("Please select at least one issued assignment to return.");
      return;
    }

    try {
      await returnAsset({
        asset_ids: selectedAssignmentIds,
        status: "RETURNED",
        remarks: remarks.trim() || undefined,
      }).unwrap();

      toast.success("Selected asset assignments returned successfully.");
      handleCloseReturnDialog();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to return selected assignments.";
      toast.error(message);
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
            <TableRow
              sx={{
                backgroundColor: theme.palette.background.default,
              }}
            >
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
                key={asset.record_id}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>
                  <EllipsesText value={asset.asset_tag} />
                </TableCell>
                <TableCell>{asset.category || "-"}</TableCell>
                <TableCell>
                  <Typography>
                    <EllipsesText value={asset.model_name} />
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    <EllipsesText value={asset.brand} />
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{asset.employee_name}</Typography>
                </TableCell>
                <TableCell>{asset.quantity_issued}</TableCell>
                <TableCell>{asset.status || "-"}</TableCell>
                <TableCell>
                  {asset.issued_date
                    ? new Date(asset.issued_date).toLocaleDateString()
                    : "-"}
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
                          onClick={() => handleOpenReturnDialog(asset)}
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

      <Dialog
        open={returnDialogOpen}
        onClose={handleCloseReturnDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Return Issued Assignments</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select one or more issued assignments for
            {` ${selectedAssetRow?.asset_tag || "this asset"}`}.
          </Typography>

          {isAssignmentsLoading ? (
            <Box
              sx={{
                py: 4,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : isAssignmentsError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load assignment list for this asset.
            </Alert>
          ) : (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, mb: 2 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allIssuedSelected}
                        indeterminate={someIssuedSelected}
                        onChange={handleToggleSelectAll}
                        disabled={!issuedAssignments.length}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Issue ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Issue Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No assignments found for this asset.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => {
                      const selectable = assignment.status === "ISSUED";
                      const checked = selectedAssignmentIds.includes(
                        assignment.issue_record_id
                      );

                      return (
                        <TableRow key={assignment.issue_record_id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={checked}
                              disabled={!selectable}
                              onChange={() =>
                                toggleAssignment(assignment.issue_record_id)
                              }
                            />
                          </TableCell>
                          <TableCell>#{assignment.issue_record_id}</TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {assignment.employee_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {assignment.employee_email}
                            </Typography>
                          </TableCell>
                          <TableCell>{assignment.quantity_issued}</TableCell>
                          <TableCell>
                            {new Date(assignment.issue_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{assignment.status}</TableCell>
                          <TableCell>{assignment.location || "-"}</TableCell>
                          <TableCell>{assignment.issue_reason || "-"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TextField
            label="Remarks (Optional)"
            placeholder="Add remarks for return operation..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseReturnDialog} disabled={isReturning}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReturnAssets}
            disabled={!selectedAssignmentIds.length || isReturning}
          >
            {isReturning ? "Returning..." : "Return Selected"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
