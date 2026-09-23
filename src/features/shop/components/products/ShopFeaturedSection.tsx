import { FiAward } from 'react-icons/fi';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/features/products/types/productTypes';

interface ShopFeaturedSectionProps {
  featuredProducts: Product[];
  wishlistStatusMap: Record<number, boolean>;
}

export const ShopFeaturedSection = ({
  featuredProducts,
  wishlistStatusMap,
}: ShopFeaturedSectionProps) => {
  if (featuredProducts.length === 0) return null;

  return (
    <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-yellow-50/20 p-3 sm:p-4 md:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <FiAward size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight">
                Sản phẩm nổi bật
              </h3>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase bg-amber-500 text-white tracking-wider">
                TIÊU BIỂU
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
              Đặc sản tiêu biểu nhận được nhiều đánh giá cao và chứng nhận OCOP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2 sm:px-2.5 py-0.5 bg-white/90 border border-amber-200 rounded-lg text-[10px] sm:text-[11px] font-bold text-amber-700 shadow-2xs">
            {featuredProducts.length} sản phẩm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {featuredProducts.map((product) => (
          <ProductCard
            key={`featured-${product.id}`}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.minPrice || 0}
            oldPrice={product.maxPrice > product.minPrice ? product.maxPrice : undefined}
            rating={product.ratingAvg || 0}
            reviewCount={product.totalReviews || 0}
            image={product.thumbnailUrl || null}
            ocopStar={product.ocopStar}
            location={product.provinceName || product.province?.name || 'Đang cập nhật'}
            shopName={product.shopName}
            categoryName={product.categoryName}
            soldCount={product.soldCount}
            isWishlisted={!!wishlistStatusMap[product.id]}
            inStock={product.inStock}
          />
        ))}
      </div>
    </section>
  );
};
