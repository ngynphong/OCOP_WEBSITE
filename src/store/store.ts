import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './features/uiSlice';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      cart: cartReducer,
    },
  });
};

// Next.js App Router store usually should be created per request on server,
// but for client side utilities like Axios, we need a singleton.
export const store = makeStore();

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
