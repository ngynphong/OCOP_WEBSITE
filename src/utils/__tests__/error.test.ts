import { describe, it, expect } from 'vitest';
import { AppError } from '../error';

describe('AppError', () => {
  it('instantiates correctly with default status code 500', () => {
    const error = new AppError('Internal server error');
    expect(error.message).toBe('Internal server error');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('AppError');
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });

  it('supports custom status code and payload data', () => {
    const payload = { field: 'email', reason: 'already exists' };
    const error = new AppError('Validation failed', 400, payload);
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.data).toEqual(payload);
  });
});
