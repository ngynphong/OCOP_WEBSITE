import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const userRolesCookie = request.cookies.get('user_roles')?.value;

    if (!userRolesCookie) {
      const url = new URL('/dang-nhap', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const roles: string[] = JSON.parse(userRolesCookie);

      console.log(`[MW-AUTH-CHECK] Path: ${pathname} | Roles: ${roles.join(', ')}`);

      if (roles.includes('ADMIN')) {
        return NextResponse.next();
      }

      const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];
      const isCustomerOnly = roles.every((role) => CUSTOMER_ONLY_ROLES.includes(role));

      if (isCustomerOnly) {
        console.warn(`[MW-AUTH-BLOCK] Customer attempted to access admin route: ${pathname}`);
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error('[MW-AUTH-ERROR] Cookie parse error:', err);
      const response = NextResponse.redirect(new URL('/dang-nhap', request.url));
      response.cookies.delete('user_roles');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
