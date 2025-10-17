import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Card } from '@/tools/ui/components/Card'
import { Button } from '@/tools/ui/components/Button'
import { ENV } from '@/core/config/env'

type ApiOfflineNoticeProps = {
  onRetry?: () => void
  title?: string
  description?: string
}

export function ApiOfflineNotice({
  onRetry,
  title = 'API Connection Unavailable',
  description,
}: ApiOfflineNoticeProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-red-100 p-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">
              {description ??
                `We couldn't reach the DLC API. Make sure the backend is running and VITE_API_URL points to ${
                  ENV.API_URL || 'your API host'
                }.`}
            </p>
          </div>
          <div className="rounded border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
            <p className="font-semibold">Connection details</p>
            <p>
              <span className="font-medium">API URL:</span> {ENV.API_URL || 'Not configured'}
            </p>
            <p>
              <span className="font-medium">Health endpoint:</span> {ENV.API_HEALTH_URL || 'Not configured'}
            </p>
          </div>
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry request
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
