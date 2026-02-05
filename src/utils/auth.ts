export const saveUserData = (userId: number, role: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_id", userId.toString());
    localStorage.setItem("role", role);
  }
};

export const getUserData = () => {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    return {
      userId: null,
      role: null as "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE" | null,
    };
  }

  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  
  return {
    userId: userId ? parseInt(userId) : null,
    role: role as "ADMIN" | "EMPLOYEE" | "PMO" | "SENIOR_PMO" | "FINANCE" | null,
  };
};

export const clearUserData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem("user_id") !== null;
};