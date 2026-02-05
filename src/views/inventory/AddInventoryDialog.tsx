"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useAddInventoryMutation } from "@/redux/services/inventory/inventoryApi";
import { toast } from "react-toastify";

interface AddInventoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddInventoryDialog({
  open,
  onClose,
}: AddInventoryDialogProps) {
  const theme = useTheme();
  const [addInventory, { isLoading }] = useAddInventoryMutation();

  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    category: "",
    brand: "",
    model: "",
    description: "",
    total_quantity: "",
    minimum_stock_level: "",
    purchase_date: "",
    purchase_price_per_item: "",
    vendor_name: "",
    attachment: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await addInventory({
        ...formData,
        total_quantity: parseInt(formData.total_quantity),
        minimum_stock_level: parseInt(formData.minimum_stock_level),
        purchase_price_per_item: parseFloat(formData.purchase_price_per_item),
      }).unwrap();
      toast.success(result.message || "Inventory added successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to add inventory",
      );
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setFormData({
      ...formData,
      attachment: file,
    });
  };

  const handleClose = () => {
    setFormData({
      item_code: "",
      item_name: "",
      category: "",
      brand: "",
      model: "",
      description: "",
      total_quantity: "",
      minimum_stock_level: "",
      purchase_date: "",
      purchase_price_per_item: "",
      vendor_name: "",
      attachment: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Add New Inventory Item
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Row 1: Item Code and Item Name */}
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Item Code"
                  name="item_code"
                  value={formData.item_code}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Box>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Box>
            </Box>

            {/* Row 2: Category and Brand */}
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Box>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Box>
            </Box>

            {/* Row 3: Model and Vendor Name */}
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Box>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Vendor Name"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Box>
            </Box>

            {/* Row 4: Quantities and Price */}
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 30%", minWidth: "150px" }}>
                <TextField
                  fullWidth
                  label="Total Quantity"
                  name="total_quantity"
                  type="number"
                  value={formData.total_quantity}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  inputProps={{ min: 1 }}
                />
              </Box>
              <Box sx={{ flex: "1 1 30%", minWidth: "150px" }}>
                <TextField
                  fullWidth
                  label="Minimum Stock Level"
                  name="minimum_stock_level"
                  type="number"
                  value={formData.minimum_stock_level}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  inputProps={{ min: 0 }}
                />
              </Box>
              <Box sx={{ flex: "1 1 30%", minWidth: "150px" }}>
                <TextField
                  fullWidth
                  label="Purchase Price (per item)"
                  name="purchase_price_per_item"
                  type="number"
                  value={formData.purchase_price_per_item}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  inputProps={{ min: 0, step: "0.01" }}
                />
              </Box>
            </Box>

            {/* Row 5: Purchase Date */}
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
                <TextField
                  fullWidth
                  label="Attachment"
                  name="attachment"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls",
                  }}
                />
              </Box>
            </Box>

            {/* Row 6: Description */}
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading && <CircularProgress size={16} />}
            sx={{
              textTransform: "none",
              px: 3,
            }}
          >
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
