import { baseApi } from "../../baseApi";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // SECTION 1 — ASSET & INVENTORY REPORTS
    getAssetSummaryReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/assets/summary/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getAssetListReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/assets/list/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getAssetIssueReturnHistoryReport: builder.query<
      unknown,
      QueryParams | undefined
    >({
      query: (params) => ({
        url: "/reports/assets/issue-return-history/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getCurrentlyIssuedAssetsReport: builder.query<
      unknown,
      QueryParams | undefined
    >({
      query: (params) => ({
        url: "/reports/assets/currently-issued/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getLowStockAssetsReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/assets/low-stock/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getWarrantyExpiryAssetsReport: builder.query<
      unknown,
      QueryParams | undefined
    >({
      query: (params) => ({
        url: "/reports/assets/warranty-expiry/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // SECTION 2 — TICKET & WORKFLOW REPORTS
    getTicketSummaryReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/tickets/summary/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getTicketListReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/tickets/list/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getTicketApprovalHistoryReport: builder.query<
      unknown,
      QueryParams | undefined
    >({
      query: (params) => ({
        url: "/reports/tickets/approval-history/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getTicketSlaBreachReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/tickets/sla-breach/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getPendingTicketsByRoleReport: builder.query<
      unknown,
      QueryParams | undefined
    >({
      query: (params) => ({
        url: "/reports/tickets/pending-by-role/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // SECTION 3 — USER & EMPLOYEE REPORTS
    getUserSummaryReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/users/summary/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getEmployeeAssetHistoryReport: builder.query<
      unknown,
      { userId: number | string; params?: QueryParams }
    >({
      query: ({ userId, params }) => ({
        url: `/reports/users/${userId}/asset-history/`,
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getOffboardingChecklistReport: builder.query<
      unknown,
      { userId: number | string; params?: QueryParams }
    >({
      query: ({ userId, params }) => ({
        url: `/reports/users/${userId}/offboarding-checklist/`,
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getExitedEmployeesReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/users/exited/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // SECTION 4 — PURCHASE & FINANCE REPORTS
    getPurchaseSummaryReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/purchases/summary/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getPurchaseListReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/purchases/list/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getVendorSummaryReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/purchases/vendor-summary/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // SECTION 5 — AUDIT LOG & DASHBOARD
    getAuditLogReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/audit-log/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
    getDashboardStatsReport: builder.query<unknown, QueryParams | undefined>({
      query: (params) => ({
        url: "/reports/dashboard-stats/",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetAssetSummaryReportQuery,
  useGetAssetListReportQuery,
  useGetAssetIssueReturnHistoryReportQuery,
  useGetCurrentlyIssuedAssetsReportQuery,
  useGetLowStockAssetsReportQuery,
  useGetWarrantyExpiryAssetsReportQuery,
  useGetTicketSummaryReportQuery,
  useGetTicketListReportQuery,
  useGetTicketApprovalHistoryReportQuery,
  useGetTicketSlaBreachReportQuery,
  useGetPendingTicketsByRoleReportQuery,
  useGetUserSummaryReportQuery,
  useGetEmployeeAssetHistoryReportQuery,
  useGetOffboardingChecklistReportQuery,
  useGetExitedEmployeesReportQuery,
  useGetPurchaseSummaryReportQuery,
  useGetPurchaseListReportQuery,
  useGetVendorSummaryReportQuery,
  useGetAuditLogReportQuery,
  useGetDashboardStatsReportQuery,
} = reportsApi;
