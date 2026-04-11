'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { FiChevronRight, FiList, FiPlus, FiSave } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import CategoryItemForm from './CategoryItemForm';
import { CategoryFormSchemaType } from '../../types/categorySchema';
import { Category } from '../../types/adminTypes';

export interface BatchCategoryForm {
  categories: CategoryFormSchemaType[];
  commonParentId: number | null;
}

interface FormModeProps {
  selectedCategory: Category | null;
  parentIdHint: number | null;
  freshCategory?: Category | null;
  categoriesList: Category[];
  isSubmitting: boolean;
  onSubmit: (data: BatchCategoryForm) => Promise<void>;
  setIsEditing: (val: boolean) => void;
  checkSlug: (slug: string) => Promise<{ data: boolean }>;
}

const FormMode = ({
  selectedCategory,
  parentIdHint,
  freshCategory,
  categoriesList,
  isSubmitting,
  onSubmit,
  setIsEditing,
  checkSlug,
}: FormModeProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BatchCategoryForm>({
    defaultValues: {
      commonParentId: freshCategory?.parentId || parentIdHint || null,
      categories: [
        {
          name: freshCategory?.name || '',
          slug: freshCategory?.slug || '',
          parentId: freshCategory?.parentId || parentIdHint || null,
          description: freshCategory?.description || '',
          sortOrder: Number(freshCategory?.sortOrder) || 0,
          isActive: freshCategory ? freshCategory.isActive : true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const commonParentId = useWatch({ control, name: 'commonParentId' });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-stone-50/30 font-sans"
    >
      <div className="space-y-6">
        {selectedCategory && (
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-emerald-600 transition-all font-sans"
            >
              <FiChevronRight className="rotate-180" /> Quay lại xem chi tiết
            </button>
          </div>
        )}

        {/* Global Settings (Only for Create) */}
        {!selectedCategory && (
          <div className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-sm mb-4">
            <label className="block text-[10px] font-black text-emerald-800 uppercase mb-3 ml-1 tracking-wider">
              Cài đặt chung cho lô danh mục
            </label>
            <div className="relative">
              <FiList className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
              <select
                {...register('commonParentId', {
                  setValueAs: (v) => (v === null || v === '' ? null : Number(v)),
                })}
                className="w-full pl-11 pr-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-2xl text-sm font-bold text-stone-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none appearance-none font-sans"
              >
                <option value="">-- Không có (Danh mục gốc) --</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <CategoryItemForm
              key={field.id}
              index={index}
              control={control}
              register={register}
              errors={errors.categories?.[index]}
              setValue={setValue}
              isExpanded={expandedIndex === index || !!selectedCategory}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              onRemove={() => remove(index)}
              showRemove={fields.length > 1 && !selectedCategory}
              selectedCategoryId={selectedCategory?.id}
              freshCategory={index === 0 ? freshCategory : null}
              checkSlug={checkSlug}
            />
          ))}
        </div>

        {/* Add Button (Only for Create) */}
        {!selectedCategory && (
          <button
            type="button"
            onClick={() => {
              append({
                name: '',
                slug: '',
                parentId: commonParentId || parentIdHint || null,
                description: '',
                sortOrder: fields.length,
                isActive: true,
              });
              setExpandedIndex(fields.length);
            }}
            className="w-full py-4 border-2 border-dashed border-stone-200 rounded-3xl text-stone-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest font-sans"
          >
            <FiPlus size={18} />
            Thêm danh mục khác vào lô
          </button>
        )}
      </div>

      <div className="mt-12 sticky bottom-0 -mx-8 -mb-8 p-6 border-t border-stone-100 bg-white/80 backdrop-blur-md z-10">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full py-4! shadow-xl shadow-emerald-900/20 rounded-2xl! flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSave size={18} />
          )}
          {selectedCategory ? 'Lưu thay đổi' : `Xác nhận tạo ${fields.length} danh mục`}
        </Button>
      </div>
    </form>
  );
};

export default FormMode;
