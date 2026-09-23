import Image from 'next/image';
import { Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductJournal } from '@/features/products/types/productTypes';

interface TraceabilityJournalTimelineProps {
  journals: ProductJournal[];
}

export const TraceabilityJournalTimeline = ({ journals }: TraceabilityJournalTimelineProps) => (
  <div className="flex flex-col gap-8 pt-8 border-t border-stone-100">
    <div className="text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Hành trình sản phẩm OCOP</span>
      </div>
      <h3 className="text-xl font-black text-stone-900 tracking-tight mb-1">
        Quy trình & Nhật ký sản xuất
      </h3>
      <p className="text-stone-500 text-xs font-medium max-w-xl mx-auto">
        Hành trình câu chuyện từ khâu tuyển chọn nguyên liệu, chăm sóc gieo trồng đến quy chuẩn đóng
        gói hoàn thiện
      </p>
    </div>

    {journals.length === 0 ? (
      <div className="p-8 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 text-center space-y-1 max-w-xl mx-auto w-full my-2">
        <p className="text-sm font-semibold text-stone-500 italic">
          Chưa cập nhật nhật ký sản xuất
        </p>
        <p className="text-xs text-stone-400">
          Nhật ký các công đoạn canh tác và kiểm định cho sản phẩm này đang được chủ thể cập nhật.
        </p>
      </div>
    ) : (
      <div className="relative pt-6">
        <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-stone-100 md:left-1/2 md:-ml-0.5" />

        <div className="flex flex-col gap-8 relative">
          {journals.map((journal, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={journal.id}
                className={cn(
                  'flex flex-col relative md:flex-row md:items-center',
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse',
                )}
              >
                <div className="absolute left-[15px] top-0 w-5 h-5 bg-white border-4 border-emerald-600 rounded-full z-10 md:left-1/2 md:-ml-2.5 md:top-1/2 md:-mt-2.5 shadow-[0_0_0_8px_white]" />

                <div
                  className={cn(
                    'pl-10 md:pl-0 md:w-1/2',
                    isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left',
                  )}
                >
                  <div
                    className={cn(
                      'flex flex-col gap-3 group',
                      isEven ? 'md:items-end' : 'md:items-start',
                    )}
                  >
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider w-fit">
                      B. {journal.stepOrder}
                      {journal.blockchainStatus === 'CONFIRMED' && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                    </div>

                    <h3 className="text-base font-black text-stone-900 group-hover:text-emerald-700 transition-colors leading-tight">
                      {journal.title || 'Chưa cập nhật tiêu đề'}
                    </h3>

                    <div
                      className={cn(
                        'flex flex-wrap gap-3 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em]',
                        isEven ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 rounded-sm">
                        <Calendar className="w-2.5 h-2.5 text-stone-300" />
                        {journal.activityDate
                          ? new Date(journal.activityDate).toLocaleDateString('vi-VN')
                          : 'Chưa cập nhật'}
                      </div>
                      <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 rounded-sm">
                        <MapPin className="w-2.5 h-2.5 text-stone-300" />
                        {journal.location || 'Chưa cập nhật'}
                      </div>
                    </div>

                    <p className="text-stone-600 leading-relaxed font-medium text-sm">
                      {journal.description || 'Chưa cập nhật'}
                    </p>

                    {journal.images && journal.images.length > 0 && (
                      <div
                        className={cn(
                          'flex flex-wrap gap-2 mt-3',
                          isEven ? 'justify-end' : 'justify-start',
                        )}
                      >
                        {journal.images
                          .filter((img) =>
                            Boolean(img && typeof img === 'string' && img.trim() !== ''),
                          )
                          .map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-14 h-14 rounded-lg overflow-hidden shadow-md border border-stone-100 hover:scale-110 transition-all cursor-pointer"
                            >
                              <Image
                                src={img}
                                alt={`${journal.title} ${idx}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
