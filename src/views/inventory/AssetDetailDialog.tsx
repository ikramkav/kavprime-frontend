"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  useGetAssetDetailQuery,
} from "@/redux/services/inventory/inventoryApi";

interface AssetDetailDialogProps {
  open: boolean;
  assetId: number | null;
  onClose: () => void;
}

export default function AssetDetailDialog({
  open,
  assetId,
  onClose,
}: AssetDetailDialogProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { data: asset, isLoading, isError } = useGetAssetDetailQuery(assetId!, {
    skip: !assetId,
  });

  const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return "-";
    return String(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      ISSUED: theme.palette.primary.main,
      RETURNED: theme.palette.success.main,
      DAMAGED: theme.palette.error.main,
    };
    return colors[status] || theme.palette.grey[500];
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420, md: 520 },
          p: 2.5,
        },
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Asset Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {asset?.asset?.tag || "-"}
      </Typography>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ my: 2 }}>
          Failed to load asset details. Please try again.
        </Alert>
      ) : asset && asset.asset && asset.employee ? (
        <>
          <Divider sx={{ mb: 1.5 }} />
          <Stack spacing={1.25}>
            <Box
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
                Id
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.id}
              </Typography>
            </Box>

            <Box
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
                Asset Tag
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.asset.tag}
              </Typography>
            </Box>

            <Box
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
                Brand
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.asset.brand}
              </Typography>
            </Box>

            <Box
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
                Model
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.asset.model}
              </Typography>
            </Box>

            <Box
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
                Category
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.asset.category}
              </Typography>
            </Box>

            <Box
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
                Status
              </Typography>
              <Chip
                label={asset.status}
                size="small"
                sx={{
                  backgroundColor: `${getStatusColor(asset.status)}20`,
                  color: getStatusColor(asset.status),
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: "24px",
                }}
              />
            </Box>

            <Box
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
                Employee Name
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.employee.name}
              </Typography>
            </Box>

            <Box
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
                Employee Email
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.employee.email}
              </Typography>
            </Box>

            <Box
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
                Employee Role
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.employee.role}
              </Typography>
            </Box>

            <Box
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
                Quantity Issued
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.quantity_issued}
              </Typography>
            </Box>

            <Box
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
                Issue Date
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {formatDate(asset.issue_date)}
              </Typography>
            </Box>

            <Box
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
                Issued By
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.issued_by.name}
              </Typography>
            </Box>

            <Box
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
                Issued By Email
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {asset.issued_by.email}
              </Typography>
            </Box>

            {asset.return_date && (
              <Box
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
                  Return Date
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ textAlign: isSmallScreen ? "left" : "right" }}
                >
                  {formatDate(asset.return_date)}
                </Typography>
              </Box>
            )}

            {asset.remarks && (
              <Box
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
                  Remarks
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ textAlign: isSmallScreen ? "left" : "right" }}
                >
                  {asset.remarks}
                </Typography>
              </Box>
            )}

            <Box
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
                Created At
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {formatDate(asset.created_at)}
              </Typography>
            </Box>

            <Box
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
                Updated At
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: isSmallScreen ? "left" : "right" }}
              >
                {formatDate(asset.updated_at)}
              </Typography>
            </Box>
          </Stack>
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography color="text.secondary" variant="body2">
            No asset details available.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}