import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'ocop_selected_cart_ids';

/**
 * Helper để lấy dữ liệu từ localStorage an toàn trong môi trường SSR
 */
const getInitialSelection = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse cart selection from localStorage', error);
    return [];
  }
};

interface CartState {
  selectedItemIds: number[];
}

const initialState: CartState = {
  selectedItemIds: getInitialSelection(),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleItemSelection: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.selectedItemIds.indexOf(id);
      if (index === -1) {
        state.selectedItemIds.push(id);
      } else {
        state.selectedItemIds.splice(index, 1);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedItemIds));
    },

    setSelection: (state, action: PayloadAction<number[]>) => {
      state.selectedItemIds = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedItemIds));
    },

    clearSelection: (state) => {
      state.selectedItemIds = [];
      localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Đồng bộ lại danh sách ID nếu có items bị xóa khỏi giỏ hàng thực tế
     */
    syncWithActualCart: (state, action: PayloadAction<number[]>) => {
      const actualIds = action.payload;
      state.selectedItemIds = state.selectedItemIds.filter((id) => actualIds.includes(id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedItemIds));
    },
  },
});

export const { toggleItemSelection, setSelection, clearSelection, syncWithActualCart } =
  cartSlice.actions;

export default cartSlice.reducer;
