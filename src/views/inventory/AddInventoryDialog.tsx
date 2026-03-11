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
import {
  useAddInventoryMutation,
  useGetVendorsQuery,
} from "@/redux/services/inventory/inventoryApi";
import { toast } from "react-toastify";

interface AddInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: string;
}

export default function AddInventoryDialog({
  open,
  onClose,
  category,
}: AddInventoryDialogProps) {
  const theme = useTheme();
  const [addInventory, { isLoading }] = useAddInventoryMutation();
  const { data: vendorsData, isLoading: vendorsLoading } = useGetVendorsQuery();

  const getEmptyFormData = () => ({
    category: category || "",
    asset_tag: "",
    serial_number: "",
    brand: "",
    model_name: "",
    total_quantity: "",
    available_quantity: "",
    issued_quantity: "",
    minimum_stock_level: "",
    purchase_date: "",
    purchase_price: "",
    vendor_name: "",
    invoice_number: "",
    warranty_start: "",
    warranty_end: "",
    warranty_status: "",
    condition: "",
    current_location: "",
    remarks: "",
    // laptop
    model_number: "",
    type: "",
    processor: "",
    processor_generation: "",
    ram_size: "",
    ram_type: "",
    storage_type: "",
    storage_capacity: "",
    graphics_card: "",
    battery_health: "",
    os_installed: "",
    // mouse / other
    connectivity_type: "",
    // monitor
    screen_size_inch: "",
    resolution: "",
    panel_type: "",
    touchscreen: "",
    curved_screen: "",
    input_ports: "",
    usb_hub_available: "",
    speakers_available: "",
  });

  const [formData, setFormData] = useState<any>(getEmptyFormData());

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
      // Remove empty string fields before sending
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined,
        ),
      );

      const result = await addInventory(cleanedData).unwrap();
      toast.success(result.message || "Inventory added successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to add inventory",
      );
    }
  };

  const handleClose = () => {
    setFormData(getEmptyFormData());
    onClose();
  };

  // ─── Shared Sections ───────────────────────────────────────────────────────

  const renderAssetIdentification = () => (
    <>
      <Typography fontWeight={600}>Asset Identification</Typography>
      <TextField
        fullWidth
        label="Asset Tag"
        name="asset_tag"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Serial Number"
        name="serial_number"
        onChange={handleChange}
      />
      <TextField fullWidth label="Brand" name="brand" onChange={handleChange} />
      <TextField
        fullWidth
        label="Model Name"
        name="model_name"
        onChange={handleChange}
      />
    </>
  );

  const renderQuantity = () => (
    <>
      <Typography fontWeight={600}>Quantity</Typography>
      <TextField
        fullWidth
        label="Total Quantity"
        name="total_quantity"
        type="number"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Available Quantity"
        name="available_quantity"
        type="number"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Issued Quantity"
        name="issued_quantity"
        type="number"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Minimum Stock Level"
        name="minimum_stock_level"
        type="number"
        onChange={handleChange}
      />
    </>
  );

  const renderPurchase = () => (
    <>
      <Typography fontWeight={600}>Purchase & Warranty</Typography>
      <TextField
        fullWidth
        type="date"
        label="Purchase Date"
        name="purchase_date"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="Purchase Price"
        name="purchase_price"
        onChange={handleChange}
      />
      <TextField
        select
        fullWidth
        label="Vendor Name"
        name="vendor_name"
        onChange={handleChange}
        value={formData.vendor_name || ""}
        required
      >
        <MenuItem value="" disabled>
          Select vendor
        </MenuItem>
        {vendorsLoading ? (
          <MenuItem disabled>
            <CircularProgress size={18} sx={{ mr: 1 }} />
            Loading vendors...
          </MenuItem>
        ) : !vendorsData?.vendors?.length ? (
          <MenuItem disabled>No vendors found</MenuItem>
        ) : (
          vendorsData.vendors.map((v) => (
            <MenuItem key={v.id} value={v.name}>
              {v.name}
            </MenuItem>
          ))
        )}
      </TextField>
      <TextField
        fullWidth
        label="Invoice Number"
        name="invoice_number"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        type="date"
        label="Warranty Start"
        name="warranty_start"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        type="date"
        label="Warranty End"
        name="warranty_end"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        select
        fullWidth
        label="Warranty Status"
        name="warranty_status"
        onChange={handleChange}
      >
        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
        <MenuItem value="EXPIRED">EXPIRED</MenuItem>
        <MenuItem value="VOID">VOID</MenuItem>
      </TextField>
    </>
  );

  const renderConditionLocation = () => (
    <>
      <Typography fontWeight={600}>Condition & Location</Typography>
      <TextField
        select
        fullWidth
        label="Condition"
        name="condition"
        onChange={handleChange}
      >
        <MenuItem value="NEW">NEW</MenuItem>
        <MenuItem value="GOOD">GOOD</MenuItem>
        <MenuItem value="FAIR">FAIR</MenuItem>
        <MenuItem value="POOR">POOR</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Current Location"
        name="current_location"
        onChange={handleChange}
      />
    </>
  );

  // ─── Category-Specific Sections ────────────────────────────────────────────

  const renderLaptopFields = () => (
    <>
      <Typography fontWeight={600}>Hardware Specifications</Typography>
      <TextField
        fullWidth
        label="Model Number"
        name="model_number"
        onChange={handleChange}
      />
      <TextField fullWidth label="Type" name="type" onChange={handleChange} />
      <TextField
        fullWidth
        label="Processor"
        name="processor"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Processor Generation"
        name="processor_generation"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="RAM Size"
        name="ram_size"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="RAM Type"
        name="ram_type"
        onChange={handleChange}
      />
      <TextField
        select
        fullWidth
        label="Storage Type"
        name="storage_type"
        onChange={handleChange}
      >
        <MenuItem value="SSD">SSD</MenuItem>
        <MenuItem value="HDD">HDD</MenuItem>
        <MenuItem value="NVMe">NVMe</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Storage Capacity"
        name="storage_capacity"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Graphics Card"
        name="graphics_card"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Battery Health (%)"
        name="battery_health"
        type="number"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="OS Installed"
        name="os_installed"
        onChange={handleChange}
      />
    </>
  );

  const renderMouseFields = () => (
    <>
      <Typography fontWeight={600}>Technical Specifications</Typography>
      <TextField
        select
        fullWidth
        label="Connectivity Type"
        name="connectivity_type"
        onChange={handleChange}
      >
        <MenuItem value="USB_WIRED">USB Wired</MenuItem>
        <MenuItem value="BLUETOOTH">Bluetooth</MenuItem>
        <MenuItem value="WIRELESS_DONGLE">Wireless Dongle</MenuItem>
      </TextField>
    </>
  );

  const renderMonitorFields = () => (
    <>
      <Typography fontWeight={600}>Technical Specifications</Typography>
      <TextField
        fullWidth
        label="Screen Size (inch)"
        name="screen_size_inch"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Resolution"
        name="resolution"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Panel Type"
        name="panel_type"
        onChange={handleChange}
      />
      <TextField
        select
        fullWidth
        label="Touchscreen"
        name="touchscreen"
        onChange={handleChange}
      >
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </TextField>
      <TextField
        select
        fullWidth
        label="Curved Screen"
        name="curved_screen"
        onChange={handleChange}
      >
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Input Ports (comma separated)"
        name="input_ports"
        onChange={handleChange}
      />
      <TextField
        select
        fullWidth
        label="USB Hub Available"
        name="usb_hub_available"
        onChange={handleChange}
      >
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </TextField>
      <TextField
        select
        fullWidth
        label="Speakers Available"
        name="speakers_available"
        onChange={handleChange}
      >
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </TextField>
    </>
  );

  const renderOtherFields = () => (
    <>
      <Typography fontWeight={600}>Technical Specifications</Typography>
      <TextField fullWidth label="Type" name="type" onChange={handleChange} />
      <TextField
        select
        fullWidth
        label="Connectivity Type"
        name="connectivity_type"
        onChange={handleChange}
      >
        <MenuItem value="BLUETOOTH">Bluetooth</MenuItem>
        <MenuItem value="USB_WIRED">USB Wired</MenuItem>
        <MenuItem value="WIRELESS">Wireless</MenuItem>
        <MenuItem value="N/A">N/A</MenuItem>
      </TextField>
    </>
  );

  const renderPrinterFields = () =>
    // Printers have no extra technical spec fields beyond the shared ones
    null;

  // ─── Field Router ──────────────────────────────────────────────────────────

  const renderCategoryFields = () => {
    switch (category) {
      case "LAPTOP":
        return renderLaptopFields();
      case "MOUSE":
        return renderMouseFields();
      case "MONITOR":
        return renderMonitorFields();
      case "OTHER":
        return renderOtherFields();
      case "PRINTER":
        return renderPrinterFields();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={600}>Add New {category}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {renderAssetIdentification()}
            {renderQuantity()}
            {renderCategoryFields()}
            {renderPurchase()}
            {renderConditionLocation()}

            <Typography fontWeight={600}>Additional Details</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks"
              name="remarks"
              onChange={handleChange}
            />
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
