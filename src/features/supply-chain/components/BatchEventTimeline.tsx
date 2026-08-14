import React from 'react';
import { IEventInfo } from '../types/supplyChainTypes';
import { format } from 'date-fns';
import { Clock, CheckCircle, Package, Truck, TestTube, Factory } from 'lucide-react';

interface BatchEventTimelineProps {
  events: IEventInfo[] | null;
}

const getEventIcon = (stepType: string) => {
  switch (stepType) {
    case 'PRODUCTION':
      return <Factory className="w-5 h-5" />;
    case 'PROCESSING':
      return <Package className="w-5 h-5" />;
    case 'TESTING':
      return <TestTube className="w-5 h-5" />;
    case 'TRANSPORT':
    case 'DISTRIBUTION':
      return <Truck className="w-5 h-5" />;
    default:
      return <CheckCircle className="w-5 h-5" />;
  }
};

const getEventColor = (stepType: string) => {
  switch (stepType) {
    case 'PRODUCTION':
      return 'bg-blue-100 text-blue-600';
    case 'PROCESSING':
      return 'bg-indigo-100 text-indigo-600';
    case 'TESTING':
      return 'bg-amber-100 text-amber-600';
    case 'TRANSPORT':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const BatchEventTimeline = ({ events }: BatchEventTimelineProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có nhật ký nào được ghi nhận cho lô sản xuất này.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <span
                    className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getEventColor(
                      event.stepType,
                    )}`}
                  >
                    {getEventIcon(event.stepType)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <div className="text-sm leading-8 text-gray-500">
                    <span className="mr-0.5 font-medium text-gray-900">{event.stepTitle}</span> vào
                    ngày{' '}
                    <span className="font-medium text-gray-900">
                      {format(new Date(event.eventAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md p-4 border border-gray-100">
                    <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Ghi nhận lúc: {format(new Date(event.recordedAt), 'dd/MM/yyyy HH:mm')}
                      <span className="ml-2">Bởi: {event.recordedBy}</span>
                    </div>
                    {event.eventData &&
                      (() => {
                        let parsedData = null;
                        try {
                          parsedData =
                            typeof event.eventData === 'string'
                              ? JSON.parse(event.eventData)
                              : event.eventData;
                        } catch (e) {
                          // Not valid JSON string
                        }

                        if (
                          parsedData &&
                          typeof parsedData === 'object' &&
                          !Array.isArray(parsedData)
                        ) {
                          return (
                            <div className="bg-white rounded border border-gray-200 mt-2 overflow-hidden">
                              <ul className="divide-y divide-gray-100">
                                {Object.entries(parsedData).map(([key, value]) => (
                                  <li key={key} className="flex px-3 py-2 text-sm sm:text-xs">
                                    <span className="font-medium text-gray-500 w-1/3">{key}</span>
                                    <span className="text-gray-900 font-medium w-2/3 break-words">
                                      {String(value)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }

                        return (
                          <pre className="text-xs bg-white p-2 mt-2 rounded border border-gray-200 overflow-x-auto">
                            {typeof event.eventData === 'string'
                              ? event.eventData
                              : JSON.stringify(event.eventData, null, 2)}
                          </pre>
                        );
                      })()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
