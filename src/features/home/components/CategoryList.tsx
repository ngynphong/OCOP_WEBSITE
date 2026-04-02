import Image from 'next/image';
import Link from 'next/link';

export function CategoryList() {
  const categories = [
    {
      name: 'Nông sản sạch',
      image: '/images/fresh-green-produce.jpg',
      link: '/category/nong-san-sach',
    },
    { name: 'Trà & Đồ uống', image: '/images/tra-do-uong.jpg', link: '/category/tra-do-uong' },
    {
      name: 'Gia vị bản địa',
      image: '/images/gia-vi-ban-dia.jpg',
      link: '/category/gia-vi-ban-dia',
    },
    {
      name: 'Thủ công mỹ nghệ',
      image: '/images/thu-cong-my-nghe.jpg',
      link: '/category/thu-cong-my-nghe',
    },
    {
      name: 'Đặc sản vùng miền',
      image: '/images/dac-san-vung-mien.jpg',
      link: '/category/dac-san-vung-mien',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-start items-center gap-10">
      <div className="w-full flex justify-center items-center">
        <h2 className="text-stone-900 text-3xl font-bold font-sans leading-9">Danh mục nổi bật</h2>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-6 md:gap-12">
        {categories.map((cat, index) => (
          <Link
            href={cat.link}
            key={index}
            className="flex flex-col justify-start items-center gap-4 group cursor-pointer"
          >
            <div className="w-28 h-28 md:w-32 md:h-32 p-1.5 md:p-2 bg-stone-100 rounded-full border border-transparent group-hover:border-green-600/30 transition-colors flex flex-col justify-center items-center overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <h3 className="text-center text-stone-900 text-sm font-bold font-sans group-hover:text-green-800 transition-colors">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
