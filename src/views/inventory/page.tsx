"use client";

import { useGetInventoryListQuery } from "@/redux/services/inventory/inventoryApi";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/utils/constants";
import { formatText } from "@/utils/lib";
import { Search, SendOutlined } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import AddInventoryDialog from "./AddInventoryDialog";
import AssetsManagement from "./AssetsManagement";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EditInventoryDialog from "./EditInventoryDialog";
import InventoryTable from "./InventoryTable";
import IssueInventoryDialog from "./IssueInventoryDialog";

export default function InventoryManagement() {
  const [currentTab, setCurrentTab] = useState<"inventory" | "assets">(
    "inventory"
  );
  const [page, setPage] = useState(1);
  const limit = 10;
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isError } = useGetInventoryListQuery({
    page,
    limit,
    category: categoryFilter || undefined,
    status: statusFilter || undefined,
    search: searchText.trim() || undefined,
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // 🔹 Dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };
  const handleMenuItemClick = (category: string) => {
    setSelectedCategory(category);
    setAddDialogOpen(true);
    handleMenuClose();
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Tabs
        value={currentTab}
        onChange={(_, value) => setCurrentTab(value)}
        sx={{ mb: 3 }}
      >
        <Tab label="Inventory Management" value="inventory" />
        <Tab label="Issued Assets" value="assets" />
      </Tabs>

      {currentTab === "assets" ? (
        <AssetsManagement />
      ) : (
        <>
          {/* Header */}
          <Box mb={3}>
            {/* <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {currentTab === "inventory"
              ? "Inventory Management"
              : "Asset Management"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {currentTab === "inventory"
              ? "Manage inventory items and stock levels"
              : "Track and manage issued inventory assets"}
          </Typography>
        </Box> */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "end",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<SendOutlined />}
                onClick={() => setIssueDialogOpen(true)}
              >
                Issue Item
              </Button>

              <Button
                variant="contained"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleMenuClick}
              >
                Add Item
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleMenuItemClick("Laptop")}>
                  Laptop
                </MenuItem>

                <MenuItem onClick={() => handleMenuItemClick("Mouse")}>
                  Mouse
                </MenuItem>

                <MenuItem onClick={() => handleMenuItemClick("LCD")}>
                  LCD
                </MenuItem>

                <MenuItem onClick={() => handleMenuItemClick("Handfree")}>
                  Handfree
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              label="Search"
              placeholder="Search inventory"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 240 }}
              InputProps={{
                startAdornment: (
                  <Search
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {CATEGORY_OPTIONS.map((category) => (
                <MenuItem key={category} value={category}>
                  {formatText(category)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {formatText(status)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <InventoryTable
            inventory={data?.assets || []}
            isLoading={isLoading}
            isError={isError}
            page={data?.page || page}
            totalPages={data?.total_pages || 1}
            totalItems={data?.total || 0}
            hasNext={data?.has_next || false}
            hasPrev={data?.has_prev || false}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Dialogs */}
          <AddInventoryDialog
            open={addDialogOpen}
            category={selectedCategory}
            onClose={() => setAddDialogOpen(false)}
          />

          <EditInventoryDialog
            open={editDialogOpen}
            item={selectedItem}
            onClose={() => {
              setEditDialogOpen(false);
              setSelectedItem(null);
            }}
          />

          <DeleteConfirmDialog
            open={deleteDialogOpen}
            item={selectedItem}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedItem(null);
            }}
          />

          <IssueInventoryDialog
            open={issueDialogOpen}
            onClose={() => setIssueDialogOpen(false)}
          />
        </>
      )}
    </Paper>
  );
}
