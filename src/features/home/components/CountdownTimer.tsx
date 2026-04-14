import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <TimeUnit value={timeLeft.days.toString()} label="Ngày" />
            <span className="text-orange-600 font-bold mb-4">:</span>
          </>
        )}
        <TimeUnit value={formatNumber(timeLeft.hours)} label="Giờ" />
        <span className="text-orange-600 font-bold mb-4">:</span>
        <TimeUnit value={formatNumber(timeLeft.minutes)} label="Phút" />
        <span className="text-orange-600 font-bold mb-4">:</span>
        <TimeUnit value={formatNumber(timeLeft.seconds)} label="Giây" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-orange-600 text-white px-2 py-1 rounded-md text-sm font-bold min-w-[32px] text-center shadow-sm">
        {value}
      </div>
      <span className="text-[9px] font-black text-orange-700/50 uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );
}
