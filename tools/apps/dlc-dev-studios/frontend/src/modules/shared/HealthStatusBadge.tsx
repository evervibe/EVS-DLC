import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { checkHealth } from '@/core/api/health';

export function HealthStatusBadge() {
  const { data, isLoading } = useQuery({
    queryKey: ['health-status'],
    queryFn: checkHealth,
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-charcoal/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold/70">
        <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
        Calibrating
      </div>
    );
  }

  const isHealthy = data?.api && data?.redis && data?.db;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
        isHealthy
          ? 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
          : 'border border-rose-400/40 bg-rose-500/10 text-rose-200'
      }`}
    >
      <Sparkles className="h-4 w-4" />
      {isHealthy ? 'All systems stable' : 'Issues detected'}
    </motion.div>
  );
}
