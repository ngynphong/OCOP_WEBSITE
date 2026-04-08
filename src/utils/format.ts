const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

/**
 * @param amount - Giá trị tiền tệ (hỗ trợ cả string và number)
 * @returns Chuỗi tiền tệ đã format (VD: "1.000.000 ₫")
 */
export const formatCurrencyVND = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') {
    return '0 ₫';
  }

  const parsedAmount = Number(amount);

  if (Number.isNaN(parsedAmount)) {
    return '0 ₫';
  }

  return vndFormatter.format(parsedAmount);
};

export const formatVNDInput = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '';
  const num =
    typeof amount === 'number' ? amount : parseInt(amount.toString().replace(/\D/g, ''), 10);
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseVNDInput = (formattedValue: string): number => {
  const num = parseInt(formattedValue.replace(/\D/g, ''), 10);
  return isNaN(num) ? 0 : num;
};
