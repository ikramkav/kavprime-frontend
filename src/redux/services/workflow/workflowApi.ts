// src/redux/services/workflow/workflowApi.ts
import { baseApi } from "../../baseApi";

/* =======================
   Types & Interfaces
======================= */

export interface WorkflowStep {
  step_order?: number;
  role: string;
  sla_hours: number;
}

export interface CreateWorkflowRequest {
  ticket_type?: string;
  version: string | number;
  workflow_name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface CreateWorkflowResponse {
  workflow_id: number;
  workflow_name: string;
  version: number;
  is_active: boolean;
}

export interface Workflow {
  workflow_id: number;
  ticket_type: string;
  version: number;
  workflow_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  steps: WorkflowStep[];
}

export type GetWorkflowsResponse = Workflow[];

export interface Role {
  id: number;
  name: string;
  is_active: boolean;
}

export type GetRolesResponse = Role[];

/* =======================
   RTK Query API
======================= */

export const workflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* Create Workflow */
    createWorkflow: builder.mutation<
      CreateWorkflowResponse,
      CreateWorkflowRequest
    >({
      query: (data) => ({
        url: "/workflows/create-with-roles/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workflow"],
    }),

    /* Get All Workflows */
    getWorkflows: builder.query<GetWorkflowsResponse, void>({
      query: () => ({
        url: "/tickets/workflows/",
        method: "GET",
      }),
      providesTags: ["Workflow"],
    }),

    /* Get All Roles */
    getRoles: builder.query<GetRolesResponse, void>({
      query: () => ({
        url: "/users/roles/",
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),
  }),
});

/* =======================
   Hooks Export
======================= */

export const {
  useCreateWorkflowMutation,
  useGetWorkflowsQuery,
  useGetRolesQuery,
} = workflowApi;