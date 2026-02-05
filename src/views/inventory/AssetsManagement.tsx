"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  TextField,
  MenuItem,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  useGetAllAssetsQuery,
  useGetEmployeeAssetsQuery,
  useGetInventoryAssetsQuery,
  AssetDetail,
  EmployeeAssetDetail,
  InventoryAssetDetail,
} from "@/redux/services/inventory/inventoryApi";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";
import { useGetInventoryListQuery } from "@/redux/services/inventory/inventoryApi";
import AssetsTable from "./AssetsTable";
import AssetDetailDialog from "./AssetDetailDialog";

export default function AssetsManagement() {
  const theme = useTheme();
  const [filterType, setFilterType] = useState<"all" | "employee" | "inventory">("all");
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [selectedInventory, setSelectedInventory] = useState<number | "">("");
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Fetch data
  const { data: usersData } = useGetUsersQuery(undefined);
  const { data: inventoryData } = useGetInventoryListQuery(undefined);
  
  const { data: allAssetsData, isLoading: allAssetsLoading, isError: allAssetsError } = 
    useGetAllAssetsQuery(undefined, { skip: filterType !== "all" });
  
  const { data: employeeAssetsData, isLoading: employeeAssetsLoading, isError: employeeAssetsError } = 
    useGetEmployeeAssetsQuery(selectedEmployee as number, { 
      skip: filterType !== "employee" || !selectedEmployee 
    });
  
  const { data: inventoryAssetsData, isLoading: inventoryAssetsLoading, isError: inventoryAssetsError } = 
    useGetInventoryAssetsQuery(selectedInventory as number, { 
      skip: filterType !== "inventory" || !selectedInventory 
    });

  // Determine current data based on filter
  const isLoading = 
    filterType === "all" ? allAssetsLoading : 
    filterType === "employee" ? employeeAssetsLoading : 
    inventoryAssetsLoading;
  
  const isError = 
    filterType === "all" ? allAssetsError : 
    filterType === "employee" ? employeeAssetsError : 
    inventoryAssetsError;
  
  // 🔹 FIX: Use union type instead of AssetDetail[]
  const assets: (AssetDetail | EmployeeAssetDetail | InventoryAssetDetail)[] = 
    filterType === "all" ? (allAssetsData?.assets || []) : 
    filterType === "employee" ? (employeeAssetsData?.assets || []) : 
    (inventoryAssetsData?.assets || []);

  const handleViewDetail = (asset: AssetDetail | EmployeeAssetDetail | InventoryAssetDetail) => {
    setSelectedAsset(asset.id);
    setDetailDialogOpen(true);
  };

  const handleFilterChange = (newFilter: "all" | "employee" | "inventory") => {
    setFilterType(newFilter);
    setSelectedEmployee("");
    setSelectedInventory("");
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          Asset Management
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Track and manage issued inventory assets
        </Typography>
      </Box>

      {/* Filter Section */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          p: 3,
          mb: 3,
        }}
      >
        <Tabs
          value={filterType}
          onChange={(e, newValue) => handleFilterChange(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="All Assets" value="all" sx={{ textTransform: "none" }} />
          <Tab label="By Employee" value="employee" sx={{ textTransform: "none" }} />
          <Tab label="By Inventory" value="inventory" sx={{ textTransform: "none" }} />
        </Tabs>

        <Box sx={{ display: "flex", gap: 2 }}>
          {filterType === "employee" && (
            <TextField
              select
              label="Select Employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(Number(e.target.value))}
              sx={{ minWidth: 300 }}
            >
              <MenuItem value="">-- Select Employee --</MenuItem>
              {usersData?.users
                ?.filter((user) => user.role === "EMPLOYEE")
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
            </TextField>
          )}

          {filterType === "inventory" && (
            <TextField
              select
              label="Select Inventory Item"
              value={selectedInventory}
              onChange={(e) => setSelectedInventory(Number(e.target.value))}
              sx={{ minWidth: 300 }}
            >
              <MenuItem value="">-- Select Inventory --</MenuItem>
              {inventoryData?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.item_name} - {item.brand} ({item.item_code})
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        {/* Summary Info */}
        {filterType === "all" && allAssetsData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Assets: <strong>{allAssetsData.total_assets}</strong>
            </Typography>
          </Box>
        )}

        {filterType === "employee" && employeeAssetsData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Employee: <strong>{employeeAssetsData.employee_name}</strong> ({employeeAssetsData.employee_email})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Assets: <strong>{employeeAssetsData.total_assets}</strong>
            </Typography>
          </Box>
        )}

        {filterType === "inventory" && inventoryAssetsData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Item: <strong>{inventoryAssetsData.inventory_name}</strong> ({inventoryAssetsData.inventory_code})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Issued: <strong>{inventoryAssetsData.total_issued}</strong> | 
              Total Assignments: <strong>{inventoryAssetsData.total_assets}</strong>
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Assets Table */}
      <AssetsTable
        assets={assets}
        isLoading={isLoading}
        isError={isError}
        onViewDetail={handleViewDetail}
        filterType={filterType}
        employeeData={filterType === "employee" ? employeeAssetsData : undefined}
        inventoryData={filterType === "inventory" ? inventoryAssetsData : undefined}
      />

      {/* Asset Detail Dialog */}
      <AssetDetailDialog
        open={detailDialogOpen}
        assetId={selectedAsset}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedAsset(null);
        }}
      />
    </Box>
  );
}