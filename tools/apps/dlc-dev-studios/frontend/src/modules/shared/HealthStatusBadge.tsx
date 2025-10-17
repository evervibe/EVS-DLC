import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/core/api/health';

export function HealthStatusBadge() {
  const { data, isLoading } = useQuery({
    queryKey: ['health-status'],
    queryFn: checkHealth,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" /> Checking health...
      </div>
    );
  }

  const isHealthy = data?.api && data?.redis && data?.db;

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
        isHealthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
      {isHealthy ? 'All systems healthy' : 'Issues detected'}
    </div>
  );
}
