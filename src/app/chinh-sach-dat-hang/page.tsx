import React from 'react';
import { Metadata } from 'next';
import { PolicyPageLayout } from '@/components/layout/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Chính sách đặt hàng | IES Connect OCOP',
  description: 'Hướng dẫn quy trình đặt hàng, thanh toán, vận chuyển và đổi trả tại sàn OCOP.',
};

export default function OrderingPolicyPage() {
  return (
    <PolicyPageLayout title="Chính sách đặt hàng" lastUpdated="05/05/2026">
      <section>
        <h2>1. Quy trình đặt hàng</h2>
        <p>Để đặt hàng trên sàn OCOP, quý khách vui lòng thực hiện các bước sau:</p>
        <ol>
          <li>Chọn sản phẩm yêu thích và thêm vào giỏ hàng.</li>
          <li>Kiểm tra giỏ hàng và nhập thông tin giao hàng chính xác.</li>
          <li>Chọn phương thức thanh toán phù hợp.</li>
          <li>Xác nhận đơn hàng.</li>
        </ol>
        <p>
          Sau khi đặt hàng thành công, quý khách sẽ nhận được email xác nhận và thông báo qua hệ
          thống.
        </p>
      </section>

      <section>
        <h2>2. Phương thức thanh toán</h2>
        <p>Chúng tôi hỗ trợ các phương thức thanh toán linh hoạt:</p>
        <ul>
          <li>
            <strong>Thanh toán khi nhận hàng (COD):</strong> Quý khách thanh toán tiền mặt cho nhân
            viên giao hàng.
          </li>
          <li>
            <strong>Chuyển khoản ngân hàng:</strong> Thông tin tài khoản sẽ được hiển thị khi quý
            khách chọn phương thức này.
          </li>
          <li>
            <strong>Ví điện tử & Thẻ nội địa:</strong> Thông qua cổng thanh toán tích hợp an toàn.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Chính sách vận chuyển</h2>
        <ul>
          <li>
            <strong>Thời gian xử lý:</strong> Đơn hàng sẽ được xác nhận và xử lý trong vòng 24h làm
            việc.
          </li>
          <li>
            <strong>Thời gian giao hàng:</strong> Từ 2-5 ngày làm việc tùy vào khu vực địa lý (vùng
            sâu vùng xa có thể lâu hơn).
          </li>
          <li>
            <strong>Phí vận chuyển:</strong> Được tính toán tự động dựa trên trọng lượng và khoảng
            cách địa lý.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Chính sách đổi trả và hoàn tiền</h2>
        <p>Chúng tôi cam kết chất lượng sản phẩm OCOP. Tuy nhiên, nếu có sự cố xảy ra:</p>
        <ul>
          <li>
            <strong>Điều kiện đổi trả:</strong> Sản phẩm bị lỗi do nhà sản xuất, hư hỏng trong quá
            trình vận chuyển hoặc giao sai sản phẩm.
          </li>
          <li>
            <strong>Thời gian:</strong> Quý khách vui lòng phản hồi trong vòng 48h kể từ khi nhận
            hàng.
          </li>
          <li>
            <strong>Quy trình:</strong> Liên hệ hotline để được hướng dẫn gửi trả hàng. Sau khi kiểm
            tra, chúng tôi sẽ tiến hành đổi sản phẩm mới hoặc hoàn tiền trong vòng 7 ngày làm việc.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Kiểm tra hàng hóa</h2>
        <p>
          Quý khách có quyền đồng kiểm (kiểm tra hàng cùng nhân viên giao hàng) để đảm bảo hàng đúng
          mẫu mã, số lượng và không bị hư hỏng bên ngoài trước khi thanh toán.
        </p>
      </section>

      <section>
        <h2>6. Hỗ trợ khách hàng</h2>
        <p>
          Mọi thắc mắc về đơn hàng, quý khách vui lòng liên hệ bộ phận chăm sóc khách hàng của chúng
          tôi để được hỗ trợ nhanh nhất.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
