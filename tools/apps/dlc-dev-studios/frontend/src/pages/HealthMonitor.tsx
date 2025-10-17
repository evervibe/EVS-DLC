import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/core/api/health';
import { ENV } from '@/core/config/env';
import { Activity, Database, Server, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/tools/ui/components/Card';
import { Loader } from '@/tools/ui/components/Loader';

export function HealthMonitor() {
  const { data: healthStatus, isLoading, error, refetch } = useQuery({
    queryKey: ['health-monitor'],
    queryFn: checkHealth,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time monitoring
  });

  const services = [
    {
      name: 'API Server',
      status: healthStatus?.api ?? false,
      url: ENV.API_HEALTH_URL,
      icon: Server,
      color: 'blue',
    },
    {
      name: 'Redis Cache',
      status: healthStatus?.redis ?? false,
      url: ENV.REDIS_HEALTH_URL,
      icon: Activity,
      color: 'orange',
    },
    {
      name: 'Database',
      status: healthStatus?.db ?? false,
      url: ENV.DB_HEALTH_URL,
      icon: Database,
      color: 'green',
    },
  ];

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBgColor = (status: boolean) => {
    return status ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Monitor</h1>
          <p className="text-gray-600">Real-time system health monitoring</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <Card>
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        </Card>
      )}

      {error && (
        <Card>
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>Failed to fetch health status</span>
          </div>
        </Card>
      )}

      {healthStatus && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-3 ${getStatusBgColor(service.status)}`}>
                      <service.icon className={`h-6 w-6 ${getStatusColor(service.status)}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.url}</p>
                    </div>
                  </div>
                  {service.status ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Card title="System Information">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Environment</p>
                  <p className="font-medium">{ENV.APP_ENV}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="font-medium">{ENV.APP_VERSION}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">API URL</p>
                  <p className="font-medium">{ENV.API_URL}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">API Timeout</p>
                  <p className="font-medium">{ENV.API_TIMEOUT}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data Cache</p>
                  <p className="font-medium">{ENV.DATA_CACHE ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Debug Panel</p>
                  <p className="font-medium">{ENV.ENABLE_DEBUG_PANEL ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Health Check Status">
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">Overall Status</span>
                <span className={`font-semibold ${healthStatus.api && healthStatus.redis && healthStatus.db ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.api && healthStatus.redis && healthStatus.db ? 'Healthy' : 'Degraded'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>API Server</span>
                <span className={getStatusColor(healthStatus.api)}>
                  {healthStatus.api ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Redis Cache</span>
                <span className={getStatusColor(healthStatus.redis)}>
                  {healthStatus.redis ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Database</span>
                <span className={getStatusColor(healthStatus.db)}>
                  {healthStatus.db ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
