import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  setCredentials,
  logout,
  setDashboardMode,
  setShopApproved,
  completeInitialization,
} from '../authSlice';

describe('authSlice', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  });

  const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    subject: null,
    roles: [],
    dashboardMode: 'USER' as const,
    isShopApproved: false,
  };

  it('sets credentials upon successful login', () => {
    const state = authReducer(
      initialState,
      setCredentials({ subject: 'user@example.test', roles: ['ROLE_SELLER'] }),
    );
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitialized).toBe(true);
    expect(state.subject).toBe('user@example.test');
    expect(state.roles).toEqual(['ROLE_SELLER']);
  });

  it('clears credentials on logout and resets mode', () => {
    const loggedInState = {
      isAuthenticated: true,
      isInitialized: true,
      subject: 'user@example.test',
      roles: ['ROLE_SELLER'],
      dashboardMode: 'SELLER' as const,
      isShopApproved: true,
    };
    const state = authReducer(loggedInState, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.subject).toBeNull();
    expect(state.roles).toEqual([]);
    expect(state.dashboardMode).toBe('USER');
    expect(state.isShopApproved).toBe(false);
  });

  it('sets dashboard mode and shop approved status', () => {
    let state = authReducer(initialState, setDashboardMode('SELLER'));
    expect(state.dashboardMode).toBe('SELLER');

    state = authReducer(state, setShopApproved(true));
    expect(state.isShopApproved).toBe(true);
  });

  it('marks initialization as complete', () => {
    const state = authReducer(initialState, completeInitialization());
    expect(state.isInitialized).toBe(true);
  });
});
