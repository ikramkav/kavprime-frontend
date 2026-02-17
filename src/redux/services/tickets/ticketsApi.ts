// src/redux/services/tickets/ticketsApi.ts

import { baseApi } from "../../baseApi";

export interface CreateTicketRequest {
  employee_id: number;
  ticket_type: string;
  title: string;
  description: string;
  assigned_to?: number | null;
  assigned_to_email?: string;
}

export interface CreateTicketResponse {
  message: string;
  remarks: string;
  ticket_id: number;
}
export interface CreateActionResponse {
  action: string;
  ticket_id: number;
  remarks: string;
  role_email_map: {
    [key: string]: string;
  };
  role: string;
}
export interface CreateActionRequest {
  ticket_id: number;
  action: string;
  remarks: string;
  role_email_map: {
    [key: string]: string;
  };
  role: string;
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
export interface AssignedUser {
  id: number;
  name: string;
  email: string;
}

export interface EmployeeInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AssignedTicket {
  ticket_id: number;
  title: string;
  description: string;
  ticket_type: string;
  status: string;
  current_step: number;
  current_role: string | null;
  workflow_id: number | null;
  assigned_to: AssignedUser;
  employee: EmployeeInfo;
}

export interface GetAssignedTicketsResponse {
  message: string;
  tickets: AssignedTicket[];
  total: number;
}

export type GetTicketsListResponse = Ticket[];
export type GetTicketHistoryResponse = TicketHistory[];

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<CreateTicketResponse, CreateTicketRequest>({
      query: (ticketData) => ({
        url: "/tickets/create/",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["Tickets"],
    }),
    addAction: builder.mutation<CreateActionResponse, CreateActionRequest>({
      query: ({ ticket_id, ...body }) => ({
        url: `/tickets/action/${ticket_id}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tickets"],
    }),

    getTicketsList: builder.query<GetTicketsListResponse, string>({
      query: (employeeId) => ({
        url: "/tickets/list/",
        method: "GET",
        params: {
          employee_id: employeeId,
        },
      }),
      providesTags: ["Tickets"],
    }),
    getAssignedTickets: builder.query<GetAssignedTicketsResponse, number>({
      query: (userId) => ({
        url: `/tickets/dashboard/${userId}/`,
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    getAllTickets: builder.query<GetTicketsListResponse, void>({
      query: () => ({
        url: "/tickets/list/all/",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

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
  useCreateTicketMutation,
  useAddActionMutation,
  useGetTicketsListQuery,
  useGetAllTicketsQuery,
  useGetTicketsListHistoryQuery,
  useUpdateTicketStatusMutation,
  useGetAssignedTicketsQuery,
  useGetTicketHistoryQuery,
} = ticketsApi;