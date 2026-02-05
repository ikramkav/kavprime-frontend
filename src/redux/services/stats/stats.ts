// src/redux/services/tickets/ticketsApi.ts

import { baseApi } from "../../baseApi";

export interface CreateTicketRequest {
  employee_id: number;
  ticket_type: string;
  title: string;
  description: string;
  assigned_to?: number | null;
}

export interface CreateTicketResponse {
  message: string;
  remarks: string;
  ticket_id: number;
}
export interface CreateActionResponse {
  action: string;
  ticket_id: number;
}
export interface CreateActionRequest {
  ticket_id: number;
  action: string;
  remarks?: string;
}

export interface UpdateTicketStatusRequest {
  employee_id: number;
  status: string;
}

export interface UpdateTicketStatusResponse {
  message: string;
}

export interface Ticket {
  id: number;
  employee_id: number;
  ticket_type: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  workflow_id?: number | null;
  current_step?: number;
  current_role?: string | null;
}

export interface TicketStep {
  step_order: number;
  role: string;
  sla_hours: number;
  state: string;
  action_date: string;
  remarks: string;
}

export interface TicketHistory {
  ticket_id: number;
  employee_id: number;
  ticket_type: string;
  title: string;
  description: string;
  status: string;
  workflow_id: number;
  current_step: number;
  created_at: string;
  steps: TicketStep[];
}
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

export type GetStatsListResponse = Ticket[];
export type GetTicketHistoryResponse = TicketHistory[];

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeStats: builder.query<EmployeeDashboardResponse, string>({
      query: (employeeId) => ({
        url: `/dashboard/employee/${employeeId}/summary/`,
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // getAllTickets: builder.query<GetTicketsListResponse, void>({
    //   query: () => ({
    //     url: "/tickets/list/all/",
    //     method: "GET",
    //   }),
    //   providesTags: ["Tickets"],
    // }),

    getTicketsListHistory: builder.query<any, void>({
      query: () => ({
        url: `/tickets/ticket-history/`,
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    updateTicketStatus: builder.mutation<
      UpdateTicketStatusResponse,
      UpdateTicketStatusRequest
    >({
      query: (statusData) => ({
        url: "/tickets/update-ticket-status/",
        method: "PUT",
        body: statusData,
      }),
      invalidatesTags: ["Tickets"],
    }),

    getTicketHistory: builder.query<GetTicketHistoryResponse, number>({
      query: (ticketId) => ({
        url: `/tickets/ticket-history/ticket/${ticketId}/`,
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),
  }),
});

export const {
  useGetEmployeeStatsQuery, 
  //   useGetAllTicketsQuery,
  useGetTicketsListHistoryQuery,
  useUpdateTicketStatusMutation,
  useGetTicketHistoryQuery,
} = ticketsApi;
