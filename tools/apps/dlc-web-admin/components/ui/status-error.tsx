'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Lock, ServerCrash, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';

interface StatusErrorProps {
  error: Error & { status?: number; statusText?: string };
  onRetry?: () => void;
}

export function StatusError({ error, onRetry }: StatusErrorProps) {
  const status = error.status || 0;

  // Unauthorized / Forbidden
  if (status === 401 || status === 403) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
        <Lock className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-1">Unauthorized</div>
          <div className="text-sm mb-3">
            You need to be logged in to view this content.
          </div>
          <Link href="/login">
            <Button size="sm" variant="secondary" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/20">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Server Error (5xx)
  if (status >= 500) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">
        <ServerCrash className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-1">Service Unavailable</div>
          <div className="text-sm mb-3">
            The server is temporarily unavailable. Please try again later.
            {error.statusText && ` (${error.statusText})`}
          </div>
          {onRetry && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onRetry}
              className="border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Generic error
  return (
    <div className="flex items-start gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="font-semibold mb-1">Error</div>
        <div className="text-sm">
          {error.message || 'An unexpected error occurred'}
        </div>
      </div>
    </div>
  );
}
