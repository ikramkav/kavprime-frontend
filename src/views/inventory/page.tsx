"use client";

import React, { useState } from "react";
import { Box, Button, Typography, useTheme, Tabs, Tab } from "@mui/material";
import { Add, SendOutlined, Inventory2Outlined } from "@mui/icons-material";
import {
  useGetInventoryListQuery,
  InventoryItem,
} from "@/redux/services/inventory/inventoryApi";
import InventoryTable from "./InventoryTable";
import AddInventoryDialog from "./AddInventoryDialog";
import EditInventoryDialog from "./EditInventoryDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import IssueInventoryDialog from "./IssueInventoryDialog";
import AssetsManagement from "./AssetsManagement"; // 🔹 NEW

export default function InventoryManagement() {
  const theme = useTheme();
  const { data, isLoading, isError } = useGetInventoryListQuery(undefined);

  const [currentTab, setCurrentTab] = useState<"inventory" | "assets">("inventory"); // 🔹 NEW
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {currentTab === "inventory" ? "Inventory Management" : "Asset Management"}
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
        </Box>
        
        {/* 🔹 Buttons - Only show for inventory tab */}
        {currentTab === "inventory" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SendOutlined />}
              onClick={() => setIssueDialogOpen(true)}
              sx={{
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.light + "10",
                },
              }}
            >
              Issue Item
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: "10px",
              }}
            >
              Add Item
            </Button>
          </Box>
        )}
      </Box>

      {/* 🔹 NEW: Tabs */}
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab 
          label="Inventory Items" 
          value="inventory" 
          icon={<Inventory2Outlined />}
          iconPosition="start"
          sx={{ textTransform: "none", fontSize: "1rem" }} 
        />
        <Tab 
          label="Issued Assets" 
          value="assets" 
          icon={<SendOutlined />}
          iconPosition="start"
          sx={{ textTransform: "none", fontSize: "1rem" }} 
        />
      </Tabs>

      {/* 🔹 Conditional Rendering based on tab */}
      {currentTab === "inventory" ? (
        <InventoryTable
          inventory={data || []}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <AssetsManagement />
      )}

      {/* Dialogs - Only for inventory tab */}
      <AddInventoryDialog
        open={addDialogOpen}
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
    </Box>
  );
}
