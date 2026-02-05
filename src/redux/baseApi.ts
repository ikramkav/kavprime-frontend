// src/redux/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL for your API - USE YOUR ORIGINAL IP ADDRESS
// const BASE_URL = "http://192.168.18.160:8000/api";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Create a reusable base API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Inventory", "Assets", "Tickets", "Roles", "Workflow"], // common tags
  endpoints: () => ({}), // empty, will extend in other APIs
});