import React from 'react';
import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/layout/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ | IES Connect OCOP',
  description: 'Các quy định và điều khoản khi sử dụng dịch vụ trên sàn thương mại điện tử OCOP.',
};

export default function TermsOfServicePage() {
  return (
    <PolicyPageLayout title="Điều khoản dịch vụ" lastUpdated="05/05/2026">
      <section>
        <h2>1. Chấp nhận điều khoản</h2>
        <p>
          Bằng việc truy cập và sử dụng website <strong>IES Connect OCOP</strong>, bạn đồng ý tuân
          thủ và bị ràng buộc bởi các điều khoản và điều kiện dưới đây. Nếu bạn không đồng ý với bất
          kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
        </p>
      </section>

      <section>
        <h2>2. Tài khoản người dùng</h2>
        <ul>
          <li>Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản.</li>
          <li>Bạn có trách nhiệm bảo mật mật khẩu và tài khoản của mình.</li>
          <li>Mọi hoạt động diễn ra dưới tài khoản của bạn sẽ thuộc trách nhiệm của bạn.</li>
        </ul>
      </section>

      <section>
        <h2>3. Quy định về nội dung</h2>
        <p>
          Tất cả nội dung trên website bao gồm hình ảnh, logo, văn bản, thiết kế là tài sản trí tuệ
          của IES Connect OCOP hoặc các nhà cung cấp. Bạn không được phép sao chép, phân phối hoặc
          sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.
        </p>
      </section>

      <section>
        <h2>4. Đặt hàng và Thanh toán</h2>
        <p>
          Giá cả sản phẩm được niêm yết trên website và có thể thay đổi mà không báo trước. Chúng
          tôi có quyền từ chối hoặc hủy bất kỳ đơn hàng nào vì lý do sai sót giá cả, hết hàng hoặc
          nghi ngờ gian lận.
        </p>
      </section>

      <section>
        <h2>5. Giới hạn trách nhiệm</h2>
        <p>
          IES Connect OCOP nỗ lực đảm bảo thông tin trên website là chính xác nhất có thể. Tuy
          nhiên, chúng tôi không bảo đảm rằng mọi mô tả sản phẩm hoặc nội dung khác là hoàn toàn
          không có sai sót. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hoặc
          gián tiếp nào phát sinh từ việc sử dụng website.
        </p>
      </section>

      <section>
        <h2>6. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có quyền cập nhật hoặc thay đổi các điều khoản này bất kỳ lúc nào mà không cần
          thông báo trước. Việc bạn tiếp tục sử dụng website sau khi các thay đổi được đăng tải đồng
          nghĩa với việc bạn chấp nhận các thay đổi đó.
        </p>
      </section>

      <section>
        <h2>7. Luật áp dụng</h2>
        <p>
          Các điều khoản này được điều chỉnh và giải thích theo quy định của pháp luật nước Cộng hòa
          Xã hội Chủ nghĩa Việt Nam.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
