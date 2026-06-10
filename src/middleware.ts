import { NextResponse, type NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[MW-AUTH-ERROR] Token parse error:', e);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get('access_token')?.value;
    const userRolesCookie = request.cookies.get('user_roles')?.value;

    if (!userRolesCookie && !accessToken) {
      const url = new URL('/dang-nhap', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      let roles: string[] = [];

      if (accessToken) {
        const decoded = decodeJwt(accessToken);
        if (decoded && decoded.roles && Array.isArray(decoded.roles)) {
          roles = decoded.roles;
        } else if (decoded && decoded.scope) {
          roles = typeof decoded.scope === 'string' ? decoded.scope.split(' ') : decoded.scope;
        }
      }

      // Fallback: Nếu không đọc được roles từ token, BẮT BUỘC gọi API để verify, TUYỆT ĐỐI không tin cookie
      if (roles.length === 0 && accessToken) {
        try {
          // Xây dựng URL API dựa vào biến môi trường
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
          const profileRes = await fetch(`${apiUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData?.data?.roles) {
              roles = profileData.data.roles;
            }
          }
        } catch (error) {
          console.error('[MW-AUTH-ERROR] Failed to fetch profile from middleware:', error);
        }
      }

      console.log(`[MW-AUTH-CHECK] Path: ${pathname} | Roles: ${roles.join(', ')}`);

      if (roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')) {
        return NextResponse.next();
      }

      console.warn(`[MW-AUTH-BLOCK] Unauthorized access attempt to admin route: ${pathname}`);

      // Chuyển hướng người dùng về trang chủ kèm theo thông báo không có quyền (nếu cần thiết)
      const url = new URL('/', request.url);
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    } catch (err) {
      console.error('[MW-AUTH-ERROR] Token/Cookie parse error:', err);
      const response = NextResponse.redirect(new URL('/dang-nhap', request.url));
      response.cookies.delete('access_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
