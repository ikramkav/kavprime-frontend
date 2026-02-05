//src/redux/services/roles/rolesApi.ts

import { baseApi } from "../../baseApi";

/* =======================
   Types & Interfaces
======================= */

export interface CreateRoleRequest {
  name: string;
}

export interface CreateRoleResponse {
  id: number;
  name: string;
  created: boolean;
}

export interface Role {
  id: number;
  name: string;
  is_active: boolean;
}

export type GetRolesResponse = Role[];

export interface UpdateRoleStatusRequest {
  roleId: number;      // passed in URL
  is_active: boolean;  // passed in body
}

export interface UpdateRoleStatusResponse {
  id: number;
  name: string;
  is_active: boolean;
}

/* =======================
   RTK Query API
======================= */

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* Create Role */
    createRole: builder.mutation<CreateRoleResponse, CreateRoleRequest>({
      query: (roleData) => ({
        url: "/users/roles/add/",
        method: "POST",
        body: roleData,
      }),
      invalidatesTags: ["Roles"],
    }),

    /* Get All Roles */
    getRoles: builder.query<GetRolesResponse, void>({
      query: () => ({
        url: "/users/roles/",
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    /* Activate / Deactivate Role */
    updateRoleStatus: builder.mutation<
      UpdateRoleStatusResponse,
      UpdateRoleStatusRequest
    >({
      query: ({ roleId, is_active }) => ({
        url: `/users/roles/${roleId}/active/`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

/* =======================
   Hooks Export
======================= */

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useUpdateRoleStatusMutation,
} = rolesApi;
