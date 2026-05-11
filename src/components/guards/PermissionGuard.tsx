import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { PermissionValue } from '@/features/auth/constants/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  permissions?: PermissionValue[];
  fallback?: ReactNode;
  requireAny?: boolean;
}

export const PermissionGuard = ({
  children,
  permissions = [],
  fallback = null,
  requireAny = true,
}: PermissionGuardProps) => {
  const router = useRouter();
  const { hasAnyPermission, hasAllPermissions, isLoadingProfile, isAdminUser } = usePermission();
  const [showTimeoutError, setShowTimeoutError] = React.useState(false);

  const isAuthorized = requireAny ? hasAnyPermission(permissions) : hasAllPermissions(permissions);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoadingProfile) {
      timer = setTimeout(() => setShowTimeoutError(true), 5000);
    } else {
      // Khi load xong, thực hiện redirect nếu cần
      if (!isAdminUser) {
        router.push('/dang-nhap');
      } else if (!isAuthorized) {
        router.push('/admin/forbidden');
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
      // Reset lỗi khi component unmount hoặc isLoadingProfile thay đổi
      setShowTimeoutError(false);
    };
  }, [isLoadingProfile, isAdminUser, isAuthorized, router]);

  if (showTimeoutError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stone-900">Kết nối quá hạn</h3>
        <p className="text-stone-500 text-sm mt-2 max-w-xs mx-auto">
          Hệ thống không thể xác thực quyền hạn của bạn. Vui lòng kiểm tra kết nối mạng và tải lại
          trang.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition-colors"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  if (isLoadingProfile) return fallback;

  return isAuthorized ? <>{children}</> : fallback;
};
