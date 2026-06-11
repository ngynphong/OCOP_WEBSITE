# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-flow.spec.ts >> End-to-End Full Flow with Real Accounts >> User Full Flow: Login and check Profile/Orders
- Location: tests\e2e\full-flow.spec.ts:5:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:3000/"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
        - img [ref=e8]
    - alert [ref=e11]: Trang chủ | Sàn OCOP
    - generic [ref=e12]:
        - generic:
            - generic:
                - generic:
                    - generic:
                        - img "Event Background"
        - banner [ref=e13]:
            - generic [ref=e15]: Kết nối tinh hoa nông sản Việt | OCOP chính hãng – Giao hàng toàn quốc
            - generic [ref=e17]:
                - generic [ref=e18]:
                    - link "OCOP IES CONNECT" [ref=e19] [cursor=pointer]:
                        - /url: /
                        - img "OCOP IES CONNECT" [ref=e20]
                    - navigation [ref=e21]:
                        - link "Trang Chủ" [ref=e22] [cursor=pointer]:
                            - /url: /
                            - generic [ref=e23]: Trang Chủ
                        - link "Sản Phẩm" [ref=e24] [cursor=pointer]:
                            - /url: /san-pham
                            - generic [ref=e25]: Sản Phẩm
                        - link "Vùng Miền" [ref=e26] [cursor=pointer]:
                            - /url: /vung-mien
                            - generic [ref=e27]: Vùng Miền
                        - link "Câu Chuyện" [ref=e28] [cursor=pointer]:
                            - /url: /cau-chuyen
                            - generic [ref=e29]: Câu Chuyện
                        - link "Bài Viết" [ref=e30] [cursor=pointer]:
                            - /url: /bai-viet
                            - generic [ref=e31]: Bài Viết
                - generic [ref=e34]:
                    - img [ref=e35]
                    - textbox "Tìm kiếm sản phẩm..." [ref=e38]
                - generic [ref=e39]:
                    - button [ref=e41] [cursor=pointer]:
                        - img [ref=e43]
                        - img [ref=e46]
                    - button "Quét mã QR" [ref=e48] [cursor=pointer]:
                        - img [ref=e49]
                    - button "Thông báo (7 chưa đọc)" [ref=e54] [cursor=pointer]:
                        - img [ref=e55]
                        - generic [ref=e58]: '7'
                    - link "Giỏ hàng (2 sản phẩm)" [ref=e59] [cursor=pointer]:
                        - /url: /gio-hang
                        - img [ref=e60]
                        - generic [ref=e64]: '2'
        - main [ref=e65]:
            - generic [ref=e66]:
                - generic [ref=e67]:
                    - generic:
                        - generic:
                            - generic:
                                - img
                        - generic:
                            - generic:
                                - img
                        - generic:
                            - generic:
                                - img
                        - generic:
                            - generic:
                                - img
                        - generic:
                            - generic:
                                - img
                        - generic:
                            - generic:
                                - img
                    - generic [ref=e68]:
                        - generic [ref=e69]:
                            - generic [ref=e70]:
                                - img [ref=e71]
                                - generic [ref=e74]: Nền tảng TMĐT OCOP Việt Nam
                            - heading "OCOP IES Connect" [level=1] [ref=e75]:
                                - text: OCOP
                                - text: IES Connect
                            - paragraph [ref=e76]:
                                - text: Kết nối nông dân • Nghệ nhân • Người tiêu dùng
                                - text: Truy xuất nguồn gốc qua QR
                            - generic [ref=e77]:
                                - generic [ref=e78]:
                                    - img [ref=e80]
                                    - generic [ref=e84]:
                                        - paragraph [ref=e85]: 12K+
                                        - paragraph [ref=e86]: Sản phẩm OCOP
                                - generic [ref=e87]:
                                    - img [ref=e89]
                                    - generic [ref=e93]:
                                        - paragraph [ref=e94]: 3.400+
                                        - paragraph [ref=e95]: Cửa hàng
                                - generic [ref=e96]:
                                    - img [ref=e98]
                                    - generic [ref=e100]:
                                        - paragraph [ref=e101]: '63'
                                        - paragraph [ref=e102]: Tỉnh thành
                                - generic [ref=e103]:
                                    - img [ref=e105]
                                    - generic [ref=e111]:
                                        - paragraph [ref=e112]: QR
                                        - paragraph [ref=e113]: Truy xuất
                        - generic [ref=e114]:
                            - generic [ref=e115]:
                                - generic [ref=e116] [cursor=pointer]:
                                    - generic [ref=e117]:
                                        - generic [ref=e118]: OCOP
                                        - generic [ref=e119]:
                                            - text: '4'
                                            - img [ref=e120]
                                    - img "Trà San Tuyết" [ref=e123]
                                - generic [ref=e124]:
                                    - heading "Trà San Tuyết" [level=3] [ref=e125]
                                    - paragraph [ref=e126]: Trà San Tuyết
                                    - generic [ref=e128]:
                                        - img [ref=e129]
                                        - img [ref=e131]
                                        - img [ref=e133]
                                        - img [ref=e135]
                                        - img [ref=e137]
                                        - generic [ref=e139]: '5.0'
                                    - generic [ref=e141]: 200.000₫
                                    - generic [ref=e142]:
                                        - button "Mua ngay" [ref=e143] [cursor=pointer]:
                                            - img [ref=e144]
                                            - text: Mua ngay
                                        - button "Yêu thích" [ref=e148] [cursor=pointer]:
                                            - img [ref=e149]
                                            - generic [ref=e151]: Yêu thích
                            - button "Go to slide 1" [ref=e153] [cursor=pointer]
                - generic [ref=e154]:
                    - generic [ref=e155]:
                        - generic [ref=e156]:
                            - heading "Bán chạy nhất" [level=2] [ref=e157]
                            - generic [ref=e158]:
                                - button [ref=e159]:
                                    - img [ref=e160]
                                - button [ref=e162]:
                                    - img [ref=e163]
                        - link "Trà San Tuyết Thêm vào yêu thích Trà San Tuyết 5.0 Trà San Tuyết Việt Nam 200.000₫" [ref=e166] [cursor=pointer]:
                            - /url: /san-pham/tra-san-tuyet
                            - generic [ref=e167]:
                                - generic [ref=e168]:
                                    - img "Trà San Tuyết" [ref=e169]
                                    - button "Thêm vào yêu thích" [ref=e171]:
                                        - img [ref=e172]
                                - generic [ref=e174]:
                                    - generic [ref=e175]:
                                        - heading "Trà San Tuyết" [level=3] [ref=e176]
                                        - generic [ref=e177]:
                                            - img [ref=e178]
                                            - generic [ref=e180]: '5.0'
                                    - generic [ref=e181]:
                                        - generic [ref=e182]: Trà San Tuyết
                                        - generic [ref=e184]: Việt Nam
                                    - generic [ref=e187]: 200.000₫
                    - generic [ref=e189]:
                        - img "Flash Sale - Trà San Tuyết" [ref=e191]
                        - generic [ref=e193]:
                            - generic [ref=e194]:
                                - generic [ref=e195]:
                                    - generic [ref=e196]:
                                        - img [ref=e198]
                                        - heading "GIÁ HỜI MỖI NGÀY" [level=2] [ref=e200]
                                    - generic [ref=e201]:
                                        - generic [ref=e202]: Kết thúc sau
                                        - generic [ref=e204]:
                                            - generic [ref=e205]:
                                                - generic [ref=e206]: '2'
                                                - generic [ref=e207]: Ngày
                                            - generic [ref=e208]: ':'
                                            - generic [ref=e209]:
                                                - generic [ref=e210]: '11'
                                                - generic [ref=e211]: Giờ
                                            - generic [ref=e212]: ':'
                                            - generic [ref=e213]:
                                                - generic [ref=e214]: '26'
                                                - generic [ref=e215]: Phút
                                            - generic [ref=e216]: ':'
                                            - generic [ref=e217]:
                                                - generic [ref=e218]: '26'
                                                - generic [ref=e219]: Giây
                                - link "Xem tất cả" [ref=e220] [cursor=pointer]:
                                    - /url: /flash-sale
                                    - generic [ref=e221]: Xem tất cả
                                    - img [ref=e222]
                            - link "Trà San Tuyết -20% OCOP 4⭐ Trà San Tuyết 160.000đ 200.000đ Đã bán 7%" [ref=e227] [cursor=pointer]:
                                - /url: /san-pham/tra-san-tuyet
                                - generic [ref=e228]:
                                    - img "Trà San Tuyết" [ref=e229]
                                    - generic [ref=e230]:
                                        - generic [ref=e231]:
                                            - generic [ref=e232]: '-20%'
                                            - generic [ref=e233]:
                                                - img [ref=e234]
                                                - text: OCOP 4⭐
                                        - button [ref=e236]:
                                            - img [ref=e237]
                                - generic [ref=e239]:
                                    - heading "Trà San Tuyết" [level=3] [ref=e241]
                                    - generic [ref=e242]:
                                        - generic [ref=e243]:
                                            - generic [ref=e244]: 160.000đ
                                            - generic [ref=e245]: 200.000đ
                                        - generic [ref=e249]: Đã bán 7%
                    - generic [ref=e251]:
                        - generic [ref=e252]:
                            - img [ref=e254]
                            - generic [ref=e257]:
                                - heading "100% Chính hãng" [level=3] [ref=e259]
                                - paragraph [ref=e260]: Kiểm định OCOP 3-5 sao
                        - generic [ref=e261] [cursor=pointer]:
                            - img [ref=e263]
                            - generic [ref=e268]:
                                - generic [ref=e269]:
                                    - heading "7 ngày đổi trả" [level=3] [ref=e270]
                                    - generic [ref=e271]:
                                        - img [ref=e272]
                                        - generic: Không áp dụng cho hàng tươi sống
                                - paragraph [ref=e274]: Theo chính sách đổi trả
                        - generic [ref=e275]:
                            - img [ref=e277]
                            - generic [ref=e280]:
                                - heading "Thanh toán an toàn" [level=3] [ref=e282]
                                - paragraph [ref=e283]: Đa dạng phương thức thanh toán
                    - generic [ref=e284]:
                        - heading "Danh mục nổi bật" [level=2] [ref=e286]
                        - link "Trà Trà" [ref=e288] [cursor=pointer]:
                            - /url: /danh-muc/tra
                            - img "Trà" [ref=e291]
                            - heading "Trà" [level=3] [ref=e292]
                    - generic [ref=e294]:
                        - generic [ref=e295]:
                            - generic [ref=e297]:
                                - img [ref=e298]
                                - generic [ref=e301]: OCOP MALL
                            - link "Xem thêm" [ref=e302] [cursor=pointer]:
                                - /url: /shops
                                - text: Xem thêm
                                - img [ref=e303]
                        - generic [ref=e306]:
                            - generic [ref=e309]:
                                - img [ref=e310]
                                - generic [ref=e312]: 0.0 (0)
                            - generic [ref=e313]:
                                - img "Trà San Tuyết" [ref=e316]
                                - generic [ref=e317]:
                                    - heading "Trà San Tuyết" [level=3] [ref=e318]
                                    - generic [ref=e319]:
                                        - generic [ref=e320]: OCOP 4★
                                        - generic [ref=e321]: Thành phố Lạng Sơn, Tỉnh Lạng Sơn
                                - paragraph [ref=e323]: '"trà san tuyết đặc sản trà việt"'
                                - generic [ref=e324]:
                                    - generic [ref=e325]:
                                        - generic [ref=e326]:
                                            - img "Product" [ref=e328]
                                            - img "Product" [ref=e330]
                                            - img "Product" [ref=e332]
                                        - generic [ref=e333]: +4 SP
                                    - link "Vào shop" [ref=e334] [cursor=pointer]:
                                        - /url: /cua-hang/1
                                        - img [ref=e335]
                                        - text: Vào shop
                    - generic [ref=e340]:
                        - generic [ref=e341]:
                            - heading "Trà" [level=2] [ref=e343]
                            - link "Xem tất cả" [ref=e345] [cursor=pointer]:
                                - /url: /danh-muc/tra
                                - text: Xem tất cả
                                - img [ref=e346]
                        - link "Trà San Tuyết Thêm vào yêu thích Trà San Tuyết 5.0 Trà San Tuyết Việt Nam 200.000₫" [ref=e349] [cursor=pointer]:
                            - /url: /san-pham/tra-san-tuyet
                            - generic [ref=e350]:
                                - generic [ref=e351]:
                                    - img "Trà San Tuyết" [ref=e352]
                                    - button "Thêm vào yêu thích" [ref=e354]:
                                        - img [ref=e355]
                                - generic [ref=e357]:
                                    - generic [ref=e358]:
                                        - heading "Trà San Tuyết" [level=3] [ref=e359]
                                        - generic [ref=e360]:
                                            - img [ref=e361]
                                            - generic [ref=e363]: '5.0'
                                    - generic [ref=e364]:
                                        - generic [ref=e365]: Trà San Tuyết
                                        - generic [ref=e367]: Việt Nam
                                    - generic [ref=e370]: 200.000₫
                    - generic [ref=e371]:
                        - generic [ref=e373]:
                            - generic [ref=e374]:
                                - heading "GỢI Ý HÔM NAY" [level=2] [ref=e376]
                                - generic [ref=e377]:
                                    - generic [ref=e378]: 'Sắp xếp:'
                                    - button "Mới nhất" [ref=e379] [cursor=pointer]
                                    - button "Bán chạy" [ref=e380] [cursor=pointer]
                                    - button "Đánh giá cao" [ref=e381] [cursor=pointer]
                                    - button "Giá thấp" [ref=e382] [cursor=pointer]
                                    - button "Giá cao" [ref=e383] [cursor=pointer]
                            - generic [ref=e384]:
                                - button "Tất cả" [ref=e385] [cursor=pointer]
                                - button "Trà" [ref=e386] [cursor=pointer]
                        - link "Trà San Tuyết Thêm vào yêu thích Trà San Tuyết 5.0 Trà San Tuyết Việt Nam 200.000₫" [ref=e388] [cursor=pointer]:
                            - /url: /san-pham/tra-san-tuyet
                            - generic [ref=e389]:
                                - generic [ref=e390]:
                                    - img "Trà San Tuyết" [ref=e391]
                                    - button "Thêm vào yêu thích" [ref=e393]:
                                        - img [ref=e394]
                                - generic [ref=e396]:
                                    - generic [ref=e397]:
                                        - heading "Trà San Tuyết" [level=3] [ref=e398]
                                        - generic [ref=e399]:
                                            - img [ref=e400]
                                            - generic [ref=e402]: '5.0'
                                    - generic [ref=e403]:
                                        - generic [ref=e404]: Trà San Tuyết
                                        - generic [ref=e406]: Việt Nam
                                    - generic [ref=e409]: 200.000₫
            - generic [ref=e410]:
                - generic [ref=e412]:
                    - generic [ref=e413]:
                        - heading "Đánh giá từ cộng đồng" [level=2] [ref=e414]
                        - paragraph [ref=e415]: Sự hài lòng của khách hàng là minh chứng lớn nhất cho giá trị của nông sản Việt thực thụ.
                    - generic [ref=e416]:
                        - generic [ref=e417]:
                            - img [ref=e418]
                            - generic [ref=e421]:
                                - img [ref=e422]
                                - img [ref=e424]
                                - img [ref=e426]
                                - img [ref=e428]
                                - img [ref=e430]
                            - paragraph [ref=e432]: '"Tôi rất ấn tượng với chất lượng hạt sen sấy. Sản phẩm được đóng gói rất đẹp, rất hợp làm quà tặng. Giao hàng cực nhanh!"'
                            - generic [ref=e433]:
                                - img "Minh Thư" [ref=e435]
                                - generic [ref=e436]:
                                    - heading "Minh Thư" [level=4] [ref=e437]
                                    - generic [ref=e438]: TP. Hồ Chí Minh
                        - generic [ref=e439]:
                            - img [ref=e440]
                            - generic [ref=e443]:
                                - img [ref=e444]
                                - img [ref=e446]
                                - img [ref=e448]
                                - img [ref=e450]
                                - img [ref=e452]
                            - paragraph [ref=e454]: '"OCOP Market là nơi duy nhất tôi tin tưởng khi mua đặc sản Tây Bắc. Nước mắm chuẩn vị truyền thống, đậm đà không hóa chất."'
                            - generic [ref=e455]:
                                - img "Hoàng Nam" [ref=e457]
                                - generic [ref=e458]:
                                    - heading "Hoàng Nam" [level=4] [ref=e459]
                                    - generic [ref=e460]: Hà Nội
                        - generic [ref=e461]:
                            - img [ref=e462]
                            - generic [ref=e465]:
                                - img [ref=e466]
                                - img [ref=e468]
                                - img [ref=e470]
                                - img [ref=e472]
                                - img [ref=e474]
                            - paragraph [ref=e476]: '"Mua hàng ở đây không chỉ là mua sắm, mà còn là ủng hộ những người nông dân tâm huyết. Giá cả rất hợp lý so với chất lượng OCOP."'
                            - generic [ref=e477]:
                                - img "Lan Anh" [ref=e479]
                                - generic [ref=e480]:
                                    - heading "Lan Anh" [level=4] [ref=e481]
                                    - generic [ref=e482]: Đà Nẵng
                - generic [ref=e484]:
                    - generic [ref=e487]:
                        - heading "Truy xuất nguồn gốc trong nháy mắt" [level=2] [ref=e488]:
                            - generic [ref=e489]: Truy xuất nguồn gốc
                            - text: trong nháy mắt
                        - paragraph [ref=e490]: Mỗi sản phẩm tại OCOP Market đều được gắn mã QR duy nhất. Chỉ cần một lần quét, bạn sẽ biết rõ hành trình từ trang trại đến tay bạn, thông tin hộ nông dân và các chứng chỉ kiểm định.
                        - generic [ref=e491]:
                            - generic [ref=e492]:
                                - generic [ref=e493]: 100%
                                - generic [ref=e494]: Minh Bạch
                            - generic [ref=e495]:
                                - generic [ref=e496]: Real-time
                                - generic [ref=e497]: Theo dõi
                            - generic [ref=e498]:
                                - generic [ref=e499]: Global
                                - generic [ref=e500]: Tiêu chuẩn
                    - generic [ref=e504]:
                        - img [ref=e505]
                        - img [ref=e519]
                - generic [ref=e530]:
                    - generic [ref=e531]:
                        - generic [ref=e532]: Đặc quyền OCOP
                        - heading "Đăng ký bản tin, Nhận ngàn ưu đãi." [level=2] [ref=e533]:
                            - text: Đăng ký bản tin,
                            - text: Nhận ngàn ưu đãi.
                        - paragraph [ref=e534]: Trở thành người đầu tiên nhận thông tin về sản phẩm OCOP mới nhất, các chương trình khuyến mãi độc quyền và câu chuyện từ vùng nguyên liệu.
                    - generic [ref=e536]:
                        - generic [ref=e537]:
                            - img [ref=e539]
                            - textbox "Sử dụng email tài khoản của bạn" [disabled] [ref=e542]
                        - button "Đăng ký ngay" [ref=e543] [cursor=pointer]:
                            - text: Đăng ký ngay
                            - img [ref=e544]
                        - paragraph [ref=e547]: '* Bằng cách đăng ký, bạn đồng ý với chính sách bảo mật của chúng tôi.'
        - generic [ref=e548]:
            - generic [ref=e549]:
                - button [ref=e550]:
                    - img [ref=e551]
                - paragraph [ref=e554]: Cần hỗ trợ hoặc Khiếu nại?
            - generic [ref=e555]:
                - button "Gửi khiếu nại" [ref=e556] [cursor=pointer]:
                    - img [ref=e557]
                - button "Ẩn nút" [ref=e559] [cursor=pointer]:
                    - img [ref=e560]
        - contentinfo [ref=e563]:
            - generic [ref=e564]:
                - generic [ref=e565]:
                    - generic [ref=e567]: OCOP IES Connect
                    - generic [ref=e569]:
                        - text: Kết nối tinh hoa nông sản Việt từ khắp mọi
                        - text: miền đất nước đến bàn ăn của mỗi gia
                        - text: đình.
                    - generic [ref=e570]:
                        - link [ref=e571] [cursor=pointer]:
                            - /url: '#'
                            - img [ref=e572]
                        - link [ref=e575] [cursor=pointer]:
                            - /url: '#'
                            - img [ref=e576]
                        - link [ref=e578] [cursor=pointer]:
                            - /url: '#'
                            - img [ref=e579]
                - generic [ref=e581]:
                    - generic [ref=e583]: Sản phẩm
                    - link "Trà" [ref=e585] [cursor=pointer]:
                        - /url: /danh-muc/tra
                - generic [ref=e586]:
                    - generic [ref=e588]: Hỗ trợ
                    - generic [ref=e589]:
                        - link "Liên hệ chúng tôi" [ref=e590] [cursor=pointer]:
                            - /url: '#'
                        - link "Chính sách bảo mật" [ref=e591] [cursor=pointer]:
                            - /url: /chinh-sach-bao-mat
                        - link "Chính sách đặt hàng" [ref=e592] [cursor=pointer]:
                            - /url: /chinh-sach-dat-hang
                        - link "Điều khoản dịch vụ" [ref=e593] [cursor=pointer]:
                            - /url: /dieu-khoan-dich-vu
                        - link "Trung tâm trợ giúp" [ref=e594] [cursor=pointer]:
                            - /url: /ho-tro
                - generic [ref=e595]:
                    - heading "Liên hệ" [level=3] [ref=e597]
                    - generic [ref=e598]:
                        - generic [ref=e599]:
                            - img [ref=e600]
                            - generic [ref=e603]: Số 3 Công Trường Quốc Tế , Phường Xuân Hoà, Thành phố Hồ Chí Minh.
                        - generic [ref=e604]:
                            - img [ref=e605]
                            - generic [ref=e607]: +84 96 524 8115
                        - generic [ref=e608]:
                            - img [ref=e609]
                            - generic [ref=e612]: infovienies@gmail.com
            - link "DMCA.com Protection Status" [ref=e614] [cursor=pointer]:
                - /url: https://www.dmca.com/r/9e5z4w8
                - img "DMCA.com Protection Status" [ref=e615]
            - generic [ref=e617]: © 2026 OCOP IES Connect
    - generic [ref=e618]:
        - img [ref=e620]
        - button "Open Tanstack query devtools" [ref=e668] [cursor=pointer]:
            - img [ref=e669]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('End-to-End Full Flow with Real Accounts', () => {
  4  |
  5  |   test('User Full Flow: Login and check Profile/Orders', async ({ page }) => {
  6  |     // 1. Login
  7  |     await page.goto('/dang-nhap');
  8  |     await page.fill('input[name="identity"]', 'nguyenthanhphong3778@gmail.com');
  9  |     await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  10 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  11 |     await page.fill('input[name="password"]', 'phong123');
  12 |     await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();
  13 |
  14 |     // Wait for redirect to dashboard
> 15 |     await page.waitForURL(/.*dashboard.*/);
     |                ^ Error: page.waitForURL: Test timeout of 120000ms exceeded.
  16 |     await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
  17 |
  18 |     // 2. Navigate to Profile (Hồ sơ)
  19 |     await page.goto('/dashboard/ho-so');
  20 |     await expect(page.locator('text=Hồ sơ cá nhân').first()).toBeVisible();
  21 |
  22 |     // 3. Navigate to Orders (Đơn hàng)
  23 |     await page.goto('/dashboard/don-hang');
  24 |     await expect(page.locator('text=Đơn hàng').first()).toBeVisible();
  25 |
  26 |     // 4. Navigate to Cart (Giỏ hàng)
  27 |     await page.goto('/gio-hang');
  28 |     await expect(page.locator('text=Giỏ hàng').first()).toBeVisible();
  29 |   });
  30 |
  31 |   test('Seller Full Flow: Login and check Shop/Products', async ({ page }) => {
  32 |     // 1. Login
  33 |     await page.goto('/dang-nhap');
  34 |     await page.fill('input[name="identity"]', 'phongntse170299@fpt.edu.vn');
  35 |     await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  36 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  37 |     await page.fill('input[name="password"]', 'phong123');
  38 |     await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();
  39 |
  40 |     await page.waitForURL(/.*dashboard.*/);
  41 |
  42 |     // 2. Navigate to Shop Info
  43 |     await page.goto('/dashboard/cua-hang');
  44 |     await expect(page.locator('text=Thông tin Cửa hàng').first()).toBeVisible();
  45 |
  46 |     // 3. Navigate to Products
  47 |     await page.goto('/dashboard/san-pham');
  48 |     await expect(page.locator('text=Sản phẩm').first()).toBeVisible();
  49 |
  50 |     // 4. Navigate to Create Product
  51 |     await page.goto('/dashboard/san-pham/tao-moi');
  52 |     await expect(page.locator('text=Thêm sản phẩm mới').first()).toBeVisible();
  53 |   });
  54 |
  55 |   test('Admin Full Flow: Login and manage Users/Products', async ({ page }) => {
  56 |     // 1. Login
  57 |     await page.goto('/dang-nhap');
  58 |     await page.fill('input[name="identity"]', 'admin@ocop.vn');
  59 |     await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  60 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  61 |     await page.fill('input[name="password"]', 'Admin@2024');
  62 |     await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();
  63 |
  64 |     await page.waitForURL(/.*admin.*/);
  65 |
  66 |     // 2. Navigate to User Management
  67 |     await page.goto('/admin/users');
  68 |     await expect(page.locator('text=Quản lý người dùng').first()).toBeVisible();
  69 |
  70 |     // 3. Navigate to Product Management
  71 |     await page.goto('/admin/products');
  72 |     await expect(page.locator('text=Quản lý sản phẩm').first()).toBeVisible();
  73 |
  74 |     // 4. Check Orders Management
  75 |     await page.goto('/admin/orders');
  76 |     await expect(page.locator('text=Quản lý đơn hàng').first()).toBeVisible();
  77 |   });
  78 |
  79 | });
  80 |
```
