import type { TourConfig, DriverGetter } from './types';

export function getLotListSteps(): TourConfig {
  return {
    tourKey: 'tour_lot_seen',
    steps: [
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
    ],
  };
}

export function getLotCreateSteps(): TourConfig | null {
  if (typeof document === 'undefined') return null;

  if (document.getElementById('tour-lot-step-1')) {
    return {
      tourKey: 'tour_lot_create_step_1_seen',
      steps: [
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
      ],
    };
  }

  if (document.getElementById('tour-lot-step-2-empty')) {
    return {
      tourKey: 'tour_lot_create_step_2_empty_seen',
      steps: [
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
      ],
    };
  }

  if (document.getElementById('tour-lot-step-2')) {
    return {
      tourKey: 'tour_lot_create_step_2_seen',
      steps: [
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
      ],
    };
  }

  if (document.getElementById('tour-lot-step-3')) {
    return {
      tourKey: 'tour_lot_create_step_3_seen',
      steps: [
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
      ],
    };
  }

  if (document.getElementById('tour-lot-submit')) {
    return {
      tourKey: 'tour_lot_create_step_4_seen',
      steps: [
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
      ],
    };
  }

  return null;
}

export function getLotDetailSteps(getDriver: DriverGetter): TourConfig {
  return {
    tourKey: 'tour_qr_seen',
    steps: [
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
            const driverObj = getDriver();
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
    ],
  };
}
