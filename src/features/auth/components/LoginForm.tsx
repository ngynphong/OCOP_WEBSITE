'use client';

import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { loginSchema, LoginFormData, simpleRegisterSchema, SimpleRegisterFormData } from '../types';
import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';
import { useVerify } from '../hooks/useVerify';
import { useState, useMemo } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

type FormPhase = 'IDENTIFY' | 'AUTHENTICATE' | '2FA';

export function LoginForm() {
  const { login, isLoggingIn } = useLogin();
  const { simpleRegister, isSimpleRegistering } = useRegister();
  const { verifyAccount, isVerifyingAccount, verify2fa, isVerifying2fa } = useVerify();

  const [phase, setPhase] = useState<FormPhase>('IDENTIFY');
  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Chưa cấu hình Google Client ID trong hệ thống.');
      return;
    }

    const state =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('oauth_state', state);

    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('oauth_redirect_path', currentPath);

    const redirectUri =
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
      `${window.location.origin}/auth/google/callback`;

    const scope = 'openid email profile';
    const responseType = 'code';

    const googleOAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=${encodeURIComponent(responseType)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${encodeURIComponent(state)}&` +
      `prompt=select_account`;

    window.location.href = googleOAuthUrl;
  };

  const currentSchema = useMemo(() => {
    if (phase === 'IDENTIFY') return loginSchema.pick({ identity: true });
    return accountExists ? loginSchema : simpleRegisterSchema;
  }, [phase, accountExists]);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<SimpleRegisterFormData & LoginFormData & { otp?: string }>({
    resolver: zodResolver(currentSchema) as unknown as Resolver<
      SimpleRegisterFormData & LoginFormData & { otp?: string }
    >,
    defaultValues: {
      identity: '',
      password: '',
      confirmPassword: '',
      remember: true,
      otp: '',
    },
  });

  const handleNextPhase = async () => {
    const isValid = await trigger('identity');
    if (!isValid) return;

    const identityValue = (document.getElementsByName('identity')[0] as HTMLInputElement)?.value;
    if (!identityValue) return;

    try {
      const res = await verifyAccount(identityValue);
      const exists = res.data.exists === 'true';
      setAccountExists(exists);
      setPhase('AUTHENTICATE');
      if (!exists) {
        toast.success('Tài khoản mới! Hãy thiết lập mật khẩu để đăng ký.');
      }
    } catch (error) {
      console.error('Lỗi kiểm tra tài khoản:', error);
    }
  };

  const handleBack = () => {
    if (phase === '2FA') {
      setPhase('AUTHENTICATE');
      setValue('otp', '');
    } else {
      setPhase('IDENTIFY');
      setAccountExists(null);
      setValue('password', '');
      setValue('confirmPassword', '');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (phase === '2FA') {
      await verify2fa({
        target: data.identity,
        code: data.otp,
        deviceType: 'WEB',
      });
      return;
    }

    if (accountExists) {
      // Luồng Đăng nhập
      const res = await login({
        identity: data.identity,
        password: data.password,
        deviceType: 'WEB',
      });

      if (res.data.requireOtp) {
        setPhase('2FA');
        toast('Tài khoản của bạn được bảo vệ bởi Xác thực 2 bước. Vui lòng nhập mã OTP.', {
          icon: '🛡️',
        });
      }
    } else {
      // Luồng Đăng ký nhanh
      await simpleRegister({
        identity: data.identity,
        password: data.password,
      });
    }
  };

  const isLoading = isLoggingIn || isSimpleRegistering || isVerifying2fa;

  return (
    <div className="relative z-20 w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:shadow-[0_20px_50px_rgba(8,_112,_104,_0.15)] transition-all duration-500">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-stone-900 text-xl font-extrabold text-center font-sans tracking-tight">
          {phase === 'IDENTIFY'
            ? 'Chào mừng bạn'
            : accountExists
              ? 'Chào mừng trở lại'
              : 'Tạo tài khoản mới'}
        </h2>
        <p className="text-stone-400 text-center text-xs mt-1 font-medium">
          {phase === 'IDENTIFY'
            ? 'Chào mừng bạn, Đăng nhập hoặc tạo tài khoản trong 1 bước'
            : phase === '2FA'
              ? 'Nhập mã gồm 6 chữ số từ ứng dụng xác thực hoặc email/SMS'
              : accountExists
                ? 'Vui lòng nhập mật khẩu để đăng nhập'
                : 'Hoàn thành thông tin để bắt đầu'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Identity Field */}
        <div className={`flex flex-col gap-2 relative ${phase === '2FA' ? 'hidden' : ''}`}>
          <label className="text-stone-400 text-xs font-bold ml-1 uppercase tracking-wider">
            Tài khoản
          </label>
          <div className="relative group">
            <input
              {...register('identity')}
              disabled={phase === 'AUTHENTICATE'}
              type="text"
              placeholder="Email hoặc số điện thoại"
              className={`w-full bg-white border px-4 py-3 pr-16 rounded-xl text-stone-900 font-medium placeholder:text-stone-300 focus:outline-none focus:ring-2 transition-all duration-300 shadow-xs ${
                errors.identity
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-emerald-500/20'
              } ${phase === 'AUTHENTICATE' ? 'opacity-80 cursor-not-allowed bg-stone-50 text-stone-500' : ''}`}
            />
            {phase === 'AUTHENTICATE' && (
              <button
                type="button"
                onClick={handleBack}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 font-bold text-[10px] uppercase flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded-full transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" /> Sửa
              </button>
            )}
          </div>
          {errors.identity && (
            <span className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
              {errors.identity.message}
            </span>
          )}
        </div>

        {phase === 'IDENTIFY' ? (
          <Button
            type="button"
            onClick={handleNextPhase}
            isLoading={isVerifyingAccount}
            className="mt-2 group overflow-hidden"
          >
            <span className="flex items-center gap-2">
              Tiếp tục{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        ) : phase === 'AUTHENTICATE' ? (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-stone-400 text-xs font-bold ml-1 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  autoFocus
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className={`w-full bg-white border px-4 py-3 pr-12 rounded-xl text-stone-900 font-medium tracking-widest placeholder:text-stone-300 focus:outline-none focus:ring-2 transition-all duration-300 shadow-xs ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-stone-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors p-1 bg-transparent"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password Field (Only for Register) */}
            {!accountExists && (
              <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-300">
                <label className="text-stone-400 text-xs font-bold ml-1 uppercase tracking-wider">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    className={`w-full bg-white border px-4 py-3 pr-12 rounded-xl text-stone-900 font-medium tracking-widest placeholder:text-stone-300 focus:outline-none focus:ring-2 transition-all duration-300 shadow-xs ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-stone-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors p-1 bg-transparent"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            )}

            {/* Remember & Forgot Password */}
            {accountExists && (
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      {...register('remember')}
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 border-2 border-stone-200 rounded-sm checked:bg-green-600 checked:border-green-600 focus:outline-none transition-all cursor-pointer"
                    />
                    <svg
                      className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-stone-500 text-xs font-bold group-hover:text-stone-900 transition-colors">
                    Ghi nhớ
                  </span>
                </label>

                <Link
                  href="/quen-mat-khau"
                  className="text-stone-400 text-xs font-bold hover:text-green-600 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="mt-2 shadow-xl shadow-green-900/10 active:scale-[0.98]"
            >
              Đăng nhập ngay
            </Button>
          </div>
        ) : phase === '2FA' ? (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col gap-2">
              <label className="text-stone-400 text-xs font-bold ml-1 uppercase tracking-wider">
                Mã xác thực (OTP)
              </label>
              <div className="relative">
                <input
                  {...register('otp')}
                  autoFocus
                  maxLength={6}
                  type="text"
                  placeholder="123456"
                  className={`w-full bg-white border px-4 py-3 pr-24 rounded-xl text-stone-900 font-medium tracking-widest text-center placeholder:text-stone-300 focus:outline-none focus:ring-2 transition-all duration-300 border-stone-200 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-xs`}
                />
                <button
                  type="button"
                  onClick={handleBack}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 font-bold text-[10px] uppercase flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded-full transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Quay lại
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="mt-2 shadow-xl shadow-green-900/10 active:scale-[0.98]"
            >
              Xác nhận
            </Button>
          </div>
        ) : null}
      </form>

      {/* Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-100"></div>
        </div>
        <span className="relative px-3 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
          Hoặc
        </span>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 font-semibold text-sm transition-all duration-300 shadow-xs hover:shadow-sm active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
      >
        <FcGoogle className="w-5 h-5 shrink-0" />
        <span>Tiếp tục với Google</span>
      </button>

      {/* Embedded Image Inside Card */}
      <div className="mt-8 relative w-full h-16 sm:h-20 rounded-xl overflow-hidden group cursor-pointer border border-stone-50 shadow-inner">
        <Image
          src="/images/login-form.jpg"
          alt="OCOP promotion"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 to-transparent group-hover:from-green-900/40 transition-colors duration-700"></div>
        <div className="absolute bottom-2 right-3">
          <span className="text-white/90 text-[10px] font-black tracking-[0.3em] drop-shadow-sm">
            OCOP VIỆT NAM
          </span>
        </div>
      </div>
    </div>
  );
}
