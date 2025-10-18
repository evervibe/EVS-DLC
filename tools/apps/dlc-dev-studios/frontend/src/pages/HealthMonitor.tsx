import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Database, RefreshCw, Server, ShieldAlert } from 'lucide-react';
import { checkHealth } from '@/core/api/health';
import { ENV } from '@/core/config/env';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { ApiOfflineNotice } from '@/modules/shared/ApiOfflineNotice';

const serviceConfig = [
  {
    key: 'api' as const,
    name: 'API Server',
    icon: Server,
    url: ENV.API_HEALTH_URL,
  },
  {
    key: 'redis' as const,
    name: 'Redis Cache',
    icon: Activity,
    url: ENV.REDIS_HEALTH_URL,
  },
  {
    key: 'db' as const,
    name: 'Database Cluster',
    icon: Database,
    url: ENV.DB_HEALTH_URL,
  },
];

export function HealthMonitor() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['health-monitor'],
    queryFn: checkHealth,
    refetchInterval: 10_000,
  });

  const overallHealthy = Boolean(data?.api && data?.redis && data?.db);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl uppercase tracking-[0.4em] text-gold">Sentinel Watch</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Real-time diagnostics across DLC realms</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Refreshing' : 'Manual Sync'}
        </Button>
      </header>

      {isLoading ? <Loader label="Analyzing realm signals" /> : null}

      {error ? <ApiOfflineNotice onRetry={() => refetch()} /> : null}

      {data ? (
        <div className="space-y-8">
          <Card accent={overallHealthy ? 'emerald' : 'crimson'} title="Realm Synchronization" description="Service heartbeat across the DLC infrastructure">
            <div className="grid gap-6 md:grid-cols-3">
              {serviceConfig.map((service, index) => {
                const status = data[service.key];
                const Icon = service.icon;

                return (
                  <motion.div
                    key={service.key}
                    initial={{ opacity: 0, translateY: 12 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className={`rounded-xl border px-5 py-6 backdrop-blur ${
                      status
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.25em]">{service.name}</p>
                          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/70">{service.url}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em]">
                        {status ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card accent={overallHealthy ? 'gold' : 'crimson'} title="Diagnostics" description="Current configuration and failsafe values">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <DiagnosticRow label="Environment" value={ENV.APP_ENV.toUpperCase()} />
                <DiagnosticRow label="Version" value={ENV.APP_VERSION} />
                <DiagnosticRow label="API URL" value={ENV.API_URL} />
              </div>
              <div className="space-y-4">
                <DiagnosticRow label="API Timeout" value={`${ENV.API_TIMEOUT}ms`} />
                <DiagnosticRow label="Data Cache" value={ENV.DATA_CACHE ? 'Enabled' : 'Disabled'} />
                <DiagnosticRow label="Debug Panel" value={ENV.ENABLE_DEBUG_PANEL ? 'Enabled' : 'Disabled'} />
              </div>
            </div>
          </Card>

          <Card accent={overallHealthy ? 'emerald' : 'crimson'} title="Alert Feed" description="Aggregated system verdict">
            <div className="space-y-4">
              <div className={`flex items-center justify-between rounded-xl border px-5 py-4 text-sm ${
                overallHealthy
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-100'
              }`}>
                <span className="flex items-center gap-3 text-xs uppercase tracking-[0.3em]">
                  <ShieldAlert className="h-5 w-5" /> Overall Status
                </span>
                <span className="text-xs uppercase tracking-[0.3em]">
                  {overallHealthy ? 'Stable' : 'Degraded'}
                </span>
              </div>
              {serviceConfig.map((service) => (
                <div
                  key={service.key}
                  className="flex items-center justify-between rounded-xl border border-gold/10 bg-charcoal/60 px-5 py-4 text-xs uppercase tracking-[0.3em] text-gray-300"
                >
                  <span>{service.name}</span>
                  <span className={data[service.key] ? 'text-emerald-300' : 'text-rose-300'}>
                    {data[service.key] ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function DiagnosticRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold/10 bg-charcoal/60 px-5 py-4">
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gray-400">{label}</p>
      <p className="mt-2 text-sm text-gray-100">{value}</p>
    </div>
  );
}
