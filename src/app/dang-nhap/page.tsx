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
      subtitle="Nhập email hoặc số điện thoại để tiếp tục"
      linkText="Quên mật khẩu"
      linkActionText="Quên mật khẩu"
      linkHref="/quen-mat-khau"
      rightPanelLine1="TINH HOA ĐẤT VIỆT"
      rightPanelLine2="Sản phẩm chính hãng"
    >
      <LoginForm />
    </AuthLayout>
  );
}
