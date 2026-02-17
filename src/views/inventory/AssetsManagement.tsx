"use client";

import React, { useState, useMemo } from "react";
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

type AssetUnion = AssetDetail | EmployeeAssetDetail | InventoryAssetDetail;

export default function AssetsManagement() {
  const theme = useTheme();

  const [filterType, setFilterType] = useState<
    "all" | "employee" | "inventory"
  >("all");
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [selectedInventory, setSelectedInventory] = useState<number | "">("");

  // 🔹 NEW FILTER STATES
  const [searchText, setSearchText] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Fetch data
  const { data: usersData } = useGetUsersQuery(undefined);
  const { data: inventoryData } = useGetInventoryListQuery(undefined);

  const {
    data: allAssetsData,
    isLoading: allAssetsLoading,
    isError: allAssetsError,
  } = useGetAllAssetsQuery(undefined, { skip: filterType !== "all" });

  const {
    data: employeeAssetsData,
    isLoading: employeeAssetsLoading,
    isError: employeeAssetsError,
  } = useGetEmployeeAssetsQuery(selectedEmployee as number, {
    skip: filterType !== "employee" || !selectedEmployee,
  });

  const {
    data: inventoryAssetsData,
    isLoading: inventoryAssetsLoading,
    isError: inventoryAssetsError,
  } = useGetInventoryAssetsQuery(selectedInventory as number, {
    skip: filterType !== "inventory" || !selectedInventory,
  });

  const isLoading =
    filterType === "all"
      ? allAssetsLoading
      : filterType === "employee"
        ? employeeAssetsLoading
        : inventoryAssetsLoading;

  const isError =
    filterType === "all"
      ? allAssetsError
      : filterType === "employee"
        ? employeeAssetsError
        : inventoryAssetsError;

  const assets: AssetUnion[] =
    filterType === "all"
      ? allAssetsData?.assets || []
      : filterType === "employee"
        ? employeeAssetsData?.assets || []
        : inventoryAssetsData?.assets || [];

  // 🔹 CLIENT-SIDE FILTER LOGIC (ADMIN POWER SEARCH)
  const filteredAssets = useMemo(() => {
    return assets.filter((asset: any) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        !search ||
        asset.id?.toString().includes(search) ||
        asset.inventory_name?.toLowerCase().includes(search) ||
        asset.brand?.toLowerCase().includes(search) ||
        asset.model?.toLowerCase().includes(search) ||
        asset.employee_name?.toLowerCase().includes(search) ||
        asset.employee_email?.toLowerCase().includes(search);

      const matchesBrand = !brandFilter || asset.brand === brandFilter;

      const matchesEmployee =
        !employeeFilter || asset.employee_name === employeeFilter;

      return matchesSearch && matchesBrand && matchesEmployee;
    });
  }, [assets, searchText, brandFilter, employeeFilter]);

  const handleViewDetail = (asset: AssetUnion) => {
    setSelectedAsset(asset.id);
    setDetailDialogOpen(true);
  };

  const handleFilterChange = (newFilter: "all" | "employee" | "inventory") => {
    setFilterType(newFilter);
    setSelectedEmployee("");
    setSelectedInventory("");
    setSearchText("");
    setBrandFilter("");
    setEmployeeFilter("");
  };

  // 🔹 Unique dropdown values
  const uniqueBrands = [
    ...new Set(assets.map((a: any) => a.brand).filter(Boolean)),
  ];
  const uniqueEmployees = [
    ...new Set(assets.map((a: any) => a.employee_name).filter(Boolean)),
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Asset Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
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
          onChange={(e, v) => handleFilterChange(v)}
          sx={{ mb: 3 }}
        >
          <Tab label="Issued Assets" value="all" />
          {/* <Tab label="By Employee" value="employee" /> */}
          {/* <Tab label="By Inventory" value="inventory" /> */}
        </Tabs>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search"
            placeholder="Name, brand, model, employee..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ minWidth: 280 }}
          />

          <TextField
            select
            label="Brand"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All Brands</MenuItem>
            {uniqueBrands.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Employee"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All Employees</MenuItem>
            {uniqueEmployees.map((emp) => (
              <MenuItem key={emp} value={emp}>
                {emp}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Assets Table */}
      <AssetsTable
        assets={filteredAssets}
        isLoading={isLoading}
        isError={isError}
        onViewDetail={handleViewDetail}
        filterType={filterType}
        employeeData={
          filterType === "employee" ? employeeAssetsData : undefined
        }
        inventoryData={
          filterType === "inventory" ? inventoryAssetsData : undefined
        }
      />

      {/* Detail Dialog */}
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
