import { useEffect, useState } from 'react';
import { getTimeRemaining } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endDatetime: string;
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

export const CountdownTimer = ({ 
  endDatetime, 
  className, 
  showLabels = true,
  compact = false 
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDatetime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endDatetime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDatetime]);

  if (timeLeft.expired) {
    return (
      <span className={cn('text-muted-foreground', className)}>
        Ended
      </span>
    );
  }

  if (compact) {
    return (
      <span className={cn('font-medium tabular-nums', className)}>
        {timeLeft.hours}h {timeLeft.minutes}m left
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <TimeUnit value={timeLeft.hours} label={showLabels ? 'HRS' : ''} />
      <span className="text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.minutes} label={showLabels ? 'MIN' : ''} />
      <span className="text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.seconds} label={showLabels ? 'SEC' : ''} />
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold tabular-nums">
      {value.toString().padStart(2, '0')}
    </span>
    {label && <span className="text-xs text-muted-foreground">{label}</span>}
  </div>
);
