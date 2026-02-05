"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useGetInventoryListQuery } from "@/redux/services/inventory/inventoryApi";
import { useGetUsersQuery } from "@/redux/services/auth/authApi";
import { useIssueInventoryMutation } from "@/redux/services/inventory/inventoryApi";

interface IssueInventoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function IssueInventoryDialog({
  open,
  onClose,
}: IssueInventoryDialogProps) {
  const { data: inventoryData, isLoading: inventoryLoading } = useGetInventoryListQuery(undefined);
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery(undefined);
  const [issueInventory, { isLoading: isIssuing }] = useIssueInventoryMutation();

  const [formData, setFormData] = useState({
    inventory_id: "",
    employee_id: "",
    quantity_issued: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get logged-in user ID from localStorage
  const loggedInUserId = localStorage.getItem("user_id");

  // Filter users to exclude the logged-in admin
  const filteredUsers = useMemo(() => {
    if (!usersData?.users || !loggedInUserId) return [];
    
    return usersData.users.filter(
      (user) => user.id !== parseInt(loggedInUserId)
    );
  }, [usersData, loggedInUserId]);

  // Get available quantity for selected inventory
  const selectedInventory = inventoryData?.find(
    (item) => item.id === parseInt(formData.inventory_id)
  );

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.inventory_id || !formData.employee_id || !formData.quantity_issued) {
      setError("Please fill all fields");
      return;
    }

    const quantityIssued = parseInt(formData.quantity_issued);
    if (quantityIssued <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (selectedInventory && quantityIssued > selectedInventory.available_quantity) {
      setError(
        `Cannot issue ${quantityIssued} items. Only ${selectedInventory.available_quantity} available.`
      );
      return;
    }

    // Get logged-in user from localStorage
    const issuedById = localStorage.getItem("user_id");
    if (!issuedById) {
      setError("User not logged in. Please log in again.");
      return;
    }

    try {
      const result = await issueInventory({
        inventory_id: parseInt(formData.inventory_id),
        employee_id: parseInt(formData.employee_id),
        issued_by_id: parseInt(issuedById),
        quantity_issued: quantityIssued,
      }).unwrap();

      setSuccess(true);
      setFormData({ inventory_id: "", employee_id: "", quantity_issued: "" });

      // Close dialog after 1.5 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err?.data?.error || "Failed to issue inventory");
    }
  };

  const handleClose = () => {
    setFormData({ inventory_id: "", employee_id: "", quantity_issued: "" });
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Issue Inventory</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Inventory Selection */}
          <TextField
            select
            label="Select Inventory Item"
            value={formData.inventory_id}
            onChange={(e) =>
              setFormData({ ...formData, inventory_id: e.target.value, quantity_issued: "" })
            }
            fullWidth
            disabled={inventoryLoading}
          >
            {inventoryLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading...
              </MenuItem>
            ) : (
              inventoryData
                ?.filter((item) => item.available_quantity > 0) // Only show available items
                .map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography>
                        {item.item_name} - {item.brand}
                      </Typography>
                      <Chip
                        label={`Available: ${item.available_quantity}`}
                        size="small"
                        color={
                          item.status === "AVAILABLE"
                            ? "success"
                            : item.status === "LOW_STOCK"
                            ? "warning"
                            : "error"
                        }
                      />
                    </Box>
                  </MenuItem>
                ))
            )}
          </TextField>

          {/* Employee Selection - Shows all users except logged-in admin */}
          <TextField
            select
            label="Select User"
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            fullWidth
            disabled={usersLoading}
          >
            {usersLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading...
              </MenuItem>
            ) : filteredUsers.length === 0 ? (
              <MenuItem disabled>
                No other users available
              </MenuItem>
            ) : (
              filteredUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <Typography>
                      {user.name} ({user.email})
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Quantity Input */}
          <TextField
            label="Quantity to Issue"
            type="number"
            value={formData.quantity_issued}
            onChange={(e) => setFormData({ ...formData, quantity_issued: e.target.value })}
            fullWidth
            disabled={!formData.inventory_id}
            inputProps={{
              min: 1,
              max: selectedInventory?.available_quantity || 0,
            }}
            helperText={
              selectedInventory
                ? `Maximum available: ${selectedInventory.available_quantity}`
                : "Select an inventory item first"
            }
          />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert severity="success">
              Inventory issued successfully!
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isIssuing}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isIssuing || success}
          startIcon={isIssuing && <CircularProgress size={20} />}
        >
          {isIssuing ? "Issuing..." : "Issue Inventory"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}