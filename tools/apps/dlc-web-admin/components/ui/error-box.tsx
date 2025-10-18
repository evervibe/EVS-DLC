'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ErrorBoxProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function ErrorBox({ children, className, title = 'Error' }: ErrorBoxProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
