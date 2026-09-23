import { Product } from '@/features/products/types/productTypes';

export interface FilterState {
  searchQuery: string;
  selectedCategoryIds: number[];
  selectedStar: number | undefined;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

export interface FilterHandlers {
  setSearchQuery: (val: string) => void;
  setSelectedCategoryIds: (val: number[]) => void;
  setSelectedStar: (val: number | undefined) => void;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  onResetFilters: () => void;
  onRemoveCategory: (id: number) => void;
  onRemoveStar: () => void;
  onRemovePrice: () => void;
  onRemoveSearch: () => void;
}

export interface ProductCardData {
  product: Product;
  isWishlisted: boolean;
}
