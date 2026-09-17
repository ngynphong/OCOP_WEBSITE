import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { useSellerEvent, useSellerEventMutations } from '@/features/events/hooks/useSellerEvents';
import { useSellerProductsQuery } from '@/features/products/hooks/useSellerProducts';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import type { Product, ProductVariant } from '@/features/products/types/productTypes';
import type { EventFlashSaleApplication } from '@/features/events/types/eventCommerceTypes';

export type DraftItem = {
  variantId: number;
  productId: number;
  productName: string;
  variantName: string;
  originalPrice: number;
  availableQty: number;
  salePrice: number;
  qtyLimit: number;
  thumbnailUrl?: string;
};

export function useSellerEventDetailManagement(eventId: number) {
  const { data: event, isLoading, isError, refetch } = useSellerEvent(eventId);
  const mutations = useSellerEventMutations(eventId);

  const [customSelectedSlotId, setCustomSelectedSlotId] = useState<number | undefined>();
  const selectedSlotId = customSelectedSlotId ?? event?.slots[0]?.id;

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const [items, setItems] = useState<DraftItem[]>([]);
  const [sellerNote, setSellerNote] = useState('');

  const { data: productResponse, isLoading: productsLoading } = useSellerProductsQuery({
    pageNo: 1,
    pageSize: 30,
    status: 'APPROVED',
    search: debouncedSearch || undefined,
  });

  const productItems = productResponse?.data?.items;
  const eligibleProducts = useMemo(() => {
    const products = (productItems || []) as Product[];
    return products.filter((product) => !event || (product.ocopStar || 0) >= event.minOcopStar);
  }, [event, productItems]);

  const selectedApplication = useMemo(
    () => event?.applications.find((app) => app.eventFlashSaleId === selectedSlotId),
    [event?.applications, selectedSlotId],
  );

  // Sync items and seller note when selectedApplication changes
  useEffect(() => {
    if (
      !selectedApplication ||
      !['DRAFT', 'CHANGES_REQUESTED'].includes(selectedApplication.status)
    ) {
      setItems([]);
      setSellerNote('');
      return;
    }
    setSellerNote(selectedApplication.sellerNote || '');
    setItems(
      selectedApplication.items.map((item) => ({
        variantId: item.variantId,
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName || item.sku || `Variant #${item.variantId}`,
        originalPrice: item.originalPrice,
        availableQty: item.availableQty,
        salePrice: item.salePrice,
        qtyLimit: item.qtyLimit,
        thumbnailUrl: item.thumbnailUrl,
      })),
    );
  }, [selectedApplication]);

  const openProduct = async (product: Product) => {
    if (expandedProductId === product.id) {
      setExpandedProductId(null);
      return;
    }
    try {
      setExpandedProductId(product.id);
      setLoadingVariants(true);
      const response = await sellerProductApi.getVariants(product.id);
      setVariants(response.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải biến thể');
    } finally {
      setLoadingVariants(false);
    }
  };

  const addVariant = (product: Product, variant: ProductVariant) => {
    if (!event || items.some((item) => item.variantId === variant.id)) return;
    if (
      new Set([...items.map((item) => item.productId), product.id]).size > event.maxProductsPerShop
    ) {
      toast.error(`Sự kiện giới hạn ${event.maxProductsPerShop} sản phẩm cho mỗi shop`);
      return;
    }
    const suggestedPrice = Math.floor((variant.price * (100 - event.minDiscountPercent)) / 100);
    setItems((current) => [
      ...current,
      {
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        variantName: variant.variantName || variant.sku || `Variant #${variant.id}`,
        originalPrice: variant.price,
        availableQty: variant.availableQty,
        salePrice: suggestedPrice,
        qtyLimit: Math.min(1, variant.availableQty),
        thumbnailUrl: product.thumbnailUrl || product.images?.find((image) => image.isPrimary)?.url,
      },
    ]);
  };

  const updateItem = (variantId: number, change: Partial<DraftItem>) =>
    setItems((current) =>
      current.map((item) => (item.variantId === variantId ? { ...item, ...change } : item)),
    );

  const removeItem = (variantId: number) =>
    setItems((current) => current.filter((item) => item.variantId !== variantId));

  const save = async (submit: boolean) => {
    if (!event || !selectedSlotId || items.length === 0) {
      toast.error('Hãy chọn khung giờ và ít nhất một biến thể');
      return;
    }
    try {
      const payload = {
        eventFlashSaleId: selectedSlotId,
        sellerNote: sellerNote || undefined,
        items: items.map(({ variantId, salePrice, qtyLimit }) => ({
          variantId,
          salePrice: Number(salePrice),
          qtyLimit: Number(qtyLimit),
        })),
      };
      const application = selectedApplication
        ? await mutations.update.mutateAsync({ id: selectedApplication.id, data: payload })
        : await mutations.create.mutateAsync(payload);
      if (submit) await mutations.submit.mutateAsync(application.id);
      toast.success(submit ? 'Đã gửi đăng ký đến Admin' : 'Đã lưu bản nháp');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu đăng ký');
    }
  };

  const withdraw = async (application: EventFlashSaleApplication) => {
    if (!confirm('Rút hồ sơ đăng ký này?')) return;
    try {
      await mutations.withdraw.mutateAsync(application.id);
      toast.success('Đã rút hồ sơ');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể rút hồ sơ');
    }
  };

  const editable =
    event?.registrationStatus === 'OPEN' &&
    (!selectedApplication || ['DRAFT', 'CHANGES_REQUESTED'].includes(selectedApplication.status));

  return {
    event,
    isLoading,
    isError,
    refetch,
    mutations,
    selectedSlotId,
    setSelectedSlotId: setCustomSelectedSlotId,
    search,
    setSearch,
    expandedProductId,
    variants,
    loadingVariants,
    items,
    setItems,
    sellerNote,
    setSellerNote,
    productsLoading,
    eligibleProducts,
    selectedApplication,
    editable,
    openProduct,
    addVariant,
    updateItem,
    removeItem,
    save,
    withdraw,
  };
}
