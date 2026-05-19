'use client';

import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { loginSchema, LoginFormData, simpleRegisterSchema, SimpleRegisterFormData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useState, useMemo } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import toast from 'react-hot-toast';

type FormPhase = 'IDENTIFY' | 'AUTHENTICATE';

export function LoginForm() {
  const {
    login,
    isLoggingIn,
    verifyAccount,
    isVerifyingAccount,
    simpleRegister,
    isSimpleRegistering,
  } = useAuth();

  const [phase, setPhase] = useState<FormPhase>('IDENTIFY');
  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  } = useForm<SimpleRegisterFormData & LoginFormData>({
    resolver: zodResolver(currentSchema) as unknown as Resolver<
      SimpleRegisterFormData & LoginFormData
    >,
    defaultValues: {
      identity: '',
      password: '',
      confirmPassword: '',
      remember: true,
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
    setPhase('IDENTIFY');
    setAccountExists(null);
    setValue('password', '');
    setValue('confirmPassword', '');
  };

  const onSubmit = async (data: SimpleRegisterFormData & LoginFormData) => {
    if (accountExists) {
      // Luồng Đăng nhập
      await login({
        identity: data.identity,
        password: data.password,
        deviceType: 'WEB',
      });
    } else {
      // Luồng Đăng ký nhanh
      await simpleRegister({
        identity: data.identity,
        password: data.password,
      });
    }
  };

  const isLoading = isLoggingIn || isSimpleRegistering;

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-500">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-stone-900 text-xl font-extrabold text-center font-sans tracking-tight">
          {phase === 'IDENTIFY'
            ? 'Chào mừng bạn'
            : accountExists
              ? 'Chào mừng trở lại'
              : 'Tạo tài khoản mới'}
        </h2>
        <p className="text-stone-400 text-xs mt-1 font-medium">
          {phase === 'IDENTIFY'
            ? 'Chào mừng bạn, Đăng nhập hoặc tạo tài khoản trong 1 bước'
            : accountExists
              ? 'Vui lòng nhập mật khẩu để đăng nhập'
              : 'Hoàn thành thông tin để bắt đầu'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Identity Field */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-stone-400 text-xs font-bold ml-1 uppercase tracking-wider">
            Tài khoản
          </label>
          <div className="relative group">
            <input
              {...register('identity')}
              disabled={phase === 'AUTHENTICATE'}
              type="text"
              placeholder="Email hoặc số điện thoại"
              className={`w-full border-b-2 pb-2 pt-1 px-1 text-stone-900 font-bold placeholder:text-stone-200 focus:outline-none transition-all bg-transparent ${
                errors.identity
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-100 focus:border-green-600'
              } ${phase === 'AUTHENTICATE' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {phase === 'AUTHENTICATE' && (
              <button
                type="button"
                onClick={handleBack}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700 font-bold text-[10px] uppercase flex items-center gap-1 group-hover:bg-green-50 px-2 py-1 rounded-full transition-all cursor-pointer"
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
        ) : (
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
                  className={`w-full border-b-2 pb-2 pt-1 px-1 text-stone-900 font-bold tracking-widest placeholder:text-stone-200 focus:outline-none transition-all bg-transparent ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-stone-100 focus:border-green-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors p-1"
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
                    className={`w-full border-b-2 pb-2 pt-1 px-1 text-stone-900 font-bold tracking-widest placeholder:text-stone-200 focus:outline-none transition-all bg-transparent ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-100 focus:border-green-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors p-1"
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
              {/* {accountExists ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'} */}
              Đăng nhập ngay
            </Button>
          </div>
        )}
      </form>

      {/* Embedded Image Inside Card */}
      <div className="mt-8 relative w-full h-16 sm:h-20 rounded-2xl overflow-hidden group cursor-pointer border border-stone-50 shadow-inner">
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
