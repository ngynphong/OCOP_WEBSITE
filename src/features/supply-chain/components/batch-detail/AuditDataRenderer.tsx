'use client';

import React from 'react';

interface AuditDataRendererProps {
  data: unknown;
}

export function AuditDataRenderer({ data }: AuditDataRendererProps) {
  if (!data) return <span className="text-stone-500 italic">Trống</span>;

  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (_e) {
      return <span className="text-stone-600">{data}</span>;
    }
  }

  if (typeof parsedData !== 'object' || parsedData === null) {
    return <span className="text-stone-600">{String(parsedData)}</span>;
  }

  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      stepTitle: 'Công đoạn',
      eventData: 'Dữ liệu',
      timestamp: 'Thời điểm',
      actorEmail: 'Người thực hiện',
      actorName: 'Tên người thực hiện',
      notes: 'Ghi chú',
      quantity: 'Số lượng',
      unit: 'Đơn vị',
      lotCode: 'Mã lô',
      status: 'Trạng thái',
      productionDate: 'Ngày sản xuất',
      expiryDate: 'Hạn sử dụng',
      remainingQuantity: 'Tồn kho',
      reason: 'Lý do',
    };
    return keyMap[key] || key;
  };

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined)
      return <span className="text-stone-400 italic">Trống</span>;
    if (typeof value === 'boolean')
      return <span className="text-stone-600">{value ? 'Có' : 'Không'}</span>;

    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        const innerParsed = JSON.parse(value);
        if (
          typeof innerParsed === 'object' &&
          innerParsed !== null &&
          !Array.isArray(innerParsed)
        ) {
          return (
            <div className="pl-3 mt-1 space-y-1 border-l-2 border-stone-200">
              {Object.entries(innerParsed).map(([k, v]) => (
                <div key={k} className="text-[11px] flex gap-2">
                  <span className="font-medium text-stone-700 min-w-[80px]">{k}:</span>
                  <span className="text-stone-600">{String(v)}</span>
                </div>
              ))}
            </div>
          );
        }
      } catch (_e) {
        return <span className="text-stone-600">{value}</span>;
      }
    }

    if (Array.isArray(value) && value.length >= 3 && typeof value[0] === 'number') {
      const [y, m, d, h, mn] = value;
      if (y > 2000 && y < 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        let dateStr = `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
        if (h !== undefined && mn !== undefined) {
          dateStr += ` ${h.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')}`;
        }
        return <span className="text-stone-600">{dateStr}</span>;
      }
    }

    if (typeof value === 'object') {
      return (
        <pre className="text-[10px] text-stone-600 whitespace-pre-wrap">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span className="text-stone-600">{String(value)}</span>;
  };

  return (
    <div className="space-y-2 mt-1 bg-white p-2 rounded border border-stone-100">
      {Object.entries(parsedData as Record<string, unknown>).map(([key, value], idx) => (
        <div key={idx} className="text-xs">
          <span className="font-medium text-stone-800 capitalize">{formatKey(key)}:</span>{' '}
          {renderValue(value)}
        </div>
      ))}
    </div>
  );
}

export default AuditDataRenderer;
