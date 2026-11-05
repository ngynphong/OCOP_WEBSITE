export class WebSessionLockUnavailableError extends Error {
  constructor() {
    super('Trình duyệt không hỗ trợ làm mới phiên an toàn. Vui lòng đăng nhập lại.');
    this.name = 'WebSessionLockUnavailableError';
  }
}

/** Serializes use of the shared, single-use refresh cookie across browser tabs. */
export async function withWebSessionLock<T>(action: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
  if (!locks) {
    throw new WebSessionLockUnavailableError();
  }
  return await locks.request('ocop-session-refresh', action);
}
