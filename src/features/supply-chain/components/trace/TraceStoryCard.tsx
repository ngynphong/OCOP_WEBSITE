import React from 'react';
import { MapPin, Star, Calendar, Store } from 'lucide-react';
import { ProductJournal } from '@/features/products/types/productTypes';

export interface TraceStoryCardProps {
  journals: ProductJournal[];
  variant?: 'standard' | 'reference';
}

export const TraceStoryCard: React.FC<TraceStoryCardProps> = ({
  journals,
  variant = 'standard',
}) => {
  if (!journals || journals.length === 0) {
    return null;
  }

  const isStandard = variant === 'standard';

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
          {isStandard ? (
            <MapPin className="w-4.5 h-4.5 text-emerald-700" />
          ) : (
            <Star className="w-4.5 h-4.5 text-stone-500" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            {isStandard
              ? 'Quy trình sản xuất tiêu chuẩn'
              : 'Hành trình câu chuyện OCOP (Tham khảo)'}
          </h2>
          <p className="text-[11px] text-stone-400">
            {isStandard
              ? 'Hành trình quy chuẩn theo hồ sơ công bố OCOP của sản phẩm'
              : 'Câu chuyện văn hóa và giá trị bản địa định danh của dòng sản phẩm'}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200" />
          <div className="flex flex-col gap-6">
            {journals.map((journal: ProductJournal) => (
              <div key={journal.id} className="flex gap-4 relative">
                <div
                  className={`w-6 h-6 rounded-full bg-white border-[3px] shrink-0 z-10 mt-0.5 ${
                    isStandard ? 'border-emerald-700' : 'border-stone-400'
                  }`}
                />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isStandard
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                          : 'text-stone-700 bg-stone-100 border-stone-200'
                      }`}
                    >
                      Bước {journal.stepOrder}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">{journal.title}</h3>
                  </div>

                  {isStandard && (
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(journal.activityDate).toLocaleDateString('vi-VN')}
                      </span>
                      {journal.location && (
                        <span className="flex items-center gap-1 truncate">
                          <Store className="w-3.5 h-3.5" />
                          {journal.location}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-stone-600 mt-1">{journal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
