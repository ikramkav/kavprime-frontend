// src/redux/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { clearUserData, getAuthHeader } from "@/utils/auth";

// Base URL for your API - Use environment variable or fallback to localhost
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    const authHeader = getAuthHeader();
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && typeof window !== "undefined") {
    clearUserData();
    window.location.href = "/auth/login";
  }

  return result;
};

// Create a reusable base API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "User",
    "Inventory",
    "Assets",
    "Tickets",
    "Roles",
    "Workflow",
    "Reports",
  ], // common tags
  endpoints: () => ({}), // empty, will extend in other APIs
});
