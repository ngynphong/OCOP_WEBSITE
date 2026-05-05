import React from 'react';
import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/layout/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | IES Connect OCOP',
  description:
    'Chính sách bảo mật thông tin cá nhân của người dùng tại sàn thương mại điện tử OCOP.',
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout title="Chính sách bảo mật" lastUpdated="05/05/2026">
      <section>
        <h2>1. Giới thiệu</h2>
        <p>
          Chào mừng bạn đến với <strong>IES Connect OCOP</strong>. Chúng tôi coi trọng sự riêng tư
          của bạn và cam kết bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật này giải thích
          cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi bạn sử dụng dịch vụ của
          chúng tôi.
        </p>
      </section>

      <section>
        <h2>2. Thông tin chúng tôi thu thập</h2>
        <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
        <ul>
          <li>
            <strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ nhận
            hàng khi bạn đăng ký tài khoản hoặc đặt hàng.
          </li>
          <li>
            <strong>Thông tin thanh toán:</strong> Chi tiết thanh toán cần thiết để xử lý giao dịch
            (chúng tôi không lưu trữ thông tin thẻ tín dụng đầy đủ).
          </li>
          <li>
            <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành và dữ liệu
            về cách bạn tương tác với website thông qua cookies.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Mục đích sử dụng thông tin</h2>
        <p>Chúng tôi sử dụng thông tin của bạn để:</p>
        <ul>
          <li>Xử lý và giao đơn hàng của bạn.</li>
          <li>Cung cấp hỗ trợ khách hàng và giải quyết các khiếu nại.</li>
          <li>Gửi thông tin cập nhật về đơn hàng, tin tức khuyến mãi (nếu bạn đồng ý).</li>
          <li>Cải thiện trải nghiệm người dùng trên website.</li>
          <li>Đảm bảo an ninh và ngăn chặn các hành vi gian lận.</li>
        </ul>
      </section>

      <section>
        <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
        <p>
          Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông
          tin với:
        </p>
        <ul>
          <li>
            <strong>Đối tác vận chuyển:</strong> Để giao hàng đến địa chỉ của bạn.
          </li>
          <li>
            <strong>Đơn vị thanh toán:</strong> Để xử lý các giao dịch tài chính an toàn.
          </li>
          <li>
            <strong>Cơ quan pháp luật:</strong> Khi có yêu cầu hợp pháp theo quy định của pháp luật
            Việt Nam.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Bảo mật thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức tiên tiến (như mã hóa SSL) để bảo vệ
          dữ liệu của bạn khỏi bị truy cập trái phép, mất mát hoặc phá hủy. Tuy nhiên, không có
          phương thức truyền tin qua internet nào là an toàn 100%, vì vậy chúng tôi mong bạn cũng tự
          bảo quản mật khẩu tài khoản của mình.
        </p>
      </section>

      <section>
        <h2>6. Quyền của người dùng</h2>
        <p>Bạn có quyền:</p>
        <ul>
          <li>Truy cập và chỉnh sửa thông tin cá nhân của mình bất kỳ lúc nào.</li>
          <li>Yêu cầu xóa tài khoản hoặc dữ liệu cá nhân.</li>
          <li>Từ chối nhận các thông báo tiếp thị.</li>
        </ul>
      </section>

      <section>
        <h2>7. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ với chúng tôi qua email:{' '}
          <strong>infovienies@gmail.com</strong> hoặc hotline: <strong>+84 96 524 8115</strong>.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
