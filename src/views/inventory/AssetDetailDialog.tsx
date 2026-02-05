"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
  CircularProgress,
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
  const { data: asset, isLoading } = useGetAssetDetailQuery(assetId!, {
    skip: !assetId,
  });

  const getStatusColor = (status: string) => {
    const colors: any = {
      ISSUED: theme.palette.primary.main,
      RETURNED: theme.palette.success.main,
      DAMAGED: theme.palette.error.main,
    };
    return colors[status] || theme.palette.grey[500];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
        }}
      >
        Asset Details
      </DialogTitle>
      <DialogContent>
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
        ) : asset ? (
          <Box sx={{ py: 2 }}>
            {/* Asset Status */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label={asset.status}
                sx={{
                  backgroundColor: `${getStatusColor(asset.status)}20`,
                  color: getStatusColor(asset.status),
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  px: 2,
                  py: 2.5,
                }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Inventory Information */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}
              >
                Inventory Information
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Item Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asset.inventory.name}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Item Code
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asset.inventory.code}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Brand
                  </Typography>
                  <Typography variant="body2">{asset.inventory.brand}</Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Model
                  </Typography>
                  <Typography variant="body2">{asset.inventory.model}</Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body2">{asset.inventory.category}</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Employee Information */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}
              >
                Employee Information
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asset.employee.name}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">{asset.employee.email}</Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body2">{asset.employee.role}</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Issue Information */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}
              >
                Issue Information
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Quantity Issued
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asset.quantity_issued}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Issue Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(asset.quantity_issued_date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Issued By
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asset.issued_by.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {asset.issued_by.email}
                  </Typography>
                </Box>
                {asset.return_date && (
                  <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                    <Typography variant="caption" color="text.secondary">
                      Return Date
                    </Typography>
                    <Typography variant="body2">
                      {new Date(asset.return_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {asset.remarks && (
              <>
                <Divider sx={{ mb: 3 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}
                  >
                    Remarks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {asset.remarks}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="contained" sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}