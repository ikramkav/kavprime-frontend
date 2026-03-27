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
  Divider,
  Drawer,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
  Pagination,
  Button,
} from "@mui/material";
import {
  Edit,
  Delete,
  Inventory2,
  Person,
  Visibility,
  Download,
} from "@mui/icons-material";
import { BASE_URL } from "@/redux/baseApi";

export interface InventoryItem {
  id: number;
  item_code?: string;
  item_name?: string;
  asset_tag?: string;
  serial_number?: string | null;
  model_name?: string;
  model?: string;
  brand?: string;
  category?: string;
  total_quantity: number;
  available_quantity: number;
  quantity_issued: number;
  status: string;
  purchase_price?: string;
  purchase_price_per_item?: string;
  assigned_to_id?: number | null;
  attachment?: string | null;
  barcode_qr_code?: string | null;
  qr_code_path?: string | null;
}

interface InventoryTableProps {
  inventory: InventoryItem[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export default function InventoryTable({
  inventory,
  isLoading,
  isError,
  page,
  totalPages,
  totalItems,
  hasNext,
  hasPrev,
  onPageChange,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [detailDrawerOpen, setDetailDrawerOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(
    null,
  );

  const resolveQrSrc = (path: string) => {
    if (path.startsWith("http")) return path;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  };

  const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const handleOpenDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setDetailDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailDrawerOpen(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status: string, quantity: number) => {
    if (quantity === 0) return theme.palette.error.main;
    const normalizedStatus = status?.toUpperCase();
    if (normalizedStatus === "AVAILABLE") return theme.palette.success.main;
    if (normalizedStatus === "LOW_STOCK") return theme.palette.warning.main;
    if (normalizedStatus === "OUT_OF_STOCK") return theme.palette.error.main;
    return theme.palette.info.main;
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
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
        Failed to load inventory list. Please refresh the page.
      </Alert>
    );
  }

  if (!inventory || inventory.length === 0) {
    return (
      <Paper
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 3,
          border: `1px dashed ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Inventory2
          sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.5 }}
        />
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
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 900 }} size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                Asset Tag
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                Brand
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                Category
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    onClick={() => handleOpenDetails(item)}
                    fontWeight={600}
                    color="primary"
                    sx={{ cursor: "pointer" }}
                  >
                    {item.asset_tag || item.item_code || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={item.brand || "-"}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1, fontSize: "0.7rem" }}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={item.category || "Uncategorized"}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1, fontSize: "0.7rem" }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {item.purchase_price
                      ? new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(parseFloat(item.purchase_price))
                      : item.purchase_price_per_item
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(parseFloat(item.purchase_price_per_item))
                        : "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={
                        item.available_quantity > 0
                          ? "AVAILABLE"
                          : "OUT OF STOCK"
                      }
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(item.status, item.available_quantity)}20`,
                        color: getStatusColor(
                          item.status,
                          item.available_quantity,
                        ),
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        borderRadius: 1,
                      }}
                    />
                    {item.assigned_to_id && (
                      <Tooltip title={`Assigned to ID: ${item.assigned_to_id}`}>
                        <Person color="action" fontSize="small" />
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>

                <TableCell>
                  <Stack direction="row">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetails(item)}
                        sx={{ color: theme.palette.info.main }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
      {totalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Page {page} of {totalPages} · Total {totalItems} items
          </Typography>
          <Pagination
            page={page}
            count={totalPages}
            color="primary"
            disabled={totalPages <= 1}
            onChange={(_, value) => {
              if (
                value !== page &&
                ((value > page && hasNext) ||
                  (value < page && hasPrev) ||
                  value === 1)
              ) {
                onPageChange(value);
              }
            }}
          />
        </Box>
      )}
      <Drawer
        anchor="right"
        open={detailDrawerOpen}
        onClose={handleCloseDetails}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420, md: 520 },
            p: 2.5,
          },
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Inventory Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedItem?.asset_tag || selectedItem?.item_code || "-"}
        </Typography>

        {/* QR Code Section */}
        {(() => {
          const qrPath =
            selectedItem?.qr_code_path ||
            selectedItem?.barcode_qr_code ||
            (selectedItem?.asset_tag
              ? `qr_codes/${selectedItem.asset_tag}_qr.png`
              : null);
          if (!qrPath) return null;
          const qrSrc = resolveQrSrc(
            `${BASE_URL.replace("/api", "")}/media/${qrPath}`
          );
          return (
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={qrSrc}
                alt="QR code"
                sx={{ width: 180, maxWidth: "100%", borderRadius: 1 }}
                onError={(e: any) => {
                  e.currentTarget.parentElement.style.display = "none";
                }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<Download fontSize="small" />}
                href={qrSrc}
                download={`${selectedItem?.asset_tag || "qr_code"}.png`}
                target="_blank"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  backgroundColor: "#1a1a2e",
                  "&:hover": { backgroundColor: "#16213e" },
                }}
              >
                Download QR Code
              </Button>
            </Box>
          );
        })()}

        <Divider sx={{ mb: 1.5 }} />

        {/* Asset Details Label */}
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
          Asset Details
        </Typography>

        <Stack spacing={1.25}>
          {selectedItem &&
            Object.entries(selectedItem)
              .filter(([key]) => !["qr_code_path", "barcode_qr_code"].includes(key))
              .map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  justifyContent: isSmallScreen
                    ? "flex-start"
                    : "space-between",
                  alignItems: isSmallScreen ? "flex-start" : "center",
                  gap: 0.5,
                  py: 0.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {formatLabel(key)}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ textAlign: isSmallScreen ? "left" : "right" }}
                >
                  {formatValue(value)}
                </Typography>
              </Box>
            ))}
        </Stack>
      </Drawer>
    </Box>
  );
}
