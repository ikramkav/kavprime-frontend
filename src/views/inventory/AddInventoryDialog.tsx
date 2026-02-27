"use client";

import React, { useState, useEffect } from "react";
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
  Typography,
  MenuItem,
} from "@mui/material";
import { useAddInventoryMutation } from "@/redux/services/inventory/inventoryApi";
import { toast } from "react-toastify";

interface AddInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: string; // 👈 receive category
}

export default function AddInventoryDialog({
  open,
  onClose,
  category,
}: AddInventoryDialogProps) {
  const theme = useTheme();
  const [addInventory, { isLoading }] = useAddInventoryMutation();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      category: category || "",
    }));
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await addInventory(formData).unwrap();
      toast.success(result.message || "Inventory added successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to add inventory"
      );
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const renderCommonLifecycle = () => (
    <>
      <Typography fontWeight={600}>Device Lifecycle</Typography>

      <TextField fullWidth label="Status" name="status" onChange={handleChange} />
      <TextField fullWidth label="Condition" name="condition" onChange={handleChange} />
      <TextField fullWidth label="Assigned To" name="assigned_to" onChange={handleChange} />
      <TextField fullWidth label="Assigned Date" type="date" name="assigned_date" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth label="Returned Date" type="date" name="returned_date" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth label="Current Location" name="current_location" onChange={handleChange} />
    </>
  );

  const renderPurchase = () => (
    <>
      <Typography fontWeight={600}>Purchase & Warranty</Typography>

      <TextField fullWidth type="date" label="Purchase Date" name="purchase_date" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth label="Purchase Price" name="purchase_price" onChange={handleChange} />
      <TextField fullWidth label="Vendor Name" name="vendor_name" onChange={handleChange} />
      <TextField fullWidth label="Invoice Number" name="invoice_number" onChange={handleChange} />
      <TextField fullWidth type="date" label="Warranty Start" name="warranty_start" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth type="date" label="Warranty End" name="warranty_end" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth label="Warranty Status" name="warranty_status" onChange={handleChange} />
    </>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={600}>
        Add New {category}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

            {/* Asset Identification */}
            <Typography fontWeight={600}>Asset Identification</Typography>

            <TextField fullWidth label="Asset Tag" name="asset_tag" onChange={handleChange} />
            <TextField fullWidth label="Serial Number" name="serial_number" onChange={handleChange} />
            <TextField fullWidth label="Brand" name="brand" onChange={handleChange} />
            <TextField fullWidth label="Model Name" name="model_name" onChange={handleChange} />
            <TextField fullWidth label="Type" name="type" onChange={handleChange} />

            {/* 🔥 Category Specific Fields */}

            {category === "Laptop" && (
              <>
                <Typography fontWeight={600}>Hardware Specifications</Typography>

                <TextField fullWidth label="Processor" name="processor" onChange={handleChange} />
                <TextField fullWidth label="RAM Size" name="ram_size" onChange={handleChange} />
                <TextField fullWidth label="Storage Type" name="storage_type" onChange={handleChange} />
                <TextField fullWidth label="Storage Capacity" name="storage_capacity" onChange={handleChange} />
                <TextField fullWidth label="Graphics Card" name="graphics_card" onChange={handleChange} />
                <TextField fullWidth label="Screen Size" name="screen_size" onChange={handleChange} />
                <TextField fullWidth label="OS Installed" name="os_installed" onChange={handleChange} />
              </>
            )}

            {category === "Mouse" && (
              <>
                <Typography fontWeight={600}>Technical Specifications</Typography>

                <TextField
                  select
                  fullWidth
                  label="Connectivity Type"
                  name="connectivity_type"
                  onChange={handleChange}
                >
                  <MenuItem value="USB Wired">USB Wired</MenuItem>
                  <MenuItem value="Bluetooth">Bluetooth</MenuItem>
                </TextField>
              </>
            )}

            {category === "LCD" && (
              <>
                <Typography fontWeight={600}>Technical Specifications</Typography>

                <TextField fullWidth label="Screen Size (inch)" name="screen_size_inch" onChange={handleChange} />
                <TextField fullWidth label="Resolution" name="resolution" onChange={handleChange} />
                <TextField fullWidth label="Panel Type" name="panel_type" onChange={handleChange} />
                <TextField fullWidth label="Touchscreen (Yes/No)" name="touchscreen" onChange={handleChange} />
                <TextField fullWidth label="Curved Screen (Yes/No)" name="curved_screen" onChange={handleChange} />
              </>
            )}

            {category === "Handfree" && (
              <>
                <Typography fontWeight={600}>Technical Specifications</Typography>

                <TextField fullWidth label="Connectivity Type" name="connectivity_type" onChange={handleChange} />
              </>
            )}

            {renderPurchase()}
            {renderCommonLifecycle()}

            <Typography fontWeight={600}>Additional Details</Typography>
            <TextField fullWidth multiline rows={3} label="Remarks" name="remarks" onChange={handleChange} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading && <CircularProgress size={16} />}
          >
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}