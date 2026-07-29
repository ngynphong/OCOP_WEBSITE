import { API_ENDPOINTS } from '@/lib/api-endpoints';
import type {
  ProductListResponse,
  PublicProductListParams,
} from '@/features/products/types/productTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildQueryString(params?: PublicProductListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function getPublicProductsServer(
  params?: PublicProductListParams,
): Promise<ProductListResponse | null> {
  if (!API_BASE_URL) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PUBLIC.PRODUCTS}${buildQueryString(params)}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) return null;

    return (await response.json()) as ProductListResponse;
  } catch (error) {
    console.error('Failed to fetch public products:', error);
    return null;
  }
}
