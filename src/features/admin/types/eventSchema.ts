import { z } from 'zod';

export const eventFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Tên sự kiện phải có ít nhất 3 ký tự')
      .max(150, 'Tên sự kiện không được vượt quá 150 ký tự'),
    code: z
      .string()
      .trim()
      .min(2, 'Mã sự kiện phải có ít nhất 2 ký tự')
      .max(50, 'Mã sự kiện không được vượt quá 50 ký tự')
      .regex(/^[A-Z0-9_-]+$/, 'Mã sự kiện chỉ bao gồm chữ in hoa, số, gạch nối và gạch dưới'),
    slug: z
      .string()
      .trim()
      .min(2, 'Slug phải có ít nhất 2 ký tự')
      .max(150, 'Slug không được vượt quá 150 ký tự')
      .regex(/^[a-z0-9-]+$/, 'Slug chỉ bao gồm chữ thường không dấu, số và gạch nối (-)'),
    description: z.string().optional().default(''),
    type: z.enum(['SEASONAL', 'CULTURAL', 'COMMERCE', 'REGIONAL', 'COMMUNITY']),
    startAt: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
    endAt: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
    isHomeFeatured: z.boolean().default(true),
    bannerDesktopUrl: z
      .string()
      .trim()
      .refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
        message: 'URL ảnh banner desktop không hợp lệ',
      })
      .optional()
      .default(''),
    bannerMobileUrl: z
      .string()
      .trim()
      .refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
        message: 'URL ảnh banner mobile không hợp lệ',
      })
      .optional()
      .default(''),
    sellerPortalVisible: z.boolean().default(false),
    registrationStartAt: z.string().optional(),
    registrationEndAt: z.string().optional(),
    minOcopStar: z
      .number()
      .int()
      .min(1, 'Hạng sao OCOP tối thiểu là 1 sao')
      .max(5, 'Hạng sao OCOP tối đa là 5 sao')
      .default(3),
    minDiscountPercent: z
      .number()
      .min(1, 'Mức giảm giá tối thiểu là 1%')
      .max(100, 'Mức giảm giá tối đa là 100%')
      .default(10),
    maxProductsPerShop: z
      .number()
      .int()
      .min(1, 'Tối thiểu 1 sản phẩm')
      .max(1000, 'Tối đa 1000 sản phẩm')
      .default(20),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt).getTime();
      const end = new Date(data.endAt).getTime();
      return !Number.isNaN(start) && !Number.isNaN(end) && start < end;
    },
    {
      message: 'Thời gian kết thúc sự kiện phải diễn ra sau thời gian bắt đầu',
      path: ['endAt'],
    },
  )
  .refine(
    (data) => {
      if (!data.sellerPortalVisible || !data.registrationStartAt || !data.registrationEndAt) {
        return true;
      }
      const regStart = new Date(data.registrationStartAt).getTime();
      const regEnd = new Date(data.registrationEndAt).getTime();
      return !Number.isNaN(regStart) && !Number.isNaN(regEnd) && regStart < regEnd;
    },
    {
      message: 'Thời gian kết thúc mở đăng ký cho nhà bán hàng phải sau thời gian bắt đầu đăng ký',
      path: ['registrationEndAt'],
    },
  );

export type EventFormSchemaType = z.infer<typeof eventFormSchema>;
