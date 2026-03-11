"use client";

import React, { useMemo } from "react";
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
  Card,
  CardHeader,
  CardContent,
  Stack,
  Tooltip,
  Avatar,
} from "@mui/material";
import { 
  Edit, 
  Delete, 
  Inventory2, 
  QrCode2, 
  Person,
  Category as CategoryIcon 
} from "@mui/icons-material";

// 1. Updated Interface matching your actual API JSON response
export interface InventoryItem {
  id: number;
  asset_tag: string; // Was item_code
  serial_number: string | null;
  model_name: string; // Was item_name
  brand: string;
  category: string;
  total_quantity: number;
  available_quantity: number;
  issued_quantity: number;
  status: string;
  purchase_price: string;
  assigned_to_id: number | null;
  attachment: string;
  barcode_qr_code: string | null;
  // ... add other fields if needed for display
}

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

  // 2. Logic to group inventory items by Category
  const groupedInventory = useMemo(() => {
    if (!inventory) return {};

    return inventory.reduce((acc: Record<string, InventoryItem[]>, item) => {
      // Normalize category (e.g., "Laptop" -> "LAPTOP") to prevent duplicate groups
      const categoryKey = (item.category || "Uncategorized").toUpperCase();
      
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(item);
      return acc;
    }, {});
  }, [inventory]);

  // Helper to determine status color
  const getStatusColor = (status: string, quantity: number) => {
    // Override status if quantity is 0
    if (quantity === 0) return theme.palette.error.main;
    
    const normalizedStatus = status?.toUpperCase();
    if (normalizedStatus === "AVAILABLE") return theme.palette.success.main;
    if (normalizedStatus === "LOW_STOCK") return theme.palette.warning.main;
    if (normalizedStatus === "OUT_OF_STOCK") return theme.palette.error.main;
    
    return theme.palette.info.main;
  };

  // Loading State
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  // Error State
  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
        Failed to load inventory list. Please refresh the page.
      </Alert>
    );
  }

  // Empty State
  if (!inventory || inventory.length === 0) {
    return (
      <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3, border: `1px dashed ${theme.palette.divider}` }} elevation={0}>
        <Inventory2 sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          No inventory items found.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start by adding new assets to your inventory.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={4} sx={{ pb: 4 }}>
      {/* 3. Loop through categories and render a table for each */}
      {Object.entries(groupedInventory).map(([category, items]) => (
        <Card 
          key={category} 
          elevation={0}
          sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: theme.shadows[1]
          }}
        >
          {/* Category Header */}
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <CategoryIcon sx={{ color: "white" }} />
              </Avatar>
            }
            title={
              <Typography variant="h6" fontWeight={700}>
                {category}
              </Typography>
            }
            subheader={`${items.length} items in this category`}
            sx={{
              bgcolor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`,
              px: 3,
              py: 2
            }}
          />

          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Asset Tag</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Model Details</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Brand</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Serial No</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Inventory Stats</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow 
                      key={item.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {/* Asset Tag & QR */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {item.asset_tag}
                          </Typography>
                          {item.barcode_qr_code && (
                            <Tooltip title="QR Code Available">
                               <QrCode2 fontSize="small" color="action" />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>

                      {/* Model Name */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {item.model_name || "N/A"}
                        </Typography>
                      </TableCell>

                      {/* Brand */}
                      <TableCell>
                        <Chip 
                          label={item.brand} 
                          size="small" 
                          variant="outlined" 
                          sx={{ borderRadius: 1, fontSize: '0.7rem' }} 
                        />
                      </TableCell>

                      {/* Serial Number */}
                      <TableCell>
                         <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: theme.palette.action.selected, px: 0.5, py: 0.2, borderRadius: 0.5 }}>
                            {item.serial_number || "—"}
                         </Typography>
                      </TableCell>

                      {/* Quantity Stats */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box>
                                <Typography variant="caption" display="block" color="text.secondary">Total</Typography>
                                <Typography variant="body2" fontWeight={600}>{item.total_quantity}</Typography>
                            </Box>
                            <Box sx={{ width: 1, height: 20, bgcolor: theme.palette.divider }} />
                            <Box>
                                <Typography variant="caption" display="block" color="text.secondary">Avail</Typography>
                                <Typography variant="body2" fontWeight={600} color="success.main">{item.available_quantity}</Typography>
                            </Box>
                        </Stack>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <Typography variant="body2">
                            {item.purchase_price 
                              ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(item.purchase_price))
                              : "—"}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                            label={item.available_quantity > 0 ? "AVAILABLE" : "OUT OF STOCK"}
                            size="small"
                            sx={{
                                backgroundColor: `${getStatusColor(item.status, item.available_quantity)}20`,
                                color: getStatusColor(item.status, item.available_quantity),
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                borderRadius: 1
                            }}
                            />
                            {/* Show icon if assigned */}
                            {item.assigned_to_id && (
                                <Tooltip title={`Assigned to ID: ${item.assigned_to_id}`}>
                                    <Person color="action" fontSize="small" />
                                </Tooltip>
                            )}
                        </Stack>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end">
                            <Tooltip title="Edit Item">
                                <IconButton
                                size="small"
                                onClick={() => onEdit(item)}
                                sx={{ color: theme.palette.primary.main }}
                                >
                                <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Item">
                                <IconButton
                                size="small"
                                onClick={() => onDelete(item)}
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
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}