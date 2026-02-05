import { baseApi } from "../../baseApi";

// Types for requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
  role: "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE";
  redirect_url: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE";
  designation?: string;
  employment_status?: string;
  join_date?: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
  role: "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE";
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  role?: "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE";
  designation?: string;
  employment_status?: string;
  join_date?: string;
}

export interface UpdateUserResponse {
  message: string;
  user_id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE";
  employment_status: string;
  designation: string;
}

export interface DeleteUserRequest {
  id: number;
}

export interface DeleteUserResponse {
  message: string;
}
export interface MarkedUserExit{
  employee_id:number;
  // exit_date:string; // can be added later if needed
}
export interface MarkedUserExitResponse{
  employee_id:number;
  // exit_date:string; // can be added later if needed
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE";
  designation?: string;
  employment_status?:string;
  join_date?: string;
}

export interface GetUsersResponse {
  users: User[];
}

// Extend the base API with auth endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get all users endpoint
    getUsers: builder.query<GetUsersResponse, void>({
      query: () => ({
        url: "/users/getUsers/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Register endpoint
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/users/register/",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user endpoint
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (userData) => ({
        url: "/users/update/",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // mark as exited
    // markExitedUser:builder.mutation<MarkedUserExitResponse, MarkedUserExit>({
    //   query:(userData)=>({
    //     url:'/users/mark-exited',
    //     method:'POST',
    //     body:userData,
    //   }),
    // }),
    
    // Delete user endpoint
    deleteUser: builder.mutation<DeleteUserResponse, DeleteUserRequest>({
      query: (data) => ({
        url: "/users/delete/",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useGetUsersQuery,
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;