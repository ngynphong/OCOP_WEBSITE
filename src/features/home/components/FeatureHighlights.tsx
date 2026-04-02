import { ShieldCheck, RefreshCw, Lock } from 'lucide-react';

export function FeatureHighlights() {
  const highlights = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-900" />,
      title: '100% Chính hãng',
      desc: 'Kiểm định OCOP 3-5 sao',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-green-900" />,
      title: '7 ngày đổi trả',
      desc: 'Bảo vệ quyền lợi người mua',
    },
    {
      icon: <Lock className="w-6 h-6 text-green-900" />,
      title: 'Thanh toán an toàn',
      desc: 'Đa dạng phương thức bảo mật',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-0 mt-4 mb-4">
      <div className="w-full px-6 md:px-12 py-8 bg-orange-100/80 rounded-[32px] grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 shadow-sm">
        {highlights.map((item, index) => (
          <div key={index} className="flex justify-start items-center gap-4">
            <div className="w-12 h-12 bg-green-900/10 rounded-full flex justify-center items-center shrink-0">
              {item.icon}
            </div>
            <div className="flex flex-col justify-start items-start">
              <h3 className="text-stone-900 text-base font-bold font-sans leading-6 mb-0.5">
                {item.title}
              </h3>
              <p className="text-neutral-500 text-sm font-normal font-sans leading-5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
