import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PoolStatus, DealStage } from '@/types';

interface StatusBadgeProps {
  status: PoolStatus | DealStage;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Pool statuses
  live: { label: 'LIVE', className: 'bg-success text-success-foreground animate-pulse-soft' },
  upcoming: { label: 'UPCOMING', className: 'bg-primary/20 text-primary' },
  filled: { label: 'FILLED', className: 'bg-accent text-accent-foreground' },
  failed: { label: 'FAILED', className: 'bg-destructive/20 text-destructive' },
  processing: { label: 'PROCESSING', className: 'bg-warning/20 text-warning animate-pulse-soft' },
  settling: { label: 'SETTLING', className: 'bg-warning/20 text-warning' },
  active: { label: 'ACTIVE', className: 'bg-success/20 text-success' },
  exit_completed: { label: 'EXITED', className: 'bg-muted text-muted-foreground' },
  // Deal stages
  'pre-seed': { label: 'PRE-SEED', className: 'bg-secondary text-secondary-foreground' },
  seed: { label: 'SEED', className: 'bg-secondary text-secondary-foreground' },
  'series-a': { label: 'SERIES A', className: 'bg-secondary text-secondary-foreground' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status.toUpperCase(), className: 'bg-muted text-muted-foreground' };
  
  return (
    <Badge 
      variant="secondary" 
      className={cn('rounded-md font-semibold text-xs', config.className, className)}
    >
      {config.label}
    </Badge>
  );
};
