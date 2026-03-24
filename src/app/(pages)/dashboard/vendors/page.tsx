"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useAddVendorMutation } from "@/redux/services/inventory/inventoryApi";
import { toast } from "react-toastify";
import VendorsTable from "@/views/vendors/VendorsTable";

export default function VendorsPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_person: "",
    phone: "",
    email: "",
    gst_number: "",
  });

  const [addVendor, { isLoading }] = useAddVendorMutation();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      address: "",
      contact_person: "",
      phone: "",
      email: "",
      gst_number: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addVendor(formData).unwrap();
      toast.success(result?.message || "Vendor added successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to add vendor",
      );
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Vendors
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          Manage vendor records for inventory sourcing.
        </Typography>
        <Button
          variant="contained"
          sx={{ alignSelf: "flex-end" }}
          onClick={handleOpen}
        >
          Add Vendor
        </Button>
      </Box>

      <VendorsTable />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Vendor</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Contact Person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="GST Number"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size={16} />}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
