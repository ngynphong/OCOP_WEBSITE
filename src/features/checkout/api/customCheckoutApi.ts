import { publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export interface CustomCheckoutInfo {
  quotationId: string;
  checkoutToken: string;
  productName: string;
  variantName: string | null;
  productImage: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  totalAmount: number;
  shopId: number;
  shopName: string;
  validUntil: string;
}

export const customCheckoutApi = {
  getCheckoutInfo: (token: string): Promise<{ code: number; data: CustomCheckoutInfo }> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.CHECKOUT.CUSTOM}/${token}`);
  },
};
