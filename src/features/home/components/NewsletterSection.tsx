'use client';

import { Mail } from 'lucide-react';

export function NewsletterSection() {
  return (
    <section className="w-full bg-green-900 relative overflow-hidden py-20 md:py-32 flex flex-col justify-center items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col justify-start items-center gap-8">
        <h2 className="text-center text-white text-3xl md:text-5xl lg:text-5xl font-bold font-sans leading-tight md:leading-tight">
          Trở thành một phần của câu
          <br className="hidden md:block" />
          chuyện nông sản Việt
        </h2>

        <p className="text-center text-emerald-100/90 text-sm md:text-lg font-normal font-sans leading-relaxed max-w-2xl px-4">
          Nhận những bản tin mới nhất về các sản phẩm OCOP đạt giải và những câu chuyện từ chính
          những người nông dân tâm huyết.
        </p>

        <form
          className="w-full max-w-xl mt-4 flex flex-col sm:flex-row justify-center items-center gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex-1 w-full px-6 py-4 bg-white/10 rounded-full outline outline-white/20 flex items-center gap-3 backdrop-blur-sm focus-within:outline-white/50 transition-all">
            <Mail className="w-5 h-5 text-emerald-100/70" />
            <input
              type="email"
              suppressHydrationWarning
              placeholder="Email của bạn"
              className="flex-1 bg-transparent border-none outline-none text-emerald-100 placeholder:text-emerald-100/70 font-sans text-sm md:text-base input-reset"
              required
            />
          </div>
          <button
            suppressHydrationWarning
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-emerald-50 text-green-900 rounded-full text-base font-bold font-sans shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
          >
            Đăng Ký Ngay
          </button>
        </form>
      </div>
    </section>
  );
}
