import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBoxProps {
  message: string;
  className?: string;
}

export function ErrorBox({ message, className }: ErrorBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
