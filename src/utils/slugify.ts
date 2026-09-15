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

  return (
    text
      .toString()
      // 1. Loại bỏ các khoảng trắng ẩn, zero-width space, non-breaking space
      .replace(/[\u00A0\u200B\u200C\u200D\u2060\uFEFF\u00AD]/g, ' ')
      // 2. Loại bỏ dấu nháy đơn, dấu nháy cong trong từ
      .replace(/['’`]/g, '')
      // 3. Chuyển về chữ thường
      .toLowerCase()
      .trim()
      // 4. Xử lý ký tự đặc biệt & ligatures không phân rã qua Unicode NFD
      .replace(/[đð]/g, 'd')
      .replace(/[æ]/g, 'ae')
      .replace(/[œ]/g, 'oe')
      .replace(/[ß]/g, 'ss')
      .replace(/[ø]/g, 'o')
      .replace(/[ł]/g, 'l')
      .replace(/[þ]/g, 'th')
      // 5. Chuyển đổi toàn diện nguyên âm tiếng Việt dạng NFC dựng sẵn
      .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
      .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
      .replace(/[iíìỉĩị]/g, 'i')
      .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
      .replace(/[úùủũụưứừửữự]/g, 'u')
      .replace(/[ýỳỷỹỵ]/g, 'y')
      // 6. Chuẩn hóa Unicode NFD và bóc tách toàn bộ dấu thanh/dấu mũ tổ hợp còn sót lại
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // 7. Thay thế khoảng trắng, dấu gạch dưới, dấu gạch chéo thành dấu gạch ngang
      .replace(/[\s_./\\]+/g, '-')
      // 8. Xóa toàn bộ ký tự không thuộc [a-z0-9-]
      .replace(/[^a-z0-9-]/g, '')
      // 9. Gộp nhiều dấu gạch ngang liên tiếp thành 1
      .replace(/-+/g, '-')
      // 10. Cắt bỏ dấu gạch ngang ở 2 đầu
      .replace(/^-+|-+$/g, '')
  );
};
