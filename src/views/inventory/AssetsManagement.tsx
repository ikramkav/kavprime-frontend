"use client";

import { Search } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import {
  AssetDetail,
  useGetAllAssetsQuery,
} from "@/redux/services/inventory/inventoryApi";
import AssetDetailDialog from "./AssetDetailDialog";
import AssetsTable from "./AssetsTable";

export default function AssetsManagement() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchText, setSearchText] = useState("");

  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data, isLoading, isError } = useGetAllAssetsQuery({
    page,
    limit,
    search: searchText.trim() || undefined,
  });

  const assets: AssetDetail[] = data?.assets || [];

  const handleViewDetail = (asset: AssetDetail) => {
    setSelectedAsset(asset.id);
    setDetailDialogOpen(true);
  };

  return (
    <Box>
      <TextField
        size="small"
        label="Search"
        placeholder="Search issued assets..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(1);
        }}
        sx={{ minWidth: 240, mb: 3 }}
        InputProps={{
          startAdornment: (
            <Search fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
          ),
        }}
      />

      <AssetsTable
        assets={assets}
        isLoading={isLoading}
        isError={isError}
        page={data?.page || page}
        totalPages={data?.total_pages || 1}
        totalItems={data?.total || 0}
        hasNext={data?.has_next || false}
        hasPrev={data?.has_prev || false}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />

      <AssetDetailDialog
        open={detailDialogOpen}
        assetId={selectedAsset}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedAsset(null);
        }}
      />
    </Box>
  );
}
