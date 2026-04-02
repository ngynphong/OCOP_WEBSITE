import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export const metadata: Metadata = {
  title: 'Đăng nhập - OCOP',
  description: 'Đăng nhập vào hệ thống OCOP',
};

export default function LoginPage() {
  return (
    <AuthLayout
      subtitle="Chưa có tài khoản?"
      linkText="Tạo tài khoản"
      linkActionText="Tạo tài khoản"
      linkHref="/dang-ky"
      rightPanelLine1="TINH HOA ĐẤT VIỆT"
      rightPanelLine2="Sản phẩm chính hãng"
    >
      <LoginForm />
    </AuthLayout>
  );
}
