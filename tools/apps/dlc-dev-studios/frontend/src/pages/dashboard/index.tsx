import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Database, Languages, ShieldCheck, Swords, Users } from 'lucide-react';
import { AxiosResponse } from 'axios';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorBox } from '@/components/ui/ErrorBox';
import { apiClient } from '@/core/api/apiClient';
import { unwrapResponse } from '@/core/api/utils';
import { ENV } from '@/core/config/env';
import { ApiResponse } from '@/core/api/types';

interface HealthResponse {
  status: string;
  version?: string;
  timestamp?: string;
  databases?: Record<string, boolean>;
}

interface ListResponseMeta {
  total?: number;
}

interface DashboardData {
  health: HealthResponse;
  stats: {
    items: number | null;
    skills: number | null;
    skillLevels: number | null;
    strings: number | null;
  };
  errors: string[];
}

const overviewQuery = async (): Promise<DashboardData> => {
  const [healthResult, itemsResult, skillsResult, levelsResult, stringsResult] = await Promise.allSettled([
    apiClient.get<HealthResponse>('/health'),
    apiClient.get('/data/t_item', { params: { limit: 1, offset: 0 } }),
    apiClient.get('/data/t_skill', { params: { limit: 1, offset: 0 } }),
    apiClient.get('/data/t_skilllevel', { params: { limit: 1, offset: 0 } }),
    apiClient.get('/data/t_string', { params: { limit: 1, offset: 0 } }),
  ]);

  if (healthResult.status === 'rejected') {
    throw new Error('Unable to reach the DLC API health endpoint');
  }

  const parseTotal = (
    result: PromiseSettledResult<AxiosResponse<ApiResponse<unknown, ListResponseMeta>>>,
  ) => {
    if (result.status !== 'fulfilled') return null;

    try {
      const payload = unwrapResponse<unknown, ListResponseMeta>(result.value);
      return payload.meta?.total ?? null;
    } catch (error) {
      console.warn('Failed to parse dashboard total', error);
      return null;
    }
  };

  const stats = {
    items: parseTotal(itemsResult as PromiseSettledResult<AxiosResponse<ApiResponse<unknown, ListResponseMeta>>>),
    skills: parseTotal(skillsResult as PromiseSettledResult<AxiosResponse<ApiResponse<unknown, ListResponseMeta>>>),
    skillLevels: parseTotal(levelsResult as PromiseSettledResult<AxiosResponse<ApiResponse<unknown, ListResponseMeta>>>),
    strings: parseTotal(stringsResult as PromiseSettledResult<AxiosResponse<ApiResponse<unknown, ListResponseMeta>>>),
  };

  const errors: string[] = [];

  if (itemsResult.status === 'rejected') errors.push('Items data unreachable');
  if (skillsResult.status === 'rejected') errors.push('Skills data unreachable');
  if (levelsResult.status === 'rejected') errors.push('Skill levels data unreachable');
  if (stringsResult.status === 'rejected') errors.push('Strings data unreachable');

  return {
    health: healthResult.value.data,
    stats,
    errors,
  };
};

const statusColorMap: Record<string, string> = {
  ok: 'from-emerald-400/70 to-emerald-400/20 text-emerald-200',
  degraded: 'from-amber-400/70 to-amber-400/20 text-amber-100',
  critical: 'from-rose-500/70 to-rose-500/20 text-rose-200',
};

const statsConfig = [
  {
    key: 'items' as const,
    label: 'Items',
    icon: Database,
    accent: 'gold' as const,
    description: 'Catalogued artifacts',
  },
  {
    key: 'skills' as const,
    label: 'Skills',
    icon: Swords,
    accent: 'accent' as const,
    description: 'Known abilities',
  },
  {
    key: 'skillLevels' as const,
    label: 'Skill Levels',
    icon: Users,
    accent: 'emerald' as const,
    description: 'Progression tiers',
  },
  {
    key: 'strings' as const,
    label: 'Strings',
    icon: Languages,
    accent: 'crimson' as const,
    description: 'Localization entries',
  },
];

export function DashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: overviewQuery,
    refetchInterval: 60_000,
  });

  const healthStatus = useMemo(() => data?.health.status?.toLowerCase() ?? 'unknown', [data?.health.status]);
  const statusColor = statusColorMap[healthStatus] ?? statusColorMap.degraded;
  const timestamp = data?.health.timestamp ? new Date(data.health.timestamp) : null;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card accent="accent" className="lg:col-span-2" title="Health Beacon" description="Live status of the DLC realm">
          {isLoading ? (
            <Loader label="Calibrating health runes" />
          ) : error ? (
            <ErrorBox message={(error as Error).message} onRetry={() => refetch()} />
          ) : data ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-r px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${statusColor}`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{healthStatus === 'ok' ? 'All systems stable' : `Status: ${healthStatus}`}</span>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-400">
                  <Activity className={`h-4 w-4 ${healthStatus === 'ok' ? 'text-emerald-300' : 'text-amber-300'}`} />
                  <span>Connected to {ENV.API_URL}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(data.health.databases ?? {}).map(([name, status]) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="rounded-lg border border-gold/10 bg-charcoal/60 px-4 py-3 text-sm text-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="uppercase tracking-[0.25em] text-gray-400">{name}</span>
                      <span
                        className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                          status
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : 'bg-rose-500/20 text-rose-200'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${status ? 'bg-emerald-300' : 'bg-rose-300'}`} />
                        {status ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                {timestamp ? `Updated ${timestamp.toLocaleString()}` : 'Awaiting synchronization'}
              </div>
            </div>
          ) : null}
        </Card>

        <Card accent="gold" title="Realm Pulse" description="High-level overview of admin telemetry">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
              <span>App version</span>
              <span className="text-gold">{ENV.APP_VERSION}</span>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
              <span>Environment</span>
              <span className="text-gold">{ENV.APP_ENV.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
              <span>API latency</span>
              <span className="text-gold">{isFetching ? 'Recalibrating…' : 'Nominal'}</span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold transition hover:text-amber-200"
            >
              Re-sync data
            </button>
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl uppercase tracking-[0.5em] text-gold">Domain Archives</h2>
          {data?.errors.length ? (
            <span className="text-xs uppercase tracking-[0.3em] text-amber-300">
              {data.errors.join(' • ')}
            </span>
          ) : null}
        </div>
        {isLoading ? (
          <Loader label="Summoning realm stats" />
        ) : error ? (
          <ErrorBox message={(error as Error).message} onRetry={() => refetch()} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {statsConfig.map((stat, index) => {
              const Icon = stat.icon;
              const value = data?.stats[stat.key];
              return (
                <Card
                  key={stat.key}
                  accent={stat.accent}
                  className="p-0"
                  bleed
                  title={stat.label}
                  description={stat.description}
                >
                  <motion.div
                    initial={{ opacity: 0, translateY: 12 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-10 w-10 text-gold" />
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-400">entries</span>
                    </div>
                    <div className="text-4xl font-bold text-gold">
                      {value !== null && value !== undefined ? value.toLocaleString() : '—'}
                    </div>
                    <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Synced via {ENV.API_URL}</div>
                  </motion.div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
