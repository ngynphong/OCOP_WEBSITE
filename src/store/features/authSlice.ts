import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  subject: string | null;
  roles: string[];
  dashboardMode: 'USER' | 'SELLER';
  isShopApproved: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  subject: null,
  roles: [],
  dashboardMode: 'USER',
  isShopApproved: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ subject?: string; roles: string[] }>) => {
      if (action.payload.subject !== undefined) state.subject = action.payload.subject;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.subject = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.dashboardMode = 'USER';
      state.isShopApproved = false;
    },
    completeInitialization: (state) => {
      state.isInitialized = true;
    },
    setShopApproved: (state, action: PayloadAction<boolean>) => {
      state.isShopApproved = action.payload;
    },
    setDashboardMode: (state, action: PayloadAction<'USER' | 'SELLER'>) => {
      state.dashboardMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_mode', action.payload);
      }
    },
  },
});

export const { setCredentials, logout, completeInitialization, setDashboardMode, setShopApproved } =
  authSlice.actions;
export default authSlice.reducer;
