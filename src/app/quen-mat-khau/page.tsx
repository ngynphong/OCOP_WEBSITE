import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - OCOP',
  description: 'Khôi phục mật khẩu tài khoản OCOP',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      subtitle="Nhớ ra mật khẩu?"
      linkText="Đăng nhập"
      linkActionText="Đăng nhập"
      linkHref="/dang-nhap"
      rightPanelLine1="BẢO MẬT TÀI KHOẢN"
      rightPanelLine2="An tâm mua sắm"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
