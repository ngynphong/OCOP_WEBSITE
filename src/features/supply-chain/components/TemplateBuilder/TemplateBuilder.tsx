'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { LegoBlock, TemplateBlock } from './LegoBlock';
import { FiPlus } from 'react-icons/fi';

interface TemplateBuilderProps {
  fields: Record<'id', string>[];
  move: (oldIndex: number, newIndex: number) => void;
  remove: (index: number) => void;
  onAdd: () => void;
  onEdit: (index: number) => void;
  getValues: (index: number) => TemplateBlock;
  renderEditForm?: (index: number) => React.ReactNode;
}

export function TemplateBuilder({
  fields,
  move,
  remove,
  onAdd,
  onEdit,
  getValues,
  renderEditForm,
}: TemplateBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }

    setActiveId(null);
  };

  const activeIndex = activeId ? fields.findIndex((f) => f.id === activeId) : -1;
  const activeBlock = activeIndex !== -1 ? getValues(activeIndex) : null;

  return (
    <div className="w-full bg-stone-50 rounded-2xl border border-stone-200 p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {fields.map((field, index) => {
              const block = getValues(index);
              // Ensure we pass the field.id as block.id for DND to track correctly
              const blockWithId = { ...block, id: field.id };
              return (
                <div key={field.id} className="flex flex-col mb-3">
                  <LegoBlock
                    block={blockWithId}
                    index={index}
                    onRemove={() => remove(index)}
                    onEdit={() => onEdit(index)}
                  />
                  {renderEditForm && renderEditForm(index)}
                </div>
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeBlock ? (
            <LegoBlock block={{ ...activeBlock, id: activeId! }} index={0} isOverlay={true} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold rounded-xl transition w-full justify-center"
        >
          <FiPlus />
          Thêm Khối Công Việc
        </button>
      </div>
    </div>
  );
}
