'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

async function checkHealth() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089' + '/health'
  );
  if (!response.ok) {
    throw new Error('API is offline');
  }
  return response.json();
}

export function ApiOfflineNotice() {
  const { error } = useQuery({
    queryKey: ['health-status'],
    queryFn: checkHealth,
    refetchInterval: 30_000,
    retry: 1,
  });

  if (!error) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200 shadow-lg backdrop-blur-sm">
      <AlertCircle className="h-5 w-5" />
      <div>
        <div className="font-semibold">API Offline</div>
        <div className="text-xs text-rose-300">
          Cannot connect to backend server
        </div>
      </div>
    </div>
  );
}
