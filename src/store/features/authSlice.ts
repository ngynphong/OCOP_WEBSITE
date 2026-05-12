import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  token: string | null;
  roles: string[];
  dashboardMode: 'USER' | 'SELLER';
  isForcedLogout: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  token: null,
  roles: [],
  dashboardMode: 'USER',
  isForcedLogout: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; roles: string[] }>) => {
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.dashboardMode = 'USER';
      state.isForcedLogout = false;
    },
    completeInitialization: (state) => {
      state.isInitialized = true;
    },
    setForcedLogout: (state, action: PayloadAction<boolean>) => {
      state.isForcedLogout = action.payload;
    },
    setDashboardMode: (state, action: PayloadAction<'USER' | 'SELLER'>) => {
      state.dashboardMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_mode', action.payload);
      }
    },
  },
});

export const { setCredentials, logout, completeInitialization, setDashboardMode, setForcedLogout } =
  authSlice.actions;
export default authSlice.reducer;
