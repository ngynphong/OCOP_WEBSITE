import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Đọc token từ cookie (vì localStorage không tồn tại trên server)
  const token = request.cookies.get('access_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Chỉ định các route cần chạy proxy (trước đây là config middleware)
export const config = {
  matcher: ['/dashboard/:path*', '/cart', '/login'],
};
