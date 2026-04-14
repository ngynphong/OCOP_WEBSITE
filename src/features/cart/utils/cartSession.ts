// ============================================================
// CART SESSION UTILITY — Guest cart session management
// Guest flow: X-Session-Id header (UUID stored in localStorage)
// ============================================================

const SESSION_KEY = 'ocop_guest_session_id';

/** Lấy hoặc tạo mới UUID cho guest session */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  // Generate UUID v4-compatible
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  localStorage.setItem(SESSION_KEY, uuid);
  return uuid;
}

/** Xóa session sau khi merge cart thành công */
export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

/** Lấy session hiện tại (không tạo mới nếu chưa có) */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}
