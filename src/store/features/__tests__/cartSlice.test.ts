import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  toggleItemSelection,
  setSelection,
  clearSelection,
  syncWithActualCart,
} from '../cartSlice';

describe('cartSlice', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    // Mock global localStorage in node test environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    };
  });

  it('toggles item selection by adding and removing item IDs', () => {
    let state = cartReducer({ selectedItemIds: [] }, toggleItemSelection(101));
    expect(state.selectedItemIds).toEqual([101]);

    state = cartReducer(state, toggleItemSelection(102));
    expect(state.selectedItemIds).toEqual([101, 102]);

    state = cartReducer(state, toggleItemSelection(101));
    expect(state.selectedItemIds).toEqual([102]);
  });

  it('sets selection array', () => {
    const state = cartReducer({ selectedItemIds: [] }, setSelection([1, 2, 3]));
    expect(state.selectedItemIds).toEqual([1, 2, 3]);
  });

  it('clears selection array', () => {
    const state = cartReducer({ selectedItemIds: [1, 2, 3] }, clearSelection());
    expect(state.selectedItemIds).toEqual([]);
  });

  it('syncs with actual cart items, pruning deleted items', () => {
    const initialState = { selectedItemIds: [10, 20, 30, 40] };
    const actualCartItemIds = [10, 30, 50]; // 20 and 40 were deleted from cart
    const state = cartReducer(initialState, syncWithActualCart(actualCartItemIds));
    expect(state.selectedItemIds).toEqual([10, 30]);
  });
});
