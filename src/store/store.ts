import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      // Thêm các reducers khác vào đây
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
