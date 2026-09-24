import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getOrCreateSessionId, clearSessionId, getSessionId } from '../utils/cartSession';

describe('cartSession', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(store).forEach((key) => delete store[key]);

    // Mock window & localStorage in node environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = global;
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

  it('generates a new UUID session id when none exists', () => {
    expect(getSessionId()).toBeNull();

    const sessionId = getOrCreateSessionId();
    expect(sessionId).toBeDefined();
    // Validate UUID v4 structure: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    expect(sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('reuses existing session id on subsequent calls', () => {
    const firstId = getOrCreateSessionId();
    const secondId = getOrCreateSessionId();

    expect(firstId).toBe(secondId);
    expect(getSessionId()).toBe(firstId);
  });

  it('clears session id when user logs in or cart is merged', () => {
    getOrCreateSessionId();
    expect(getSessionId()).not.toBeNull();

    clearSessionId();
    expect(getSessionId()).toBeNull();
  });
});
