import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBoxProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, className, onRetry }: ErrorBoxProps) {
  return (
    <div
      className={cn(
        'glass-panel border-rose-500/40 bg-gradient-to-br from-rose-500/20 to-rose-500/5 p-6 text-rose-100',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-400/60 bg-rose-500/20">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-rose-100/90">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:text-rose-100"
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
