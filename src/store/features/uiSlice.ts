import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: UiState = {
  isSidebarOpen: false,
  isLoading: false,
  loadingMessage: 'Đang xử lý...',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      if (action.payload.message) {
        state.loadingMessage = action.payload.message;
      } else if (!action.payload.isLoading) {
        state.loadingMessage = 'Đang xử lý...'; // Reset message when stopped
      }
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
