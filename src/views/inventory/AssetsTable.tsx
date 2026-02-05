"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { 
  AssetDetail, 
  EmployeeAssetDetail, 
  InventoryAssetDetail,
  GetEmployeeAssetsResponse,
  GetInventoryAssetsResponse 
} from "@/redux/services/inventory/inventoryApi";

interface AssetsTableProps {
  assets: (AssetDetail | EmployeeAssetDetail | InventoryAssetDetail)[];
  isLoading: boolean;
  isError: boolean;
  onViewDetail: (asset: AssetDetail | EmployeeAssetDetail | InventoryAssetDetail) => void;
  filterType: "all" | "employee" | "inventory";
  employeeData?: GetEmployeeAssetsResponse;
  inventoryData?: GetInventoryAssetsResponse;
}

export default function AssetsTable({
  assets,
  isLoading,
  isError,
  onViewDetail,
  filterType,
  employeeData,
  inventoryData,
}: AssetsTableProps) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    const colors: any = {
      ISSUED: theme.palette.primary.main,
      RETURNED: theme.palette.success.main,
      DAMAGED: theme.palette.error.main,
    };
    return colors[status] || theme.palette.grey[500];
  };

  // 🔹 Helper function to check if asset has employee data
  const hasEmployeeData = (asset: any): asset is AssetDetail | InventoryAssetDetail => {
    return 'employee_name' in asset;
  };

  // 🔹 Helper function to check if asset has inventory data
  const hasInventoryData = (asset: any): asset is AssetDetail | EmployeeAssetDetail => {
    return 'inventory_name' in asset;
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
        Failed to load assets. Please try again.
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
          minHeight: "400px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No assets found.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>Asset ID</TableCell>
            {filterType !== "employee" && (
              <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
            )}
            {filterType !== "employee" && (
              <TableCell sx={{ fontWeight: 600 }}>Brand/Model</TableCell>
            )}
            {filterType !== "inventory" && (
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
            )}
            {filterType === "employee" && (
              <>
                <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Brand/Model</TableCell>
              </>
            )}
            <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Issued Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Issued By</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow
              key={asset.id}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  #{asset.id}
                </Typography>
              </TableCell>
              
              {/* Inventory info - only for "all" and "inventory" filters */}
              {filterType !== "employee" && hasInventoryData(asset) && (
                <>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {asset.inventory_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {asset.inventory_code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {asset.brand} {asset.model}
                    </Typography>
                  </TableCell>
                </>
              )}
              
              {/* Employee info - only for "all" and "employee" filters */}
              {filterType !== "inventory" && hasEmployeeData(asset) && (
                <TableCell>
                  <Typography variant="body2">{asset.employee_name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {asset.employee_email}
                  </Typography>
                </TableCell>
              )}

              {/* For employee filter, show inventory info */}
              {filterType === "employee" && hasInventoryData(asset) && (
                <>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {asset.inventory_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {asset.inventory_code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {asset.brand} {asset.model}
                    </Typography>
                  </TableCell>
                </>
              )}
              
              <TableCell>{asset.quantity_issued}</TableCell>
              <TableCell>
                {new Date(asset.quantity_issued_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{asset.issued_by_name}</TableCell>
              <TableCell>
                <Chip
                  label={asset.status}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(asset.status)}20`,
                    color: getStatusColor(asset.status),
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => onViewDetail(asset)}
                    sx={{
                      color: theme.palette.primary.main,
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}