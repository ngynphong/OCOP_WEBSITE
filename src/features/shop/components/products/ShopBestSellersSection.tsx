import { FiTrendingUp } from 'react-icons/fi';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/features/products/types/productTypes';

interface ShopBestSellersSectionProps {
  bestSellers: Product[];
  wishlistStatusMap: Record<number, boolean>;
}

export const ShopBestSellersSection = ({
  bestSellers,
  wishlistStatusMap,
}: ShopBestSellersSectionProps) => {
  if (bestSellers.length === 0) return null;

  return (
    <section className="rounded-xl border border-rose-200/60 bg-gradient-to-br from-rose-50/30 via-white to-orange-50/15 p-3 sm:p-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-rose-500 to-red-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <FiTrendingUp size={13} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
                Sản phẩm bán chạy
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-rose-500 text-white tracking-wider">
                HOT
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium">
              Các mặt hàng được mua nhiều nhất và ưa chuộng nhất của gian hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2 py-0.5 bg-white/90 border border-rose-200 rounded-md text-[10px] font-bold text-rose-700 shadow-2xs">
            {bestSellers.length} sản phẩm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {bestSellers.map((product, idx) => (
          <ProductCard
            key={`bestseller-${product.id}`}
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
            topRank={idx + 1}
            compact
          />
        ))}
      </div>
    </section>
  );
};
