'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNewsletter } from '../hooks/useNewsletter';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/AppButton';

export const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { subscribe, isSubscribing, subscribeMe, isSubscribingMe } = useNewsletter();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      subscribeMe(undefined, {
        onSuccess: () => {
          setIsSuccess(true);
          setEmail('');
        },
      });
    } else {
      if (!email) return;
      subscribe(
        { email },
        {
          onSuccess: () => {
            setIsSuccess(true);
            setEmail('');
          },
        },
      );
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#113B28] z-0" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-8 md:p-16 lg:p-24 overflow-hidden relative group">
          {/* Animated Background Element */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">
                <Sparkles size={14} /> Đặc quyền OCOP
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Đăng ký bản tin, <br />
                <span className="text-emerald-400">Nhận ngàn ưu đãi.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Trở thành người đầu tiên nhận thông tin về sản phẩm OCOP mới nhất, các chương trình
                khuyến mãi độc quyền và câu chuyện từ vùng nguyên liệu.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-10 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">Đăng ký thành công!</h3>
                    <p className="text-white/60">
                      Chúng tôi đã gửi một email xác nhận đến hộp thư của bạn. Vui lòng kiểm tra để
                      hoàn tất đăng ký.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    Đăng ký email khác
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400">
                      <Mail size={24} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isAuthenticated || isSubscribing || isSubscribingMe}
                      placeholder={
                        isAuthenticated
                          ? 'Sử dụng email tài khoản của bạn'
                          : 'Nhập địa chỉ email của bạn...'
                      }
                      className="w-full bg-white/10 border border-white/10 rounded-[28px] pl-16 pr-8 py-6 text-white text-lg font-medium outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-white/30"
                      required={!isAuthenticated}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubscribing || isSubscribingMe}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-6 rounded-[28px] text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 group"
                  >
                    {isSubscribing || isSubscribingMe ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Send size={20} />
                        </motion.div>
                        Đang xử lý...
                      </span>
                    ) : (
                      <>
                        Đăng ký ngay
                        <Send
                          size={20}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </>
                    )}
                  </Button>
                  <p className="text-white/40 text-[10px] text-center uppercase tracking-widest font-bold">
                    * Bằng cách đăng ký, bạn đồng ý với chính sách bảo mật của chúng tôi.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
