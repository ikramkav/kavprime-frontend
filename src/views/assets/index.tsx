"use client";

import React, { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Inventory2,
  CalendarToday,
  Person,
  Assignment,
} from "@mui/icons-material";
import { useGetEmployeeAssetsQuery } from "@/redux/services/inventory/inventoryApi";
import { getUserData } from "@/utils/auth"; // Adjust path as needed

const ViewAssets = () => {
  const theme = useTheme();
  
  // Get employee ID from localStorage
  const { userId } = getUserData();

  // Fetch employee assets
  const {
    data: assetsData,
    isLoading,
    isError,
    error,
  } = useGetEmployeeAssetsQuery(userId || 0, {
    skip: !userId, // Skip the query if userId is not available
  });

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!assetsData) return null;

    const issued = assetsData.assets.filter((a) => a.status === "ISSUED").length;
    const returned = assetsData.assets.filter((a) => a.status === "RETURNED").length;
    const damaged = assetsData.assets.filter((a) => a.status === "DAMAGED").length;

    return { issued, returned, damaged };
  }, [assetsData]);

  // Get status styling
  const getStatusStyle = (status: "ISSUED" | "RETURNED" | "DAMAGED") => {
    switch (status) {
      case "ISSUED":
        return {
          bgcolor: theme.palette.mode === "dark" 
            ? alpha(theme.palette.success.main, 0.2)
            : alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
          borderColor: theme.palette.success.main,
          fontWeight: 600,
        };
      case "RETURNED":
        return {
          bgcolor: theme.palette.mode === "dark" 
            ? alpha(theme.palette.grey[500], 0.2)
            : alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[700],
          borderColor: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[400],
          fontWeight: 600,
        };
      case "DAMAGED":
        return {
          bgcolor: theme.palette.mode === "dark" 
            ? alpha(theme.palette.error.main, 0.2)
            : alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
          borderColor: theme.palette.error.main,
          fontWeight: 600,
        };
      default:
        return {};
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
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

  // Error state
  if (isError || !userId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {!userId
            ? "User ID not found. Please log in again."
            : "Failed to load assets. Please try again later."}
        </Alert>
      </Box>
    );
  }

  // No data state
  if (!assetsData || assetsData.assets.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          You don't have any assets assigned yet.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          My Assets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View all assets assigned to you
        </Typography>
      </Box>

      {/* Employee Info Card */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 200 }}>
              <Person color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Employee Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {assetsData.employee_name}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 200 }}>
              <Assignment color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Employee Email
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {assetsData.employee_email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 200 }}>
              <Inventory2 color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Assets
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {assetsData.total_assets}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {statistics && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              borderLeft: "4px solid",
              borderLeftColor: "success.main",
              flex: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Currently Issued
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {statistics.issued}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              borderLeft: "4px solid",
              borderLeftColor: theme.palette.mode === "dark" ? "grey.600" : "grey.400",
              flex: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Returned
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {statistics.returned}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              borderLeft: "4px solid",
              borderLeftColor: "error.main",
              flex: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Damaged
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {statistics.damaged}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Assets Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === "dark" 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                Asset Name 
              </TableCell> 
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                Code
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                Brand/Model
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }} align="center">
                Quantity
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                Issue Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                Return Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                Issued By
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.primary" }} align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetsData.assets.map((asset) => (
              <TableRow
                key={asset.id}
                sx={{
                  "&:hover": { 
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.05)
                      : alpha(theme.palette.primary.main, 0.02),
                  },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500} color="text.primary">
                    {asset.inventory_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {asset.inventory_code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.primary">
                    {asset.brand} {asset.model}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={asset.quantity_issued}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.mode === "dark" ? "primary.main" : "grey.400",
                      color: "text.primary",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarToday 
                      sx={{ 
                        fontSize: 16, 
                        color: theme.palette.mode === "dark" ? "primary.main" : "text.secondary" 
                      }} 
                    />
                    <Typography variant="body2" color="text.primary">
                      {formatDate(asset.quantity_issued_date)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {asset.return_date ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CalendarToday 
                        sx={{ 
                          fontSize: 16, 
                          color: theme.palette.mode === "dark" ? "primary.main" : "text.secondary" 
                        }} 
                      />
                      <Typography variant="body2" color="text.primary">
                        {formatDate(asset.return_date)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.primary">
                    {asset.issued_by_name}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={asset.status}
                    size="small"
                    variant="outlined"
                    sx={getStatusStyle(asset.status)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewAssets;