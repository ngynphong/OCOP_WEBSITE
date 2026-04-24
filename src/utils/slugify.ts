export const slugify = (text: string): string => {
  if (!text) return '';

  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // Thay thế các ký tự có dấu tiếng Việt
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      // Xóa các ký tự đặc biệt
      .replace(/[^a-z0-9 -]/g, '')
      // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/\s+/g, '-')
      // Gộp nhiều dấu gạch ngang liên tiếp thành 1
      .replace(/-+/g, '-')
      // Cắt bỏ dấu gạch ngang ở 2 đầu
      .replace(/^-+|-+$/g, '')
  );
};
