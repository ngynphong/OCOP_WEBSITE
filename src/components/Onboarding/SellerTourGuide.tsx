'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

// Custom event to manually trigger tours
export const triggerTourEvent = new Event('trigger-onboarding-tour');

export function SellerTourGuide() {
  const pathname = usePathname();

  useEffect(() => {
    let driverObj: ReturnType<typeof driver> | null = null;
    let tourTimeout: NodeJS.Timeout | null = null;

    const runTour = (force = false) => {
      let tourKey = '';
      let steps: DriveStep[] = [];

      if (pathname === '/dashboard/san-pham') {
        tourKey = 'tour_product_seen';
        steps = [
          {
            element: '#tour-add-product',
            popover: {
              title: 'Tạo sản phẩm',
              description:
                'Bắt đầu bằng việc thêm sản phẩm OCOP của bạn lên hệ thống tại đây. Chọn "Thêm sản phẩm mới" để tiếp tục.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-product-list',
            popover: {
              title: 'Quản lý sản phẩm',
              description:
                'Danh sách các sản phẩm của bạn sẽ hiển thị ở đây. Từ đây, bạn có thể tạo Lô sản xuất.',
              side: 'top',
              align: 'start',
            },
          },
        ];
      } else if (pathname === '/dashboard/san-pham/tao-moi') {
        tourKey = 'tour_product_create_seen';
        steps = [
          {
            element: '#tour-product-form',
            popover: {
              title: 'Khai báo thông tin cơ bản',
              description:
                'Điền tên sản phẩm, danh mục, hạng sao OCOP, đơn vị tính... Đây là các thông tin khung cơ bản nhất.',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#tour-product-save',
            popover: {
              title: 'Lưu sản phẩm',
              description:
                'Sau khi điền đủ thông tin, nhấn Lưu. Sau đó bạn sẽ được chuyển đến trang chi tiết để thêm Hình ảnh, Biến thể, và cấu hình Quy trình sản xuất chuẩn!',
              side: 'top',
              align: 'start',
            },
          },
        ];
      } else if (pathname.match(/^\/dashboard\/san-pham\/\d+$/)) {
        if (document.getElementById('tour-process-form-name')) {
          // If the creation form is open
          tourKey = 'tour_process_create_form_seen';
          steps = [
            {
              element: '#tour-process-form-name',
              popover: {
                title: 'Tên quy trình mẫu',
                description: 'Đặt tên cho quy trình này (VD: Quy trình trồng chè vụ Đông Xuân).',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-process-form-builder',
              popover: {
                title: 'Cấu trúc Quy trình',
                description:
                  'Kéo thả để sắp xếp các bước. Tiếp theo, hãy nhấn vào biểu tượng bánh răng để chỉnh sửa chi tiết khối công việc này.',
                side: 'top',
                align: 'start',
                onNextClick: () => {
                  const gearBtn = document.getElementById('tour-process-block-gear-0');
                  if (gearBtn) gearBtn.click();
                  if (driverObj) driverObj.moveNext();
                },
              },
            },
            {
              element: '#tour-edit-block-title',
              popover: {
                title: 'Chi tiết Công việc',
                description:
                  'Tại đây, bạn có thể chỉnh sửa tên công việc, loại công việc và thiết lập thời gian chờ (sau bao nhiêu ngày thì tới công đoạn này).',
                side: 'left',
                align: 'start',
              },
            },
            {
              element: '#tour-edit-block-ai',
              popover: {
                title: 'Tự động tạo hướng dẫn',
                description:
                  'Một tính năng rất hay: Nhấn vào nút này để AI tự động viết hướng dẫn chi tiết dựa trên tên công việc, giúp bạn tiết kiệm thời gian!',
                side: 'left',
                align: 'start',
                onNextClick: () => {
                  const closeBtn = document.getElementById('tour-edit-block-close');
                  if (closeBtn) closeBtn.click();
                  if (driverObj) driverObj.moveNext();
                },
              },
            },
            {
              element: '#tour-process-form-submit',
              popover: {
                title: 'Lưu quy trình',
                description:
                  'Sau khi đã thiết lập xong cấu trúc các bước, nhấn Lưu. Quy trình này sẽ sẵn sàng để áp dụng cho các Lô sản xuất sau này!',
                side: 'left',
                align: 'end',
              },
            },
          ];
        } else if (document.getElementById('tour-process-tab-content')) {
          // If the Process Template tab is open
          tourKey = 'tour_product_process_tab_seen';
          steps = [
            {
              element: '#tour-process-tab-content',
              popover: {
                title: 'Quy trình sản xuất chuẩn',
                description:
                  'Đây là nơi để định nghĩa trước các bước sản xuất chuẩn (như gieo hạt, bón phân...) để sau này áp dụng cho các lô hàng.',
                side: 'top',
                align: 'center',
              },
            },
            {
              element: '#tour-process-create',
              popover: {
                title: 'Tạo quy trình mới',
                description:
                  'Nhấn vào đây để tự định nghĩa quy trình của riêng bạn, hoặc cuộn xuống để chọn các mẫu gợi ý từ hệ thống!',
                side: 'left',
                align: 'start',
              },
            },
            {
              element: '#tour-lots-tab',
              popover: {
                title: 'Chuyển sang Lô hàng',
                description:
                  'Khi đã có quy trình chuẩn, hãy chuyển sang mục "Đợt sản xuất" để tạo các lô hàng thực tế.',
                side: 'bottom',
                align: 'center',
              },
            },
          ];
        } else if (document.getElementById('tour-lots-tab-content')) {
          // If the Lots tab is open
          tourKey = 'tour_product_lots_tab_seen';
          steps = [
            {
              element: '#tour-lots-tab-content',
              popover: {
                title: 'Lịch sử sản xuất',
                description:
                  'Nơi này hiển thị danh sách toàn bộ các lô hàng (đợt sản xuất) thuộc sản phẩm này.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-lots-tab-create-btn',
              popover: {
                title: 'Tạo lô hàng mới',
                description: 'Nhấn vào đây nếu bạn muốn khai báo một đợt sản xuất mới!',
                side: 'bottom',
                align: 'end',
              },
            },
            {
              element: '#tour-journals-tab',
              popover: {
                title: 'Câu chuyện sản phẩm',
                description:
                  'Cuối cùng, chuyển sang "Câu chuyện sản phẩm" để kể lại quá trình hình thành sản phẩm cho khách hàng nhé!',
                side: 'bottom',
                align: 'center',
              },
            },
          ];
        } else if (document.getElementById('tour-variant-form')) {
          tourKey = 'tour_product_variant_form_seen';
          steps = [
            {
              element: '#tour-variant-form-name',
              popover: {
                title: 'Tên biến thể',
                description: 'Đặt tên cho biến thể. Ví dụ: Hộp 500g, Vị trà xanh, Size M...',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-sku',
              popover: {
                title: 'Mã SKU',
                description:
                  'Mã lưu kho. Đã được tự động tạo dựa theo tên biến thể nhưng bạn có thể sửa lại theo ý muốn.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-price',
              popover: {
                title: 'Giá bán',
                description: 'Giá thực tế mà khách hàng sẽ thanh toán khi mua.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-comparePrice',
              popover: {
                title: 'Giá so sánh (Giá gốc)',
                description:
                  'Giá ban đầu trước khi giảm giá. Nếu giá này lớn hơn "Giá bán", hệ thống sẽ tự động tính và hiển thị % giảm giá.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-costPrice',
              popover: {
                title: 'Giá vốn',
                description:
                  'Chi phí gốc để sản xuất/nhập hàng. Dữ liệu này được giữ bí mật, dùng để hệ thống tính toán biên độ lợi nhuận cho bạn.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-stock',
              popover: {
                title: 'Tồn kho',
                description:
                  'Tồn kho được tính tự động dựa trên số lượng của các lô hàng sản xuất hợp lệ, không thể tự sửa tay.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-wholesale',
              popover: {
                title: 'Kích hoạt giá sỉ',
                description:
                  'Bật tính năng này nếu bạn muốn thiết lập mức giá chiết khấu khi mua số lượng nhiều.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-variant-form-default',
              popover: {
                title: 'Biến thể mặc định',
                description:
                  'Chọn nếu đây là biến thể tiêu chuẩn được hiển thị đầu tiên khi khách hàng xem sản phẩm.',
                side: 'top',
                align: 'start',
              },
            },
          ];
        } else if (document.getElementById('tour-journal-form-type')) {
          tourKey = 'tour_product_journal_form_seen';
          steps = [
            {
              element: '#tour-journal-form-type',
              popover: {
                title: 'Loại công đoạn',
                description:
                  'Chọn loại công việc tương ứng với bước này (ví dụ: Nguyên liệu, Chăm sóc, Thu hoạch...).',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-journal-form-title',
              popover: {
                title: 'Tiêu đề',
                description:
                  'Đặt tên ngắn gọn cho công việc, ví dụ: Nhập thịt gà tươi, hay Gieo hạt mầm.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-journal-form-activityDate',
              popover: {
                title: 'Ngày hoạt động',
                description: 'Chọn ngày thực tế diễn ra công đoạn này.',
                side: 'top',
                align: 'start',
              },
            },
            {
              element: '#tour-journal-form-images',
              popover: {
                title: 'Ảnh minh chứng',
                description:
                  'Tải lên hình ảnh thực tế của công đoạn này. Đây là minh chứng sinh động và bắt buộc để tăng độ tin cậy.',
                side: 'top',
                align: 'start',
              },
            },
          ];
        } else if (document.getElementById('tour-journals-tab-content')) {
          tourKey = 'tour_product_journals_tab_seen';
          steps = [
            {
              element: '#tour-journals-tab-content',
              popover: {
                title: 'Câu chuyện sản phẩm',
                description:
                  'Nơi kể câu chuyện cho sản phẩm thông qua các công đoạn. Bạn có 2 cách: dùng AI tự tạo hoặc khai báo thủ công.',
                side: 'top',
                align: 'center',
              },
            },
            {
              element: '#tour-journal-ai-builder',
              popover: {
                title: 'Tạo bằng Trợ lý AI',
                description:
                  'Chỉ cần kể ngắn gọn cho AI quy trình làm ra sản phẩm, hệ thống sẽ tự sinh các bước. Sau đó bạn nhấn "Thêm chi tiết & Lưu" để chỉnh sửa và tải ảnh lên.',
                side: 'bottom',
                align: 'start',
              },
            },
            {
              element: '#tour-journal-manual-add',
              popover: {
                title: 'Tạo thủ công',
                description:
                  'Hoặc nhấn vào đây để tự thêm từng bước nhật ký. Điền thông tin vào biểu mẫu, tải ảnh lên và lưu lại.',
                side: 'left',
                align: 'start',
              },
            },
          ];
        } else if (document.getElementById('tour-variants-tab-content')) {
          tourKey = 'tour_product_variants_tab_seen';
          steps = [
            {
              element: '#tour-variants-tab-content',
              popover: {
                title: 'Quản lý biến thể',
                description:
                  'Đây là nơi bạn quản lý các phân loại của sản phẩm (ví dụ: kích cỡ, màu sắc, khối lượng).',
                side: 'top',
                align: 'center',
              },
            },
            {
              element: '#tour-variants-add-btn',
              popover: {
                title: 'Thêm biến thể mới',
                description: 'Nhấn vào đây để khai báo thêm một phân loại mới cho sản phẩm này.',
                side: 'top',
                align: 'center',
              },
            },
            {
              element: '#tour-images-tab',
              popover: {
                title: 'Chuyển sang Hình ảnh',
                description:
                  'Tiếp theo, hãy chuyển sang mục "Hình ảnh" để tải lên các bức ảnh đẹp nhất của sản phẩm.',
                side: 'bottom',
                align: 'center',
              },
            },
          ];
        } else if (document.getElementById('tour-images-upload')) {
          tourKey = 'tour_product_images_tab_seen';
          steps = [
            {
              element: '#tour-images-upload',
              popover: {
                title: 'Tải ảnh sản phẩm',
                description:
                  'Tải lên một hoặc nhiều hình ảnh sắc nét. Bạn có thể thiết lập 1 ảnh làm ảnh chính (thumbnail).',
                side: 'bottom',
                align: 'center',
              },
            },
            {
              element: '#tour-process-tab',
              popover: {
                title: 'Chuyển sang Quy trình chuẩn',
                description:
                  'Sau khi đã có hình ảnh, hãy chuyển sang mục "Quy trình chuẩn" để thiết lập các bước sản xuất tiêu chuẩn nhé.',
                side: 'bottom',
                align: 'center',
              },
            },
          ];
        } else {
          // Other generic tabs (Info, etc)
          tourKey = 'tour_product_detail_seen';
          steps = [
            {
              element: '#tour-info-form',
              popover: {
                title: 'Thông tin chung',
                description:
                  'Đây là nơi bạn cập nhật các thông tin cơ bản nhất của sản phẩm. Bạn có thể nhờ hệ thống để tự động viết "Câu chuyện sản phẩm" cho mình.',
                side: 'top',
                align: 'center',
              },
            },
            {
              element: '#tour-variant-tab',
              popover: {
                title: 'Chuyển sang Biến thể',
                description:
                  'Sau khi khai báo thông tin chung, hãy bấm vào thẻ "Biến thể" ở đây để thiết lập giá bán và các phân loại của sản phẩm.',
                side: 'bottom',
                align: 'center',
              },
            },
          ];
        }
      } else if (pathname === '/dashboard/lo-san-xuat') {
        tourKey = 'tour_lot_seen';
        steps = [
          {
            element: '#tour-add-lot',
            popover: {
              title: 'Tạo lô sản xuất',
              description:
                'Nhấn vào nút "Bắt đầu Lô Mới" để khai báo một đợt sản xuất mới. Bạn sẽ cần chọn Sản phẩm và Quy trình tương ứng.',
              side: 'bottom',
              align: 'start',
            },
          },
        ];
      } else if (pathname === '/dashboard/lo-san-xuat/tao-moi') {
        if (document.getElementById('tour-lot-step-1')) {
          tourKey = 'tour_lot_create_step_1_seen';
          steps = [
            {
              element: '#tour-lot-step-1',
              popover: {
                title: 'Bước 1: Thông tin chung',
                description:
                  'Khai báo mã lô, chọn sản phẩm (và biến thể), số lượng dự kiến. Sau đó điền thông tin và nhấn "Tiếp tục" ở góc dưới.',
                side: 'right',
                align: 'start',
                doneBtnText: 'Đã hiểu',
              },
            },
          ];
        } else if (document.getElementById('tour-lot-step-2-empty')) {
          tourKey = 'tour_lot_create_step_2_empty_seen';
          steps = [
            {
              element: '#tour-lot-step-2-empty',
              popover: {
                title: 'Thiếu Quy trình chuẩn',
                description:
                  'Bạn chưa tạo Quy trình sản xuất chuẩn nào cho sản phẩm này! Hãy nhấn vào nút "Thiết lập Quy trình mẫu" để tạo trước, sau đó mới có thể tạo lô hàng nhé.',
                side: 'bottom',
                align: 'start',
                doneBtnText: 'Đã hiểu',
              },
            },
          ];
        } else if (document.getElementById('tour-lot-step-2')) {
          tourKey = 'tour_lot_create_step_2_seen';
          steps = [
            {
              element: '#tour-lot-step-2',
              popover: {
                title: 'Bước 2: Chọn quy trình',
                description:
                  'Hệ thống sẽ gợi ý Quy trình chuẩn mà bạn đã thiết lập cho sản phẩm này. Chọn quy trình và nhấn "Tiếp tục" để qua bước sau.',
                side: 'bottom',
                align: 'start',
                doneBtnText: 'Đã hiểu',
              },
            },
          ];
        } else if (document.getElementById('tour-lot-step-3')) {
          tourKey = 'tour_lot_create_step_3_seen';
          steps = [
            {
              element: '#tour-lot-step-3',
              popover: {
                title: 'Bước 3: Nguyên liệu đầu vào',
                description:
                  'Thêm các lô nguyên liệu đã dùng để sản xuất lô hàng này nhằm đảm bảo tính truy xuất nguồn gốc. Sau đó nhấn "Tiếp tục".',
                side: 'bottom',
                align: 'start',
                doneBtnText: 'Đã hiểu',
              },
            },
          ];
        } else if (document.getElementById('tour-lot-submit')) {
          tourKey = 'tour_lot_create_step_4_seen';
          steps = [
            {
              element: '#tour-lot-submit',
              popover: {
                title: 'Hoàn thành',
                description:
                  'Xác nhận lại toàn bộ thông tin và tạo lô. Sau khi tạo, bạn sẽ có thể bắt đầu cập nhật nhật ký cho lô hàng này!',
                side: 'top',
                align: 'start',
                doneBtnText: 'Đã hiểu',
              },
            },
          ];
        }
      } else if (pathname.match(/^\/dashboard\/lo-san-xuat\/\d+$/)) {
        tourKey = 'tour_qr_seen';
        steps = [
          {
            element: '#tour-journal-add',
            popover: {
              title: 'Ghi nhận công đoạn',
              description:
                'Mỗi khi thực hiện một bước sản xuất (như làm đất, thu hoạch), hãy nhấn vào đây để ghi chép lại.',
              side: 'bottom',
              align: 'end',
            },
          },
          {
            element: '#tour-journal',
            popover: {
              title: 'Nhật ký Truy xuất & Marketing',
              description:
                'Đây không chỉ là nhật ký nội bộ, mà còn để kể "Câu chuyện sản phẩm" (marketing) cho khách hàng. Hãy ghi chép lại nguồn nguyên liệu, cách chăm bón, thu hoạch thật chi tiết!',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#tour-qr-tab',
            popover: {
              title: 'Mã QR Truy xuất',
              description: 'Chuyển sang tab này để quản lý và sinh mã QR cho lô hàng.',
              side: 'bottom',
              align: 'center',
              onNextClick: () => {
                const el = document.getElementById('tour-qr-tab');
                if (el) el.click();
                if (driverObj) driverObj.moveNext();
              },
            },
          },
          {
            element: '#tour-generate-qr',
            popover: {
              title: 'Sinh mã QR',
              description:
                'Bấm vào đây để hệ thống tự động sinh số lượng tem QR tương ứng với sản phẩm.',
              side: 'left',
              align: 'start',
            },
          },
          {
            element: '#tour-print-qr',
            popover: {
              title: 'In tem QR',
              description:
                'Cuối cùng, in tem và dán lên bao bì sản phẩm của bạn. Khách hàng quét mã sẽ thấy được toàn bộ quy trình!',
              side: 'left',
              align: 'start',
            },
          },
        ];
      }

      if (steps.length === 0) return;

      const hasSeen = localStorage.getItem(tourKey);
      if (!hasSeen || force) {
        if (tourTimeout) clearTimeout(tourTimeout);
        // Wait a bit for elements to render
        tourTimeout = setTimeout(() => {
          // Verify if the first element exists to avoid crash
          const firstStepEl = steps[0].element as string;
          if (document.querySelector(firstStepEl)) {
            if (driverObj) {
              driverObj.destroy();
            }
            driverObj = driver({
              showProgress: true,
              nextBtnText: 'Tiếp theo',
              prevBtnText: 'Trở lại',
              doneBtnText: 'Hoàn thành',
              onDestroyed: () => {
                localStorage.setItem(tourKey, 'true');
              },
              steps,
            });
            driverObj.drive();
          }
        }, 500);
      }
    };

    // Auto run on page visit
    runTour(false);

    // Manual trigger listener
    const handleManualTrigger = () => runTour(true);
    const handleAutoTrigger = () => runTour(false);

    const handleNextStepTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { elementId, title, description, nextTabId } = customEvent.detail;

      if (driverObj) driverObj.destroy();

      // Wait slightly for DOM to settle
      setTimeout(() => {
        driverObj = driver({
          showProgress: false,
          nextBtnText: 'Chuyển trang',
          doneBtnText: 'Đã hiểu',
          steps: [
            {
              element: `#${elementId}`,
              popover: {
                title,
                description,
                side: 'bottom',
                align: 'center',
                onNextClick: () => {
                  if (nextTabId) {
                    const el = document.getElementById(elementId);
                    if (el) el.click();
                  }
                  if (driverObj) driverObj.moveNext();
                },
              },
            },
          ],
        });
        driverObj.drive();
      }, 300);
    };

    window.addEventListener('trigger-onboarding-tour', handleManualTrigger);
    window.addEventListener('trigger-onboarding-tour-auto', handleAutoTrigger);
    window.addEventListener('trigger-tour-next-step', handleNextStepTrigger);

    return () => {
      window.removeEventListener('trigger-onboarding-tour', handleManualTrigger);
      window.removeEventListener('trigger-onboarding-tour-auto', handleAutoTrigger);
      window.removeEventListener('trigger-tour-next-step', handleNextStepTrigger);
      if (tourTimeout) clearTimeout(tourTimeout);
      if (driverObj) driverObj.destroy();
    };
  }, [pathname]);

  return null;
}
