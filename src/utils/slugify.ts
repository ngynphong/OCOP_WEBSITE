/**
 * Utility chuyển đổi chuỗi văn bản thành Slug chuẩn SEO (hỗ trợ toàn diện tiếng Việt và các ký tự đặc biệt).
 * Xử lý triệt để:
 * 1. Tiếng Việt có dấu (cả bảng mã NFC dựng sẵn và NFD tổ hợp).
 * 2. Ký tự nét gạch: đ, Đ, ð, Ð -> d.
 * 3. Ký tự ghép Latin: æ, Æ -> ae; œ, Œ -> oe; ß -> ss; ø, Ø -> o; ł, Ł -> l; þ, Þ -> th.
 * 4. Dấu nháy đơn, nháy kép, khoảng trắng ẩn (NBSP \u00A0, zero-width space).
 * 5. Chuẩn hóa dấu gạch ngang, loại bỏ trùng lặp và cắt 2 đầu.
 */
export const slugify = (text: string): string => {
  if (!text) return '';

  return text
    .toString()
    .replace(/[\u00A0\u200B\u200C\u200D\u2060\uFEFF\u00AD]/g, ' ')
    .replace(/['’`]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[đð]/g, 'd')
    .replace(/[æ]/g, 'ae')
    .replace(/[œ]/g, 'oe')
    .replace(/[ß]/g, 'ss')
    .replace(/[ø]/g, 'o')
    .replace(/[ł]/g, 'l')
    .replace(/[þ]/g, 'th')
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[iíìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_./\\]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};
