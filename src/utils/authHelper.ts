// utils/authHelper.ts
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getCurrentRole = (): string | null => {
  return localStorage.getItem("role");
};

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem("userId");
};