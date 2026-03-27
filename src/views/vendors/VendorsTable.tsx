"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Drawer,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import {
  useGetVendorsQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  Vendor,
} from "@/redux/services/inventory/inventoryApi";
import { toast } from "react-toastify";

export default function VendorsTable() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { data, isLoading, isError } = useGetVendorsQuery();

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    contact_person: "",
    phone: "",
    email: "",
    gst_number: "",
  });

  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDrawerOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditForm({
      name: vendor.name || "",
      address: vendor.address || "",
      contact_person: vendor.contact_person || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      gst_number: vendor.gst_number || "",
    });
    setEditDrawerOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!selectedVendor) return;
    try {
      await updateVendor({ id: selectedVendor.id, ...editForm }).unwrap();
      toast.success("Vendor updated successfully!");
      setEditDrawerOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update vendor.");
    }
  };

  const handleDelete = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteDialogOpen(true);
  };

  const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const vendorFields: { label: string; key: keyof Vendor }[] = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Address", key: "address" },
    { label: "Contact Person", key: "contact_person" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "GST Number", key: "gst_number" },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" variant="body2">
        Failed to load vendors.
      </Typography>
    );
  }

  const vendors = data?.vendors || [];

  if (!vendors.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No vendors found.
      </Typography>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Contact Person</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>GST Number</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow
                key={vendor.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{vendor.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {vendor.name}
                  </Typography>
                </TableCell>
                <TableCell>{vendor.contact_person || "-"}</TableCell>
                <TableCell>{vendor.phone || "-"}</TableCell>
                <TableCell>{vendor.email || "-"}</TableCell>
                <TableCell>{vendor.gst_number || "-"}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleView(vendor)}
                        sx={{ color: theme.palette.info.main }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Vendor">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(vendor)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Vendor">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(vendor)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420, md: 480 },
            p: 2.5,
          },
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Vendor Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedVendor?.name || "-"}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
            mb: 1,
            display: "block",
          }}
        >
          Vendor Details
        </Typography>

        <Stack spacing={1.25}>
          {selectedVendor &&
            vendorFields.map(({ label, key }) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  justifyContent: isSmallScreen ? "flex-start" : "space-between",
                  alignItems: isSmallScreen ? "flex-start" : "center",
                  gap: 0.5,
                  py: 0.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ textAlign: isSmallScreen ? "left" : "right" }}
                >
                  {formatValue(selectedVendor[key])}
                </Typography>
              </Box>
            ))}
        </Stack>
      </Drawer>

      {/* Edit Vendor Drawer */}
      <Drawer
        anchor="right"
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420, md: 480 },
            p: 2.5,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Edit Vendor
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedVendor?.name || "-"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2} sx={{ flex: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="Contact Person"
            name="contact_person"
            value={editForm.contact_person}
            onChange={handleEditChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Phone"
            name="phone"
            value={editForm.phone}
            onChange={handleEditChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={editForm.email}
            onChange={handleEditChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Address"
            name="address"
            value={editForm.address}
            onChange={handleEditChange}
            fullWidth
            size="small"
            multiline
            rows={3}
          />
          <TextField
            label="GST Number"
            name="gst_number"
            value={editForm.gst_number}
            onChange={handleEditChange}
            fullWidth
            size="small"
          />
        </Stack>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setEditDrawerOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Vendor</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete{" "}
            <strong>{selectedVendor?.name}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isDeleting}
            onClick={async () => {
              if (!selectedVendor) return;
              try {
                await deleteVendor(selectedVendor.id).unwrap();
                toast.success("Vendor deleted successfully!");
                setDeleteDialogOpen(false);
                setSelectedVendor(null);
              } catch (err: any) {
                toast.error(err?.data?.message || "Failed to delete vendor.");
              }
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
