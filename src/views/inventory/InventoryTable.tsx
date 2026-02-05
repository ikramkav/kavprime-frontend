"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { InventoryItem } from "@/redux/services/inventory/inventoryApi";

interface InventoryTableProps {
  inventory: InventoryItem[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void; 
}

export default function InventoryTable({
  inventory,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    const colors: any = {
      AVAILABLE: theme.palette.success.main,
      LOW_STOCK: theme.palette.warning.main,
      OUT_OF_STOCK: theme.palette.error.main,
    };
    return colors[status] || theme.palette.grey[500];
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load inventory. Please try again.
      </Alert>
    );
  }

  if (inventory.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No inventory items found. Add a new item to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total Qty</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Available</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Attachment</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {item.item_code}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {item.item_name}
                </Typography>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.total_quantity}</TableCell>
              <TableCell>{item.available_quantity}</TableCell>
              <TableCell>
                <Chip
                  label={item.status.replace("_", " ")}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(item.status)}20`,
                    color: getStatusColor(item.status),
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>
              <TableCell>
                ₨{parseFloat(item.purchase_price_per_item).toLocaleString()}
              </TableCell>
              <TableCell>
                {item.attachment_url ? (
                  <a
                    href={item.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    {item.attachment_url.split("/").pop()}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEdit(item)}
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 1,
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(item)}
                  sx={{
                    color: theme.palette.error.main,
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
