import { LocationImportSection } from '@/features/admin/components/LocationImportSection';

export default function LocationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-3">
          Cài đặt Địa giới hành chính
        </h2>
        <p className="text-stone-500 text-sm font-medium">
          Cập nhật danh sách Tỉnh/Thành phố, Quận/Huyện và Phường/Xã cho hệ thống OCOP.
        </p>
      </div>

      <LocationImportSection />

      <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
        <h4 className="text-amber-800 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>⚠️</span> Lưu ý quan trọng
        </h4>
        <ul className="text-amber-700 text-xs font-medium space-y-2 list-disc pl-4">
          <li>
            File JSON phải tuân thủ đúng cấu trúc phân cấp: Province {'>'} District {'>'} Ward.
          </li>
          <li>Các mã (ID) đã tồn tại trong hệ thống sẽ được bỏ qua để tránh trùng lặp dữ liệu.</li>
          <li>Quá trình nhập dữ liệu có thể mất vài phút nếu file có dung lượng lớn.</li>
        </ul>
      </div>
    </div>
  );
}
