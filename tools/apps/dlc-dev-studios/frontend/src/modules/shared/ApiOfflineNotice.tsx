import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ENV } from '@/core/config/env';

type ApiOfflineNoticeProps = {
  onRetry?: () => void;
  title?: string;
  description?: string;
};

export function ApiOfflineNotice({
  onRetry,
  title = 'API Connection Unavailable',
  description,
}: ApiOfflineNoticeProps) {
  return (
    <Card accent="crimson" title={title} description={description ?? "We couldn't reach the DLC API. Make sure the backend is running and VITE_API_URL points to the correct host."}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 text-sm text-rose-100/90">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div className="space-y-2">
            <p>
              Attempted to reach <span className="text-rose-200">{ENV.API_URL || 'Not configured'}</span>
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70">
              Health endpoint: {ENV.API_HEALTH_URL || 'Not configured'}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-xs uppercase tracking-[0.3em] text-rose-100/80">
          Ensure Docker containers are active and API credentials match the infra configuration.
        </div>
        {onRetry ? (
          <Button variant="danger" size="sm" onClick={onRetry} className="gap-2 self-start">
            <RefreshCw className="h-4 w-4" />
            Retry request
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
