import { IOrderDetailsRes } from '@/features/orders/types/orderTypes';
import { IParsedShippingAddress } from './types';

export function parseShippingAddress(
  rawAddr: string | IOrderDetailsRes['shippingAddress'] | undefined,
): IParsedShippingAddress {
  let shippingAddress: IParsedShippingAddress = {
    recipient: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
  };

  if (!rawAddr) {
    return shippingAddress;
  }

  if (typeof rawAddr === 'string') {
    try {
      const parsed = JSON.parse(rawAddr);
      shippingAddress = {
        recipient: parsed.recipient || '',
        phone: parsed.phone || '',
        address: parsed.addressLine || parsed.address || '',
        ward: parsed.ward || '',
        district: parsed.district || '',
        province: parsed.province || '',
      };
    } catch {
      shippingAddress.address = rawAddr;
    }
  } else {
    shippingAddress = {
      recipient: rawAddr.recipient || '',
      phone: rawAddr.phone || '',
      address: rawAddr.address || '',
      ward: rawAddr.ward || '',
      district: rawAddr.district || '',
      province: rawAddr.province || '',
    };
  }

  return shippingAddress;
}
