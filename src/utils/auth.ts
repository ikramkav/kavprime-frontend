export type UserRole =
  | "ADMIN"
  | "EMPLOYEE"
  | "PMO"
  | "SENIOR_PMO"
  | "FINANCE";

interface LoginTokenPayload {
  access?: string;
  refresh?: string;
  token_type?: string;
  expires_in?: string;
}

interface SaveAuthDataPayload {
  userId: number;
  role: UserRole;
  employmentStatus?: string;
  workflow?: unknown;
  tokens?: LoginTokenPayload;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_TYPE_KEY = "token_type";

export const saveAuthData = (payload: SaveAuthDataPayload) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("user_id", payload.userId.toString());
  localStorage.setItem("role", payload.role);

  if (payload.employmentStatus) {
    localStorage.setItem("employment_status", payload.employmentStatus);
  }

  if (payload.workflow) {
    localStorage.setItem("workflow", JSON.stringify(payload.workflow));
    const workflowWithSteps = payload.workflow as { steps?: unknown[] };
    if (workflowWithSteps.steps) {
      localStorage.setItem("workflow_steps", JSON.stringify(workflowWithSteps.steps));
    }
  }

  if (payload.tokens?.access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.tokens.access);
  }

  if (payload.tokens?.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.tokens.refresh);
  }

  localStorage.setItem(TOKEN_TYPE_KEY, payload.tokens?.token_type || "Bearer");

  if (payload.tokens?.expires_in) {
    localStorage.setItem("token_expires_in", payload.tokens.expires_in);
  }
};

export const getUserData = () => {
  if (typeof window === "undefined") {
    return { userId: null, role: null as UserRole | null };
  }

  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  return {
    userId: userId ? parseInt(userId, 10) : null,
    role: role as UserRole | null,
  };
};

export const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getAuthHeader = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return null;
  }

  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || "Bearer";
  return `${tokenType} ${token}`;
};

export const clearUserData = () => {
  if (typeof window === "undefined") {
    return;
  }

  [
    "user_id",
    "role",
    "employment_status",
    "workflow",
    "workflow_steps",
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    TOKEN_TYPE_KEY,
    "token_expires_in",
  ].forEach((key) => localStorage.removeItem(key));
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("user_id"));
};
