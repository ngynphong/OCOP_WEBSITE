import React, { useEffect, useState } from 'react';
import { FiX, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { materialSourceApi } from '../api/materialSourceApi';
import { ISourceCycleLog, ISourceCycleLogReq } from '../types/materialSourceTypes';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cycleId: number;
}

export default function SourceCycleLogModal({ isOpen, onClose, cycleId }: Props) {
  const [logs, setLogs] = useState<ISourceCycleLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<ISourceCycleLogReq>({
    defaultValues: {
      activityName: '',
      eventTime: new Date().toISOString().slice(0, 16),
      description: '',
      materialsUsed: '',
    },
  });

  useEffect(() => {
    if (isOpen) fetchLogs();
  }, [isOpen, cycleId]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await materialSourceApi.getCycleLogs(cycleId, 0, 100);
      if (res.data?.content) {
        setLogs(res.data.content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    const values = form.getValues();
    if (!values.activityName) {
      toast.error('Vui lòng nhập tên hoạt động');
      return;
    }
    try {
      await materialSourceApi.createCycleLog(cycleId, values);
      toast.success('Thêm nhật ký thành công');
      setIsAdding(false);
      form.reset();
      fetchLogs();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (logId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhật ký này?')) return;
    try {
      await materialSourceApi.deleteCycleLog(logId);
      toast.success('Xóa nhật ký thành công');
      fetchLogs();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-stone-900">Nhật ký canh tác / chăn nuôi</h2>
        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <FiX className="text-stone-500" size={24} />
        </button>
      </div>

      <div className="mb-6">
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
          >
            <FiPlus className="mr-2" /> Thêm hoạt động mới
          </Button>
        ) : (
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <h3 className="font-semibold text-stone-800">Ghi nhận hoạt động</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  Thời gian
                </label>
                <input
                  type="datetime-local"
                  {...form.register('eventTime')}
                  className="w-full px-3 py-2 border border-stone-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">Tên hoạt động</label>
                <input
                  type="text"
                  placeholder="Vd: Bón phân đợt 1, Phun thuốc..."
                  {...form.register('activityName')}
                  className="w-full px-3 py-2 border border-stone-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">Vật tư sử dụng</label>
                <input
                  type="text"
                  placeholder="Vd: Phân NPK, Thuốc trừ sâu abc..."
                  {...form.register('materialsUsed')}
                  className="w-full px-3 py-2 border border-stone-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">Mô tả thêm</label>
                <textarea
                  placeholder="Chi tiết cách thực hiện, lưu ý..."
                  rows={3}
                  {...form.register('description')}
                  className="w-full px-3 py-2 border border-stone-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setIsAdding(false)} variant="outline">
                Hủy
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Lưu nhật ký
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 relative border-l-2 border-stone-100 ml-4 pl-6">
        {isLoading ? (
          <div className="text-center py-4 text-stone-500">Đang tải...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-6 text-stone-500 italic">
            Chưa có nhật ký nào được ghi nhận.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="relative bg-white border border-stone-200 rounded-xl p-4 shadow-sm group hover:border-emerald-300 transition-colors"
            >
              {/* Timeline dot */}
              <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[31px] top-6 border-2 border-white shadow-sm"></div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock className="text-stone-400" size={14} />
                    <span className="text-sm font-medium text-emerald-700">
                      {format(new Date(log.eventTime), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-800 text-lg">{log.activityName}</h4>

                  {log.materialsUsed && (
                    <div className="mt-2 text-sm bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg inline-block border border-blue-100">
                      <span className="font-semibold">Vật tư:</span> {log.materialsUsed}
                    </div>
                  )}

                  {log.description && (
                    <p className="mt-2 text-stone-600 text-sm whitespace-pre-wrap">
                      {log.description}
                    </p>
                  )}

                  <div className="mt-3 text-xs text-stone-400">Người ghi: {log.createdBy}</div>
                </div>

                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Xóa"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
