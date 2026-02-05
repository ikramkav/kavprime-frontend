import { baseApi } from "../../baseApi";

// Types for requests and responses
export interface AddInventoryRequest {
  item_code: string;
  item_name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  total_quantity: number;
  minimum_stock_level: number;
  purchase_date: string;
  purchase_price_per_item: number;
  vendor_name: string;
  attachment?: File;
}

export interface AddInventoryResponse {
  message: string;
  inventory_id: number;
}

export interface UpdateInventoryRequest {
  id: number;
  item_code?: string;
  item_name?: string;
  category?: string;
  brand?: string;
  model?: string;
  description?: string;
  total_quantity?: number;
  minimum_stock_level?: number;
  purchase_date?: string;
  purchase_price_per_item?: number;
  vendor_name?: string;
  attachment?: File;
}

export interface UpdateInventoryResponse {
  message: string;
  inventory_id: number;
  total_quantity: number;
  available_quantity: number;
  issued_quantity: number;
  status: string;
}

export interface DeleteInventoryRequest {
  id: number;
}

export interface DeleteInventoryResponse {
  message: string;
}

export interface IssueInventoryRequest {
  inventory_id: number;
  employee_id: number;
  issued_by_id: number;
  quantity_issued: number;
}

export interface IssueInventoryResponse {
  message: string;
  asset_id: number;
  remaining_quantity: number;
}

export interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  total_quantity: number;
  available_quantity: number;
  issued_quantity: number;
  minimum_stock_level: number;
  status: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";
  purchase_date: string;
  purchase_price_per_item: string;
  vendor_name: string;
  created_at: string;
  updated_at: string;
  attachment_url: string | null;
}

export type GetInventoryListResponse = InventoryItem[];

// Asset Details Types
export interface AssetDetail {
  id: number;
  inventory_id: number;
  inventory_name: string;
  inventory_code: string;
  brand: string;
  model: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  quantity_issued: number;
  quantity_issued_date: string;
  return_date: string | null;
  status: "ISSUED" | "RETURNED" | "DAMAGED";
  remarks: string | null;
  issued_by_id: number;
  issued_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllAssetsResponse {
  total_assets: number;
  assets: AssetDetail[];
}

export interface EmployeeAssetDetail {
  id: number;
  inventory_id: number;
  inventory_name: string;
  inventory_code: string;
  brand: string;
  model: string;
  quantity_issued: number;
  quantity_issued_date: string;
  return_date: string | null;
  status: "ISSUED" | "RETURNED" | "DAMAGED";
  remarks: string | null;
  issued_by_id: number;
  issued_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface GetEmployeeAssetsResponse {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  total_assets: number;
  assets: EmployeeAssetDetail[];
}

export interface InventoryAssetDetail {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  quantity_issued: number;
  quantity_issued_date: string;
  return_date: string | null;
  status: "ISSUED" | "RETURNED" | "DAMAGED";
  remarks: string | null;
  issued_by_id: number;
  issued_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface GetInventoryAssetsResponse {
  inventory_id: number;
  inventory_name: string;
  inventory_code: string;
  total_issued: number;
  total_assets: number;
  assets: InventoryAssetDetail[];
}

export interface GetAssetDetailResponse {
  id: number;
  inventory: {
    id: number;
    name: string;
    code: string;
    brand: string;
    model: string;
    category: string;
  };
  employee: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  quantity_issued: number;
  quantity_issued_date: string;
  return_date: string | null;
  status: "ISSUED" | "RETURNED" | "DAMAGED";
  remarks: string | null;
  issued_by: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

// Extend the base API with inventory endpoints
export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get inventory list endpoint
    getInventoryList: builder.query<GetInventoryListResponse, void>({
      query: () => ({
        url: "/inventory/list/",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),

    // Add inventory endpoint
    // Add inventory endpoint
    addInventory: builder.mutation<AddInventoryResponse, AddInventoryRequest>({
      query: (inventoryData) => {
        const formData = new FormData();
        Object.entries(inventoryData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any); // File object will be handled automatically
          }
        });

        return {
          url: "/inventory/add/",
          method: "POST",
          body: formData, // send FormData
        };
      },
      invalidatesTags: ["Inventory"],
    }),

    // Update inventory endpoint
    updateInventory: builder.mutation< UpdateInventoryResponse, UpdateInventoryRequest >({
      query: (inventoryData) => {
        const formData = new FormData();
        Object.entries(inventoryData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });

        return {
          url: "/inventory/update/",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Inventory"],
    }),

    // Delete inventory endpoint
    deleteInventory: builder.mutation<DeleteInventoryResponse, DeleteInventoryRequest>({
      query: (data) => ({
        url: "/inventory/delete/",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),

    // Issue inventory endpoint
    issueInventory: builder.mutation<
      IssueInventoryResponse,
      IssueInventoryRequest
    >({
      query: (issueData) => ({
        url: "/inventory/issue/",
        method: "POST",
        body: issueData,
      }),
      invalidatesTags: ["Inventory", "Assets"],
    }),

    // Get all assets
    getAllAssets: builder.query<GetAllAssetsResponse, void>({
      query: () => ({
        url: "/inventory/assets/",
        method: "GET",
      }),
      providesTags: ["Assets"],
    }),

    // Get assets by employee
    getEmployeeAssets: builder.query<GetEmployeeAssetsResponse, number>({
      query: (employeeId) => ({
        url: `/inventory/assets/employee/${employeeId}/`,
        method: "GET",
      }),
      providesTags: ["Assets"],
    }),

    // Get assets by inventory item
    getInventoryAssets: builder.query<GetInventoryAssetsResponse, number>({
      query: (inventoryId) => ({
        url: `/inventory/assets/inventory/${inventoryId}/`,
        method: "GET",
      }),
      providesTags: ["Assets"],
    }),

    // Get single asset detail
    getAssetDetail: builder.query<GetAssetDetailResponse, number>({
      query: (assetId) => ({
        url: `/inventory/assets/${assetId}/`,
        method: "GET",
      }),
      providesTags: ["Assets"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetInventoryListQuery,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useIssueInventoryMutation,
  useGetAllAssetsQuery,
  useGetEmployeeAssetsQuery,
  useGetInventoryAssetsQuery,
  useGetAssetDetailQuery,
} = inventoryApi;
