import { useState, useEffect } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
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
        <TimeUnit value={formatNumber(timeLeft.hours)} />
        <span className="text-orange-600 font-bold">:</span>
        <TimeUnit value={formatNumber(timeLeft.minutes)} />
        <span className="text-orange-600 font-bold">:</span>
        <TimeUnit value={formatNumber(timeLeft.seconds)} />
      </div>
    </div>
  );
}

function TimeUnit({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-orange-600 text-white px-2 py-1 rounded-md text-sm font-bold min-w-[32px] text-center shadow-sm">
        {value}
      </div>
    </div>
  );
}
