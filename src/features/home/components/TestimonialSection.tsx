import Image from 'next/image';
import { Quote, Star } from 'lucide-react';

export function TestimonialSection() {
  const testimonials = [
    {
      name: 'Minh Thư',
      location: 'TP. Hồ Chí Minh',
      avatar: '/images/avatar-mock.jpg',
      rating: 5,
      content:
        'Tôi rất ấn tượng với chất lượng hạt sen sấy. Sản phẩm được đóng gói rất đẹp, rất hợp làm quà tặng. Giao hàng cực nhanh!',
    },
    {
      name: 'Hoàng Nam',
      location: 'Hà Nội',
      avatar: '/images/avatar-mock.jpg',
      rating: 5,
      content:
        'OCOP Market là nơi duy nhất tôi tin tưởng khi mua đặc sản Tây Bắc. Nước mắm chuẩn vị truyền thống, đậm đà không hóa chất.',
    },
    {
      name: 'Lan Anh',
      location: 'Đà Nẵng',
      avatar: '/images/avatar-mock.jpg',
      rating: 4,
      content:
        'Mua hàng ở đây không chỉ là mua sắm, mà còn là ủng hộ những người nông dân tâm huyết. Giá cả rất hợp lý so với chất lượng OCOP.',
    },
  ];

  return (
    <section className="w-full pb-20 flex flex-col justify-start items-center">
      <div className="w-full max-w-7xl px-6 md:px-8 flex flex-col justify-start items-center gap-12 md:gap-16">
        {/* Header */}
        <div className="w-full flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-stone-900 text-3xl font-bold font-sans leading-9 mt-4">
            Đánh giá từ cộng đồng
          </h2>
          <p className="text-center text-neutral-600 text-base font-normal font-sans leading-6 max-w-2xl px-4">
            Sự hài lòng của khách hàng là minh chứng lớn nhất cho giá trị của nông sản Việt thực
            thụ.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, index) => (
            <div
              key={index}
              className="w-full p-8 relative bg-white border border-stone-100 rounded-[32px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-start items-start gap-6"
            >
              <Quote className="absolute left-6 md:left-8 top-[-10px] md:top-[-16px] w-8 h-8 md:w-12 md:h-12 text-green-700/20 fill-green-700/20 rotate-180" />

              <div className="flex gap-0.5 mb-2 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-200'}`}
                  />
                ))}
              </div>

              <p className="text-stone-800 text-sm md:text-base font-normal font-sans leading-6 italic relative z-10 flex-1">
                &quot;{review.content}&quot;
              </p>

              <div className="w-full flex justify-start items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-stone-100">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <h4 className="text-stone-900 text-sm font-bold font-sans leading-5">
                    {review.name}
                  </h4>
                  <span className="text-neutral-500 text-xs font-normal font-sans leading-4">
                    {review.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logos */}
        {/* <div className="w-full py-8 border-t border-stone-200/50 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex justify-start items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-900" />
            <span className="text-stone-900 text-xl font-black font-sans leading-8 uppercase tracking-widest">
              VIETGAP
            </span>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-600" />
            <span className="text-stone-900 text-xl font-black font-sans leading-8 uppercase tracking-widest">
              OCOP VIETNAM
            </span>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div
              className="w-5 h-4 bg-sky-700"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            />
            <span className="text-stone-900 text-xl font-black font-sans leading-8 uppercase tracking-widest">
              AGRI-PRO
            </span>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div className="w-5 h-5 rounded bg-lime-700" />
            <span className="text-stone-900 text-xl font-black font-sans leading-8 uppercase tracking-widest">
              ORGANIC-CERT
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
}
