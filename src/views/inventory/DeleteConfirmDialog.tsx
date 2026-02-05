"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  useDeleteInventoryMutation,
  InventoryItem,
} from "@/redux/services/inventory/inventoryApi";
import { toast } from "react-toastify";

interface DeleteConfirmDialogProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
}

export default function DeleteConfirmDialog({
  open,
  item,
  onClose,
}: DeleteConfirmDialogProps) {
  const theme = useTheme();
  const [deleteInventory, { isLoading }] = useDeleteInventoryMutation();

  const handleDelete = async () => {
    if (!item) return;

    try {
      const result = await deleteInventory({ id: item.id }).unwrap();
      toast.success(result.message || "Inventory deleted successfully!");
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to delete inventory"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete{" "}
          <strong>{item?.item_name}</strong> ({item?.item_code})? This action
          cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={16} />}
          sx={{
            textTransform: "none",
            px: 3,
          }}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}