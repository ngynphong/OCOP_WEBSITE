import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  roles: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  roles: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; roles: string[] }>) => {
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
