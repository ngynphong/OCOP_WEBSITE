import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoadingEmitter } from '../eventEmitter';

describe('LoadingEmitter', () => {
  let emitter: LoadingEmitter;

  beforeEach(() => {
    vi.useFakeTimers();
    emitter = new LoadingEmitter();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('notifies listeners when active requests are added', () => {
    const listener = vi.fn();
    const unsub = emitter.subscribe(listener);

    emitter.update(1, 'Đang tải danh mục OCOP...');

    expect(listener).toHaveBeenCalledWith(true, 'Đang tải danh mục OCOP...');
    unsub();
  });

  it('notifies listeners when requests finish after debounce delay', () => {
    const listener = vi.fn();
    const unsub = emitter.subscribe(listener);

    emitter.update(1, 'Đang xử lý...');
    expect(listener).toHaveBeenCalledWith(true, 'Đang xử lý...');

    emitter.update(-1);
    // Debounce timer hasn't fired yet
    expect(listener).not.toHaveBeenCalledWith(false, expect.any(String));

    // Fast-forward debounce delay (50ms)
    vi.advanceTimersByTime(50);
    expect(listener).toHaveBeenCalledWith(false, expect.any(String));

    unsub();
  });

  it('unsubscribes listeners cleanly', () => {
    const listener = vi.fn();
    const unsub = emitter.subscribe(listener);

    unsub();
    emitter.update(1);
    expect(listener).not.toHaveBeenCalled();
  });

  it('resets state completely on reset()', () => {
    const listener = vi.fn();
    emitter.subscribe(listener);
    emitter.update(5);

    emitter.reset();

    emitter.update(-1);
    expect(listener).not.toHaveBeenCalledWith(false, expect.any(String));
  });
});
