import { describe, it, expect, vi } from 'vitest';
import { authEmitter } from '../authEmitter';

describe('authEmitter', () => {
  it('notifies all subscribers when UNAUTHORIZED event is emitted', () => {
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    const unsubA = authEmitter.subscribe(listenerA);
    const unsubB = authEmitter.subscribe(listenerB);

    authEmitter.emit('UNAUTHORIZED');

    expect(listenerA).toHaveBeenCalledTimes(1);
    expect(listenerB).toHaveBeenCalledTimes(1);

    unsubA();
    unsubB();
  });

  it('stops notifying a subscriber once unsubscribed', () => {
    const listener = vi.fn();
    const unsubscribe = authEmitter.subscribe(listener);

    authEmitter.emit('UNAUTHORIZED');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();

    authEmitter.emit('UNAUTHORIZED');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
