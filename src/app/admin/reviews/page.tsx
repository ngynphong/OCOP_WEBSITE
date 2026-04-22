'use client';

import React, { useState } from 'react';
import {
  useAdminPendingReviewsQuery,
  useAdminReviewMutations,
  useAdminContentFlagsQuery,
} from '@/features/reviews/hooks/useAdminReviews';
import {
  useAdminComplaints,
  useAdminUpdateComplaint,
} from '@/features/complaints/hooks/useComplaints';
import { AdminComplaintTable } from '@/features/complaints/components/AdminComplaintTable';
import { AdminComplaintDetailModal } from '@/features/complaints/components/AdminComplaintDetailModal';
import { ReviewItem } from '@/features/reviews/components/ReviewItem';
import {
  Review,
  AdminReviewQueryParams,
  ContentFlagStatus,
} from '@/features/reviews/types/reviewTypes';
import { ComplaintStatus } from '@/features/complaints/types/complaintTypes';
import {
  Loader2,
  ShieldCheck,
  Search,
  AlertCircle,
  MessageSquare,
  Flag,
  LifeBuoy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { AdminFlagTable } from '@/features/reviews/components/AdminFlagTable';
import { useDebounce } from '@/hooks/useDebounce';

type TabType = 'REVIEWS' | 'FLAGS' | 'COMPLAINTS';

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('REVIEWS');

  // States for Reviews Tab
  const [reviewParams, setReviewParams] = useState<AdminReviewQueryParams>({
    pageNo: 1,
    pageSize: 10,
    status: 'PENDING',
  });
  const [moderatingReview, setModeratingReview] = useState<{
    review: Review;
    action: 'approve' | 'reject' | 'hide';
  } | null>(null);
  const [note, setNote] = useState('');

  // States for Flags Tab
  const [flagParams, setFlagParams] = useState({
    pageNo: 1,
    pageSize: 10,
    status: 'PENDING' as ContentFlagStatus | 'ALL',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // API Queries & Mutations
  const { data: reviewResp, isLoading: isReviewLoading } = useAdminPendingReviewsQuery({
    ...reviewParams,
    search: debouncedSearch,
  });
  const { data: flagResp, isLoading: isFlagLoading } = useAdminContentFlagsQuery({
    status: flagParams.status === 'ALL' ? undefined : flagParams.status,
    pageNo: flagParams.pageNo,
    pageSize: flagParams.pageSize,
    // search: debouncedSearch,
  });

  const { approve, reject, hide, resolveFlag, isApproving, isRejecting, isHiding, isResolving } =
    useAdminReviewMutations();

  const reviews = reviewResp?.data?.content || [];
  const reviewTotalPages = reviewResp?.data?.totalPages || 0;

  const flags = flagResp?.data?.content || [];
  const flagTotalPages = flagResp?.data?.totalPages || 0;

  // States & Queries for Complaints Tab
  const [complaintParams, setComplaintParams] = useState({
    pageNo: 1,
    pageSize: 10,
    status: 'ALL',
  });
  const { data: complaintResp, isLoading: isComplaintLoading } = useAdminComplaints({
    pageNo: complaintParams.pageNo,
    pageSize: complaintParams.pageSize,
    status: complaintParams.status === 'ALL' ? undefined : complaintParams.status,
    search: debouncedSearch,
  });
  const { mutate: updateComplaint, isPending: isUpdatingComplaint } = useAdminUpdateComplaint();

  const handleUpdateComplaintStatus = (id: number, status: ComplaintStatus) => {
    updateComplaint({ id, data: { status } });
  };

  const [viewingComplaintId, setViewingComplaintId] = useState<number | null>(null);

  const complaints = complaintResp?.data?.content || [];
  const complaintTotalPages = complaintResp?.data?.totalPages || 0;

  const handleActionClick = (action: string, review: Review) => {
    setModeratingReview({ review, action: action as 'approve' | 'reject' | 'hide' });
    setNote('');
  };

  const handleConfirmModeration = async () => {
    if (!moderatingReview) return;
    try {
      const { review, action } = moderatingReview;
      if (action === 'approve') {
        await approve({ reviewId: review.id, data: { note } });
      } else if (action === 'reject') {
        await reject({ reviewId: review.id, data: { note } });
      } else if (action === 'hide') {
        await hide({ reviewId: review.id, data: { note } });
      }
      setModeratingReview(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveFlag = async (flagId: number, action: 'KEEP' | 'REMOVE') => {
    try {
      await resolveFlag({ flagId, action });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Kiểm duyệt & Báo cáo
          </h1>
          <p className="text-sm text-stone-500 font-medium">
            Quản lý chất lượng nội dung và xử lý khiếu nại từ người dùng
          </p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex gap-4 border-b border-stone-100">
        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={cn(
            'pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 cursor-pointer',
            activeTab === 'REVIEWS' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600',
          )}
        >
          <MessageSquare size={16} />
          Đánh giá chờ duyệt
          {activeTab === 'REVIEWS' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('FLAGS')}
          className={cn(
            'pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 cursor-pointer',
            activeTab === 'FLAGS' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600',
          )}
        >
          <Flag size={16} />
          Báo cáo vi phạm
          {activeTab === 'FLAGS' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('COMPLAINTS')}
          className={cn(
            'pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 cursor-pointer',
            activeTab === 'COMPLAINTS' ? 'text-emerald-800' : 'text-stone-400 hover:text-stone-600',
          )}
        >
          <LifeBuoy size={16} />
          Khiếu nại khách hàng
          {activeTab === 'COMPLAINTS' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'REVIEWS' ? (
        <div className="space-y-6">
          {/* Reviews Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex gap-2">
              {['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN'].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setReviewParams((prev) => ({
                      ...prev,
                      status: s as AdminReviewQueryParams['status'],
                      pageNo: 1,
                    }))
                  }
                  className={cn(
                    'px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border',
                    reviewParams.status === s
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-lg shadow-emerald-200'
                      : 'bg-white text-stone-400 border-stone-100 hover:border-emerald-800',
                  )}
                >
                  {s === 'PENDING'
                    ? 'Mới'
                    : s === 'APPROVED'
                      ? 'Đã duyệt'
                      : s === 'REJECTED'
                        ? 'Từ chối'
                        : 'Đã ẩn'}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px] ml-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo sản phẩm hoặc user..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-100 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {isReviewLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-50">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 transition-colors hover:bg-stone-50/30">
                    <div className="mb-4 flex items-center gap-3 py-2 px-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        Sản phẩm:
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {review.productName || 'Sản phẩm OCOP'}
                      </span>
                      <span className="text-stone-300">|</span>
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        User ID:
                      </span>
                      <span className="text-xs font-bold text-stone-900">#U{review.id}</span>
                    </div>
                    <ReviewItem review={review} variant="admin" onAction={handleActionClick} />
                  </div>
                ))}
              </div>

              {reviewTotalPages > 1 && (
                <div className="p-6 border-t border-stone-50 flex justify-center gap-2">
                  {Array.from({ length: reviewTotalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReviewParams((prev) => ({ ...prev, pageNo: idx + 1 }))}
                      className={cn(
                        'w-10 h-10 rounded-xl font-bold transition-all',
                        reviewParams.pageNo === idx + 1
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white text-stone-400 border border-stone-100 hover:border-emerald-800',
                      )}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50/30 rounded-4xl border border-dashed border-emerald-100 py-20 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm text-emerald-800">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Hoàn tất kiểm duyệt</h3>
              <p className="text-stone-500 text-sm mt-1">Không còn đánh giá nào cần xử lý.</p>
            </div>
          )}
        </div>
      ) : activeTab === 'FLAGS' ? (
        <AdminFlagTable
          flags={flags}
          isLoading={isFlagLoading}
          isResolving={isResolving}
          onResolve={handleResolveFlag}
          params={flagParams}
          setParams={setFlagParams}
          totalPages={flagTotalPages}
        />
      ) : activeTab === 'COMPLAINTS' ? (
        <div className="space-y-6">
          {/* Complaints Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-stone-100 shadow-sm">
            <div className="flex gap-2">
              {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED', 'REJECTED'].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setComplaintParams((prev) => ({
                      ...prev,
                      status: s,
                      pageNo: 1,
                    }))
                  }
                  className={cn(
                    'px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border',
                    complaintParams.status === s
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-lg shadow-emerald-200'
                      : 'bg-white text-stone-400 border-stone-100 hover:border-emerald-800',
                  )}
                >
                  {s === 'ALL'
                    ? 'Tất cả'
                    : s === 'OPEN'
                      ? 'Mở'
                      : s === 'INVESTIGATING'
                        ? 'Đang điều tra'
                        : s === 'RESOLVED'
                          ? 'Đã xử lý'
                          : 'Từ chối'}
                </button>
              ))}
            </div>
            {/* Search shared with other tabs */}
          </div>

          <AdminComplaintTable
            complaints={complaints}
            isLoading={isComplaintLoading}
            isUpdating={isUpdatingComplaint}
            onUpdateStatus={handleUpdateComplaintStatus}
            onViewDetail={(id) => setViewingComplaintId(id)}
          />

          {complaintTotalPages > 1 && (
            <div className="p-6 flex justify-center gap-2">
              {Array.from({ length: complaintTotalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setComplaintParams((prev) => ({ ...prev, pageNo: idx + 1 }))}
                  className={cn(
                    'w-10 h-10 rounded-xl font-bold transition-all',
                    complaintParams.pageNo === idx + 1
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-stone-400 border border-stone-100 hover:border-emerald-800',
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Reviews Moderation Modal */}
      <Modal
        isOpen={!!moderatingReview}
        onClose={() => setModeratingReview(null)}
        title={moderatingReview?.action === 'approve' ? 'Duyệt đánh giá' : 'Từ chối/Ẩn đánh giá'}
      >
        {moderatingReview && (
          <div className="space-y-6">
            <div
              className={cn(
                'p-4 rounded-2xl border flex gap-3',
                moderatingReview.action === 'approve'
                  ? 'bg-green-50 border-green-100'
                  : 'bg-red-50 border-red-100',
              )}
            >
              <AlertCircle
                size={20}
                className={
                  moderatingReview.action === 'approve' ? 'text-green-600' : 'text-red-600'
                }
              />
              <p className="text-sm font-medium text-stone-700">
                Bạn đang{' '}
                <span className="font-bold uppercase tracking-tight">
                  {moderatingReview.action}
                </span>{' '}
                đánh giá của <span className="font-bold">{moderatingReview.review.userName}</span>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                Ghi chú (Tùy chọn)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Nhập lý do hoặc ghi chú..."
                className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setModeratingReview(null)}
                className="flex-1 py-4 rounded-2xl"
              >
                Hủy
              </Button>
              <Button
                disabled={isApproving || isRejecting || isHiding}
                onClick={handleConfirmModeration}
                className={cn(
                  'flex-2 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2',
                  moderatingReview.action === 'approve'
                    ? 'bg-emerald-800 hover:bg-emerald-900'
                    : 'bg-red-600 hover:bg-red-700',
                )}
              >
                {(isApproving || isRejecting || isHiding) && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Xác nhận
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <AdminComplaintDetailModal
        complaintId={viewingComplaintId}
        isOpen={viewingComplaintId !== null}
        onClose={() => setViewingComplaintId(null)}
      />
    </div>
  );
}
