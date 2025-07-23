import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type Role = "admin" | "teacher" | "parent" | null;

interface User {
   _id: string; 
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  role: Role;
  user: User | null;
  registerStatus: 'idle' | 'loading' | 'success' | 'failed';
  isLoading: boolean;
  error: string | null;
}

type LoginPayload = {
  token: string;
  role: Role;
  user: User;
};

type RegisterPayload = {
  token: string;
  role: Role;
  user: User;
};

// Helper function to safely parse localStorage
const safeParse = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return defaultValue;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  role: (localStorage.getItem("role") as Role) || null,
  user: safeParse<User | null>("user", null),
  registerStatus: 'idle',
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
      
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart(state) {
      state.registerStatus = 'loading';
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<RegisterPayload>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.registerStatus = 'success';
      state.error = null;
      
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.registerStatus = 'failed';
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.user = null;
      state.error = null;
      
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    }
  },
});

export const { 
  login, 
  logout, 
  loginStart,
  loginFailure,
  registerStart, 
  registerSuccess, 
  registerFailure,
  clearError
} = authSlice.actions;

export default authSlice.reducer;