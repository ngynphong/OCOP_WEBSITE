export class AppError extends Error {
  public readonly statusCode: number;
  public readonly data?: unknown;

  constructor(message: string, statusCode: number = 500, data?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.data = data;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
