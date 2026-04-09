import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Schema for the JSON data part
export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ bao gồm chữ thường, số và dấu gạch ngang'),
  parentId: z.number().nullable().default(0),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').nullable().default(''),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

// Schema for the Form including Files
export const categoryFormSchema = categorySchema.extend({
  iconFile: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
      `Kích thước ảnh tối đa là 5MB.`,
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      'Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp.',
    )
    .optional(),
  bannerFile: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
      `Kích thước ảnh tối đa là 5MB.`,
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      'Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp.',
    )
    .optional(),
});

export const categoryCreateArraySchema = z.array(categorySchema);

export type CategorySchemaType = z.infer<typeof categorySchema>;
export type CategoryFormSchemaType = z.infer<typeof categoryFormSchema>;
