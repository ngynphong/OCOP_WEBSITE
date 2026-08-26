import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FiMenu,
  FiTrash2,
  FiSettings,
  FiSun,
  FiTool,
  FiPackage,
  FiShield,
  FiTruck,
  FiTag,
} from 'react-icons/fi';
import clsx from 'clsx';

export type BlockType =
  | 'NONG_TRUONG'
  | 'CHE_BIEN'
  | 'DONG_GOI'
  | 'KIEM_DINH'
  | 'PHAN_PHOI'
  | 'KHAC';

export interface TemplateBlock {
  id: string;
  stepType: string;
  blockType: BlockType;
  title: string;
  description: string;
  estimatedDays: number;
}

interface LegoBlockProps {
  block: TemplateBlock;
  index: number;
  onRemove?: () => void;
  onEdit?: () => void;
  isOverlay?: boolean;
}

const BLOCK_STYLES: Record<
  BlockType,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  NONG_TRUONG: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: <FiSun />,
  },
  CHE_BIEN: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: <FiTool />,
  },
  DONG_GOI: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: <FiPackage />,
  },
  KIEM_DINH: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: <FiShield />,
  },
  PHAN_PHOI: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: <FiTruck />,
  },
  KHAC: { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', icon: <FiTag /> },
};

export function LegoBlock({ block, index, onRemove, onEdit, isOverlay }: LegoBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBlockType = (stepType: string): BlockType => {
    switch (stepType) {
      case 'RAW_MATERIAL':
      case 'PLANTING':
      case 'CARE':
      case 'HARVESTING':
        return 'NONG_TRUONG';
      case 'PROCESSING':
        return 'CHE_BIEN';
      case 'PACKAGING':
        return 'DONG_GOI';
      case 'QUALITY_CHECK':
      case 'CERTIFICATION':
        return 'KIEM_DINH';
      case 'OTHER':
      default:
        return 'KHAC';
    }
  };

  const currentBlockType = block.blockType || getBlockType(block.stepType);
  const blockStyle = BLOCK_STYLES[currentBlockType] || BLOCK_STYLES.KHAC;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'relative flex items-center p-4 rounded-xl border-2 mb-3 shadow-sm bg-white transition-all',
        blockStyle.border,
        isDragging && !isOverlay ? 'opacity-30 border-dashed' : 'opacity-100',
        isOverlay ? 'shadow-lg scale-105 cursor-grabbing' : '',
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-3 text-stone-400 hover:text-stone-600 cursor-grab active:cursor-grabbing p-1"
      >
        <FiMenu size={20} />
      </div>

      <div
        className={clsx(
          'w-10 h-10 rounded-lg flex items-center justify-center mr-4 text-xl',
          blockStyle.bg,
          blockStyle.text,
        )}
      >
        {blockStyle.icon}
      </div>

      <div className="flex-1">
        <h4 className={clsx('font-bold text-sm', blockStyle.text)}>{block.title}</h4>
        <p className="text-xs text-stone-500 line-clamp-1">
          {block.description || 'Chưa có mô tả'}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {block.estimatedDays > 0 && (
          <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
            +{block.estimatedDays} ngày
          </span>
        )}

        {onEdit && (
          <button
            id={index === 0 ? 'tour-process-block-gear-0' : undefined}
            type="button"
            onClick={onEdit}
            className="p-2 text-stone-400 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
          >
            <FiSettings size={16} />
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-stone-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
