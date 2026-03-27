import { baseApi } from "../../baseApi";

export interface EmployeeDashboardResponse {
  type: string;
  employee: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  tickets: {
    total_created: number;
    by_status: Record<string, number>;
  };
  assets: {
    total_assets_rows: number;
    total_quantity_issued: number;
    by_status: Record<string, number>;
  };
}

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeStats: builder.query<EmployeeDashboardResponse, string>({
      query: (employeeId) => ({
        url: `/dashboard/employee/${employeeId}/summary/`,
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),
  }),
});

export const { useGetEmployeeStatsQuery } = statsApi;
