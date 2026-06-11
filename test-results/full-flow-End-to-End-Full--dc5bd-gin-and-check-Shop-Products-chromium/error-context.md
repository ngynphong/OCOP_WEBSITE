# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-flow.spec.ts >> End-to-End Full Flow with Real Accounts >> Seller Full Flow: Login and check Shop/Products
- Location: tests\e2e\full-flow.spec.ts:31:7

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
                    - button "Thông báo (18 chưa đọc)" [ref=e54] [cursor=pointer]:
                        - img [ref=e55]
                        - generic [ref=e58]: '18'
                    - link "Giỏ hàng" [ref=e59] [cursor=pointer]:
                        - /url: /gio-hang
                        - img [ref=e60]
        - main [ref=e64]:
            - generic [ref=e65]:
                - generic [ref=e66]:
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
                    - generic [ref=e67]:
                        - generic [ref=e68]:
                            - generic [ref=e69]:
                                - img [ref=e70]
                                - generic [ref=e73]: Nền tảng TMĐT OCOP Việt Nam
                            - heading "OCOP IES Connect" [level=1] [ref=e74]:
                                - text: OCOP
                                - text: IES Connect
                            - paragraph [ref=e75]:
                                - text: Kết nối nông dân • Nghệ nhân • Người tiêu dùng
                                - text: Truy xuất nguồn gốc qua QR
                            - generic [ref=e76]:
                                - generic [ref=e77]:
                                    - img [ref=e79]
                                    - generic [ref=e83]:
                                        - paragraph [ref=e84]: 12K+
                                        - paragraph [ref=e85]: Sản phẩm OCOP
                                - generic [ref=e86]:
                                    - img [ref=e88]
                                    - generic [ref=e92]:
                                        - paragraph [ref=e93]: 3.400+
                                        - paragraph [ref=e94]: Cửa hàng
                                - generic [ref=e95]:
                                    - img [ref=e97]
                                    - generic [ref=e99]:
                                        - paragraph [ref=e100]: '63'
                                        - paragraph [ref=e101]: Tỉnh thành
                                - generic [ref=e102]:
                                    - img [ref=e104]
                                    - generic [ref=e110]:
                                        - paragraph [ref=e111]: QR
                                        - paragraph [ref=e112]: Truy xuất
                        - generic [ref=e113]:
                            - generic [ref=e114]:
                                - generic [ref=e115] [cursor=pointer]:
                                    - generic [ref=e116]:
                                        - generic [ref=e117]: OCOP
                                        - generic [ref=e118]:
                                            - text: '4'
                                            - img [ref=e119]
                                    - img "Trà San Tuyết" [ref=e122]
                                - generic [ref=e123]:
                                    - heading "Trà San Tuyết" [level=3] [ref=e124]
                                    - paragraph [ref=e125]: Trà San Tuyết
                                    - generic [ref=e127]:
                                        - img [ref=e128]
                                        - img [ref=e130]
                                        - img [ref=e132]
                                        - img [ref=e134]
                                        - img [ref=e136]
                                        - generic [ref=e138]: '5.0'
                                    - generic [ref=e140]: 200.000₫
                                    - generic [ref=e141]:
                                        - button "Mua ngay" [ref=e142] [cursor=pointer]:
                                            - img [ref=e143]
                                            - text: Mua ngay
                                        - button "Yêu thích" [ref=e147] [cursor=pointer]:
                                            - img [ref=e148]
                                            - generic [ref=e150]: Yêu thích
                            - button "Go to slide 1" [ref=e152] [cursor=pointer]
                - generic [ref=e153]:
                    - generic [ref=e154]:
                        - generic [ref=e155]:
                            - heading "Bán chạy nhất" [level=2] [ref=e156]
                            - generic [ref=e157]:
                                - button [ref=e158]:
                                    - img [ref=e159]
                                - button [ref=e161]:
                                    - img [ref=e162]
                        - link "Trà San Tuyết Thêm vào yêu thích Trà San Tuyết 5.0 Trà San Tuyết Việt Nam 200.000₫" [ref=e165] [cursor=pointer]:
                            - /url: /san-pham/tra-san-tuyet
                            - generic [ref=e166]:
                                - generic [ref=e167]:
                                    - img "Trà San Tuyết" [ref=e168]
                                    - button "Thêm vào yêu thích" [ref=e170]:
                                        - img [ref=e171]
                                - generic [ref=e173]:
                                    - generic [ref=e174]:
                                        - heading "Trà San Tuyết" [level=3] [ref=e175]
                                        - generic [ref=e176]:
                                            - img [ref=e177]
                                            - generic [ref=e179]: '5.0'
                                    - generic [ref=e180]:
                                        - generic [ref=e181]: Trà San Tuyết
                                        - generic [ref=e183]: Việt Nam
                                    - generic [ref=e186]: 200.000₫
                    - generic [ref=e188]:
                        - img "Flash Sale - Trà San Tuyết" [ref=e190]
                        - generic [ref=e192]:
                            - generic [ref=e193]:
                                - generic [ref=e194]:
                                    - generic [ref=e195]:
                                        - img [ref=e197]
                                        - heading "GIÁ HỜI MỖI NGÀY" [level=2] [ref=e199]
                                    - generic [ref=e200]:
                                        - generic [ref=e201]: Kết thúc sau
                                        - generic [ref=e203]:
                                            - generic [ref=e204]:
                                                - generic [ref=e205]: '2'
                                                - generic [ref=e206]: Ngày
                                            - generic [ref=e207]: ':'
                                            - generic [ref=e208]:
                                                - generic [ref=e209]: '11'
                                                - generic [ref=e210]: Giờ
                                            - generic [ref=e211]: ':'
                                            - generic [ref=e212]:
                                                - generic [ref=e213]: '29'
                                                - generic [ref=e214]: Phút
                                            - generic [ref=e215]: ':'
                                            - generic [ref=e216]:
                                                - generic [ref=e217]: '03'
                                                - generic [ref=e218]: Giây
                                - link "Xem tất cả" [ref=e219] [cursor=pointer]:
                                    - /url: /flash-sale
                                    - generic [ref=e220]: Xem tất cả
                                    - img [ref=e221]
                            - link "Trà San Tuyết -20% OCOP 4⭐ Trà San Tuyết 160.000đ 200.000đ Đã bán 7%" [ref=e226] [cursor=pointer]:
                                - /url: /san-pham/tra-san-tuyet
                                - generic [ref=e227]:
                                    - img "Trà San Tuyết" [ref=e228]
                                    - generic [ref=e229]:
                                        - generic [ref=e230]:
                                            - generic [ref=e231]: '-20%'
                                            - generic [ref=e232]:
                                                - img [ref=e233]
                                                - text: OCOP 4⭐
                                        - button [ref=e235]:
                                            - img [ref=e236]
                                - generic [ref=e238]:
                                    - heading "Trà San Tuyết" [level=3] [ref=e240]
                                    - generic [ref=e241]:
                                        - generic [ref=e242]:
                                            - generic [ref=e243]: 160.000đ
                                            - generic [ref=e244]: 200.000đ
                                        - generic [ref=e248]: Đã bán 7%
                    - generic [ref=e250]:
                        - generic [ref=e251]:
                            - img [ref=e253]
                            - generic [ref=e256]:
                                - heading "100% Chính hãng" [level=3] [ref=e258]
                                - paragraph [ref=e259]: Kiểm định OCOP 3-5 sao
                        - generic [ref=e260] [cursor=pointer]:
                            - img [ref=e262]
                            - generic [ref=e267]:
                                - generic [ref=e268]:
                                    - heading "7 ngày đổi trả" [level=3] [ref=e269]
                                    - generic [ref=e270]:
                                        - img [ref=e271]
                                        - generic: Không áp dụng cho hàng tươi sống
                                - paragraph [ref=e273]: Theo chính sách đổi trả
                        - generic [ref=e274]:
                            - img [ref=e276]
                            - generic [ref=e279]:
                                - heading "Thanh toán an toàn" [level=3] [ref=e281]
                                - paragraph [ref=e282]: Đa dạng phương thức thanh toán
                    - generic [ref=e283]:
                        - heading "Danh mục nổi bật" [level=2] [ref=e285]
                        - link "Trà Trà" [ref=e287] [cursor=pointer]:
                            - /url: /danh-muc/tra
                            - img "Trà" [ref=e290]
                            - heading "Trà" [level=3] [ref=e291]
                    - generic [ref=e293]:
                        - generic [ref=e294]:
                            - generic [ref=e296]:
                                - img [ref=e297]
                                - generic [ref=e300]: OCOP MALL
                            - link "Xem thêm" [ref=e301] [cursor=pointer]:
                                - /url: /shops
                                - text: Xem thêm
                                - img [ref=e302]
                        - generic [ref=e305]:
                            - generic [ref=e308]:
                                - img [ref=e309]
                                - generic [ref=e311]: 0.0 (0)
                            - generic [ref=e312]:
                                - img "Trà San Tuyết" [ref=e315]
                                - generic [ref=e316]:
                                    - heading "Trà San Tuyết" [level=3] [ref=e317]
                                    - generic [ref=e318]:
                                        - generic [ref=e319]: OCOP 4★
                                        - generic [ref=e320]: Thành phố Lạng Sơn, Tỉnh Lạng Sơn
                                - paragraph [ref=e322]: '"trà san tuyết đặc sản trà việt"'
                                - generic [ref=e323]:
                                    - generic [ref=e324]:
                                        - generic [ref=e325]:
                                            - img "Product" [ref=e327]
                                            - img "Product" [ref=e329]
                                            - img "Product" [ref=e331]
                                        - generic [ref=e332]: +4 SP
                                    - link "Vào shop" [ref=e333] [cursor=pointer]:
                                        - /url: /cua-hang/1
                                        - img [ref=e334]
                                        - text: Vào shop
                    - generic [ref=e339]:
                        - generic [ref=e340]:
                            - heading "Trà" [level=2] [ref=e342]
                            - link "Xem tất cả" [ref=e344] [cursor=pointer]:
                                - /url: /danh-muc/tra
                                - text: Xem tất cả
                                - img [ref=e345]
                        - link "Trà San Tuyết Thêm vào yêu thích Trà San Tuyết 5.0 Trà San Tuyết Việt Nam 200.000₫" [ref=e348] [cursor=pointer]:
                            - /url: /san-pham/tra-san-tuyet
                            - generic [ref=e349]:
                                - generic [ref=e350]:
                                    - img "Trà San Tuyết" [ref=e351]
                                    - button "Thêm vào yêu thích" [ref=e353]:
                                        - img [ref=e354]
                                - generic [ref=e356]:
                                    - generic [ref=e357]:
                                        - heading "Trà San Tuyết" [level=3] [ref=e358]
                                        - generic [ref=e359]:
                                            - img [ref=e360]
                                            - generic [ref=e362]: '5.0'
                                    - generic [ref=e363]:
                                        - generic [ref=e364]: Trà San Tuyết
                                        - generic [ref=e366]: Việt Nam
                                    - generic [ref=e369]: 200.000₫
                    - generic [ref=e370]:
                        - generic [ref=e372]:
                            - generic [ref=e373]:
                                - heading "GỢI Ý HÔM NAY" [level=2] [ref=e375]
                                - generic [ref=e376]:
                                    - generic [ref=e377]: 'Sắp xếp:'
                                    - button "Mới nhất" [ref=e378] [cursor=pointer]
                                    - button "Bán chạy" [ref=e379] [cursor=pointer]
                                    - button "Đánh giá cao" [ref=e380] [cursor=pointer]
                                    - button "Giá thấp" [ref=e381] [cursor=pointer]
                                    - button "Giá cao" [ref=e382] [cursor=pointer]
                            - generic [ref=e383]:
                                - button "Tất cả" [ref=e384] [cursor=pointer]
                                - button "Trà" [ref=e385] [cursor=pointer]
                        - link "Trà San Tuyết Thêm vào yêu thích Trà San Tuyết 5.0 Trà San Tuyết Việt Nam 200.000₫" [ref=e387] [cursor=pointer]:
                            - /url: /san-pham/tra-san-tuyet
                            - generic [ref=e388]:
                                - generic [ref=e389]:
                                    - img "Trà San Tuyết" [ref=e390]
                                    - button "Thêm vào yêu thích" [ref=e392]:
                                        - img [ref=e393]
                                - generic [ref=e395]:
                                    - generic [ref=e396]:
                                        - heading "Trà San Tuyết" [level=3] [ref=e397]
                                        - generic [ref=e398]:
                                            - img [ref=e399]
                                            - generic [ref=e401]: '5.0'
                                    - generic [ref=e402]:
                                        - generic [ref=e403]: Trà San Tuyết
                                        - generic [ref=e405]: Việt Nam
                                    - generic [ref=e408]: 200.000₫
            - generic [ref=e409]:
                - generic [ref=e411]:
                    - generic [ref=e412]:
                        - heading "Đánh giá từ cộng đồng" [level=2] [ref=e413]
                        - paragraph [ref=e414]: Sự hài lòng của khách hàng là minh chứng lớn nhất cho giá trị của nông sản Việt thực thụ.
                    - generic [ref=e415]:
                        - generic [ref=e416]:
                            - img [ref=e417]
                            - generic [ref=e420]:
                                - img [ref=e421]
                                - img [ref=e423]
                                - img [ref=e425]
                                - img [ref=e427]
                                - img [ref=e429]
                            - paragraph [ref=e431]: '"Tôi rất ấn tượng với chất lượng hạt sen sấy. Sản phẩm được đóng gói rất đẹp, rất hợp làm quà tặng. Giao hàng cực nhanh!"'
                            - generic [ref=e432]:
                                - img "Minh Thư" [ref=e434]
                                - generic [ref=e435]:
                                    - heading "Minh Thư" [level=4] [ref=e436]
                                    - generic [ref=e437]: TP. Hồ Chí Minh
                        - generic [ref=e438]:
                            - img [ref=e439]
                            - generic [ref=e442]:
                                - img [ref=e443]
                                - img [ref=e445]
                                - img [ref=e447]
                                - img [ref=e449]
                                - img [ref=e451]
                            - paragraph [ref=e453]: '"OCOP Market là nơi duy nhất tôi tin tưởng khi mua đặc sản Tây Bắc. Nước mắm chuẩn vị truyền thống, đậm đà không hóa chất."'
                            - generic [ref=e454]:
                                - img "Hoàng Nam" [ref=e456]
                                - generic [ref=e457]:
                                    - heading "Hoàng Nam" [level=4] [ref=e458]
                                    - generic [ref=e459]: Hà Nội
                        - generic [ref=e460]:
                            - img [ref=e461]
                            - generic [ref=e464]:
                                - img [ref=e465]
                                - img [ref=e467]
                                - img [ref=e469]
                                - img [ref=e471]
                                - img [ref=e473]
                            - paragraph [ref=e475]: '"Mua hàng ở đây không chỉ là mua sắm, mà còn là ủng hộ những người nông dân tâm huyết. Giá cả rất hợp lý so với chất lượng OCOP."'
                            - generic [ref=e476]:
                                - img "Lan Anh" [ref=e478]
                                - generic [ref=e479]:
                                    - heading "Lan Anh" [level=4] [ref=e480]
                                    - generic [ref=e481]: Đà Nẵng
                - generic [ref=e483]:
                    - generic [ref=e486]:
                        - heading "Truy xuất nguồn gốc trong nháy mắt" [level=2] [ref=e487]:
                            - generic [ref=e488]: Truy xuất nguồn gốc
                            - text: trong nháy mắt
                        - paragraph [ref=e489]: Mỗi sản phẩm tại OCOP Market đều được gắn mã QR duy nhất. Chỉ cần một lần quét, bạn sẽ biết rõ hành trình từ trang trại đến tay bạn, thông tin hộ nông dân và các chứng chỉ kiểm định.
                        - generic [ref=e490]:
                            - generic [ref=e491]:
                                - generic [ref=e492]: 100%
                                - generic [ref=e493]: Minh Bạch
                            - generic [ref=e494]:
                                - generic [ref=e495]: Real-time
                                - generic [ref=e496]: Theo dõi
                            - generic [ref=e497]:
                                - generic [ref=e498]: Global
                                - generic [ref=e499]: Tiêu chuẩn
                    - generic [ref=e503]:
                        - img [ref=e504]
                        - img [ref=e518]
                - generic [ref=e529]:
                    - generic [ref=e530]:
                        - generic [ref=e531]: Đặc quyền OCOP
                        - heading "Đăng ký bản tin, Nhận ngàn ưu đãi." [level=2] [ref=e532]:
                            - text: Đăng ký bản tin,
                            - text: Nhận ngàn ưu đãi.
                        - paragraph [ref=e533]: Trở thành người đầu tiên nhận thông tin về sản phẩm OCOP mới nhất, các chương trình khuyến mãi độc quyền và câu chuyện từ vùng nguyên liệu.
                    - generic [ref=e535]:
                        - generic [ref=e536]:
                            - img [ref=e538]
                            - textbox "Sử dụng email tài khoản của bạn" [disabled] [ref=e541]
                        - button "Đăng ký ngay" [ref=e542] [cursor=pointer]:
                            - text: Đăng ký ngay
                            - img [ref=e543]
                        - paragraph [ref=e546]: '* Bằng cách đăng ký, bạn đồng ý với chính sách bảo mật của chúng tôi.'
        - generic [ref=e547]:
            - generic [ref=e548]:
                - button [ref=e549]:
                    - img [ref=e550]
                - paragraph [ref=e553]: Cần hỗ trợ hoặc Khiếu nại?
            - generic [ref=e554]:
                - button "Gửi khiếu nại" [ref=e555] [cursor=pointer]:
                    - img [ref=e556]
                - button "Ẩn nút" [ref=e558] [cursor=pointer]:
                    - img [ref=e559]
        - contentinfo [ref=e562]:
            - generic [ref=e563]:
                - generic [ref=e564]:
                    - generic [ref=e566]: OCOP IES Connect
                    - generic [ref=e568]:
                        - text: Kết nối tinh hoa nông sản Việt từ khắp mọi
                        - text: miền đất nước đến bàn ăn của mỗi gia
                        - text: đình.
                    - generic [ref=e569]:
                        - link [ref=e570] [cursor=pointer]:
                            - /url: '#'
                            - img [ref=e571]
                        - link [ref=e574] [cursor=pointer]:
                            - /url: '#'
                            - img [ref=e575]
                        - link [ref=e577] [cursor=pointer]:
                            - /url: '#'
                            - img [ref=e578]
                - generic [ref=e580]:
                    - generic [ref=e582]: Sản phẩm
                    - link "Trà" [ref=e584] [cursor=pointer]:
                        - /url: /danh-muc/tra
                - generic [ref=e585]:
                    - generic [ref=e587]: Hỗ trợ
                    - generic [ref=e588]:
                        - link "Liên hệ chúng tôi" [ref=e589] [cursor=pointer]:
                            - /url: '#'
                        - link "Chính sách bảo mật" [ref=e590] [cursor=pointer]:
                            - /url: /chinh-sach-bao-mat
                        - link "Chính sách đặt hàng" [ref=e591] [cursor=pointer]:
                            - /url: /chinh-sach-dat-hang
                        - link "Điều khoản dịch vụ" [ref=e592] [cursor=pointer]:
                            - /url: /dieu-khoan-dich-vu
                        - link "Trung tâm trợ giúp" [ref=e593] [cursor=pointer]:
                            - /url: /ho-tro
                - generic [ref=e594]:
                    - heading "Liên hệ" [level=3] [ref=e596]
                    - generic [ref=e597]:
                        - generic [ref=e598]:
                            - img [ref=e599]
                            - generic [ref=e602]: Số 3 Công Trường Quốc Tế , Phường Xuân Hoà, Thành phố Hồ Chí Minh.
                        - generic [ref=e603]:
                            - img [ref=e604]
                            - generic [ref=e606]: +84 96 524 8115
                        - generic [ref=e607]:
                            - img [ref=e608]
                            - generic [ref=e611]: infovienies@gmail.com
            - link "DMCA.com Protection Status" [ref=e613] [cursor=pointer]:
                - /url: https://www.dmca.com/r/9e5z4w8
                - img "DMCA.com Protection Status" [ref=e614]
            - generic [ref=e616]: © 2026 OCOP IES Connect
    - generic [ref=e617]:
        - img [ref=e619]
        - button "Open Tanstack query devtools" [ref=e667] [cursor=pointer]:
            - img [ref=e668]
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
  15 |     await page.waitForURL(/.*dashboard.*/);
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
> 40 |     await page.waitForURL(/.*dashboard.*/);
     |                ^ Error: page.waitForURL: Test timeout of 120000ms exceeded.
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
