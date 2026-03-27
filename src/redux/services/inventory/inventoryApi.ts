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
  attachment?: File | null;
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
  attachment?: File | null;
}

export interface UpdateInventoryResponse {
  message: string;
  inventory_id: number;
  total_quantity: number;
  available_quantity: number;
  quantity_issued: number;
  status: string;
}

export interface DeleteInventoryRequest {
  id: number;
}

export interface DeleteInventoryResponse {
  message: string;
}

export interface IssueInventoryRequest {
  /**
   * Backend expects `asset_id` (selected inventory item id in UI).
   * Keeping `inventory_id` optional for compatibility with older usage.
   */
  asset_id: number;
  inventory_id?: number;
  employee_id: number;
  issued_by_id: number;
  quantity_issued: number;
  issue_date: string;
  location: string;
  issue_reason: string;
  remarks?: string;
}

export interface IssueInventoryResponse {
  message: string;
  asset_id: number;
  remaining_quantity: number;
}

export interface InventoryItem {
  id: number;
  item_code?: string;
  item_name?: string;
  asset_tag?: string;
  serial_number?: string | null;
  category?: string;
  brand?: string;
  model?: string;
  model_name?: string;
  description?: string;
  total_quantity: number;
  available_quantity: number;
  quantity_issued: number;
  minimum_stock_level?: number;
  status: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | string;
  purchase_date?: string;
  purchase_price_per_item?: string;
  purchase_price?: string;
  vendor_name?: string;
  assigned_to_id?: number | null;
  barcode_qr_code?: string | null;
  qr_code_path?: string | null;
  created_at?: string;
  updated_at?: string;
  attachment_url?: string | null;
  attachment?: string | null;
}

export interface GetInventoryListResponse {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  assets: InventoryItem[];
}

export interface GetInventoryListParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  issued?: boolean;
  employee_id?: number;
  asset_id?: number;
  from_date?: string;
  to_date?: string;
  issued_by_id?: number;
}

export interface IssuedAssetAssignment {
  issue_record_id: number;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  quantity_issued: number;
  issue_date: string;
  return_date: string | null;
  location: string;
  issue_reason: string;
  status: "ISSUED" | "RETURNED" | "DAMAGED" | string;
  remarks: string | null;
  issued_by_id: number;
  issued_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface IssuedAssetWithAssignments {
  asset_id: number;
  asset_tag: string;
  brand: string;
  model_name: string;
  category: string;
  serial_number: string | null;
  total_quantity: number;
  available_quantity: number;
  quantity_issued: number;
  asset_status: string;
  assignments: IssuedAssetAssignment[];
}

export interface GetIssuedAssetsWithAssignmentsResponse {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  filters_applied?: {
    search?: string | null;
    status?: string | null;
    employee_id?: number | null;
    asset_id?: number | null;
    category?: string | null;
    from_date?: string | null;
    to_date?: string | null;
    issued_by_id?: number | null;
  };
  assets: IssuedAssetWithAssignments[];
}

export interface ReturnAssetRequest {
  asset_ids: number[];
  status: "RETURNED" | "DAMAGED" | string;
  remarks?: string;
}

export interface ReturnAssetResponse {
  message: string;
}

// Asset Details Types
export interface AssetDetail {
  id: number; // The actual issue record ID returned by the API
  record_id: number; // Alias for backward compatibility
  asset_id?: number;
  asset_tag: string;
  category: string;
  brand: string;
  model_name: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  quantity_issued: number;
  issued_date: string;
  days_held: number;
  issued_by: string;
  status: string;
}

export interface GetAllAssetsResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  assets: AssetDetail[];
}

export interface GetAllAssetsParams {
  page?: number;
  limit?: number;
  search?: string;
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

export interface AddVendorRequest {
  name: string;
  address: string;
  contact_person: string;
  phone: string;
  email: string;
  gst_number: string;
}

export interface AddVendorResponse {
  message?: string;
  id?: number;
}

export interface UpdateVendorRequest {
  id: number;
  name?: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  gst_number?: string;
}

export interface UpdateVendorResponse {
  message?: string;
}

export interface DeleteVendorResponse {
  message?: string;
}

export interface Vendor {
  id: number;
  name: string;
  address: string;
  contact_person: string;
  phone: string;
  email: string;
  gst_number: string;
}

export interface GetVendorsResponse {
  vendors: Vendor[];
}

export interface GetAssetDetailResponse {
  id: number;
  asset: {
    id: number;
    tag: string;
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
  issue_date: string;
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
    getInventoryList: builder.query<
      GetInventoryListResponse,
      GetInventoryListParams | void
    >({
      query: (params) => ({
        url: "/inventory/list/",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Inventory"],
    }),

    // Get issued assets with assignment history
    getIssuedAssetsWithAssignments: builder.query<
      GetIssuedAssetsWithAssignmentsResponse,
      GetInventoryListParams | void
    >({
      query: (params) => ({
        url: "/inventory/list/",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["Inventory", "Assets"],
    }),

    // Add inventory endpoint
    // Add inventory endpoint
    // addInventory endpoint — send JSON not FormData
    addInventory: builder.mutation<AddInventoryResponse, any>({
      query: (inventoryData) => ({
        url: "/inventory/add/",
        method: "POST",
        body: inventoryData, // ✅ plain object → RTK Query sends as JSON
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Inventory"],
    }),

    // Update inventory endpoint
    updateInventory: builder.mutation<
      UpdateInventoryResponse,
      UpdateInventoryRequest
    >({
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
    deleteInventory: builder.mutation<
      DeleteInventoryResponse,
      DeleteInventoryRequest
    >({
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

    // Return issued asset(s)
    returnAsset: builder.mutation<ReturnAssetResponse, ReturnAssetRequest>({
      query: (body) => ({
        url: "/inventory/return-asset/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventory", "Assets"],
    }),

    // Get all assets
    getAllAssets: builder.query<
      GetAllAssetsResponse,
      GetAllAssetsParams | void
    >({
      query: (params) => ({
        url: "/inventory/assets/",
        method: "GET",
        params: params ?? undefined,
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

    // Get all vendors
    getVendors: builder.query<GetVendorsResponse, void>({
      query: () => ({
        url: "/inventory/vendors/",
        method: "GET",
      }),
      providesTags: ["Inventory"],
    }),

    // Add vendor endpoint
    addVendor: builder.mutation<AddVendorResponse, AddVendorRequest>({
      query: (vendorData) => ({
        url: "/inventory/add-vendor/",
        method: "POST",
        body: vendorData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Inventory"],
    }),

    // Delete vendor endpoint
    deleteVendor: builder.mutation<DeleteVendorResponse, number>({
      query: (id) => ({
        url: `/inventory/vendors/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),

    // Update vendor endpoint
    updateVendor: builder.mutation<UpdateVendorResponse, UpdateVendorRequest>({
      query: ({ id, ...body }) => ({
        url: `/inventory/vendors/${id}/edit/`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetInventoryListQuery,
  useGetIssuedAssetsWithAssignmentsQuery,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useIssueInventoryMutation,
  useReturnAssetMutation,
  useGetAllAssetsQuery,
  useGetEmployeeAssetsQuery,
  useGetInventoryAssetsQuery,
  useGetAssetDetailQuery,
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = inventoryApi;
