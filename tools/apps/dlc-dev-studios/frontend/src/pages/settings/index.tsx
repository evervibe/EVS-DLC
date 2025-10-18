import { Card } from '@/components/ui/Card';
import { ENV } from '@/core/config/env';

export function SettingsPage() {
  const envVars = {
    'API URL': ENV.API_URL,
    'App Name': ENV.APP_NAME,
    'App Version': ENV.APP_VERSION,
    Environment: ENV.APP_ENV,
    'API Timeout': `${ENV.API_TIMEOUT}ms`,
    'Data Cache': ENV.DATA_CACHE ? 'Enabled' : 'Disabled',
    'Debug Panel': ENV.ENABLE_DEBUG_PANEL ? 'Enabled' : 'Disabled',
  } as const;

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <h1 className="font-display text-2xl uppercase tracking-[0.4em] text-gold">Sanctum Settings</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
          Configuration anchors for the DLC command interface
        </p>
      </header>

      <Card accent="gold" title="Environment Variables" description="Resolved values from the current runtime">
        <div className="space-y-4 text-sm text-gray-200">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/10 bg-charcoal/60 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{key}</span>
              <span className="font-mono text-sm text-gold">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="accent" title="API Endpoints" description="Primary REST entry points for DLC data realms">
        <ul className="space-y-3 text-xs uppercase tracking-[0.3em] text-gray-300">
          <li className="rounded-xl border border-gold/10 bg-charcoal/60 px-4 py-3">GET /data/t_item – List all items</li>
          <li className="rounded-xl border border-gold/10 bg-charcoal/60 px-4 py-3">GET /data/t_skill – List all skills</li>
          <li className="rounded-xl border border-gold/10 bg-charcoal/60 px-4 py-3">GET /data/t_skilllevel – List all skill levels</li>
          <li className="rounded-xl border border-gold/10 bg-charcoal/60 px-4 py-3">GET /data/t_string – List all strings</li>
          <li className="rounded-xl border border-gold/10 bg-charcoal/60 px-4 py-3">GET /health – API health check</li>
        </ul>
      </Card>

      <Card accent="emerald" title="About" description="Versioning and authorship details">
        <div className="space-y-2 text-sm text-gray-200">
          <p>
            <strong className="text-gold">DLC Web Admin</strong> orchestrates EverVibe Studios DLC datasets with a branded
            command deck experience.
          </p>
          <p>Built with Vite 5, React 19, Tailwind CSS 4, and infused with EverVibe gold.</p>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">© {new Date().getFullYear()} EverVibe Studios</p>
        </div>
      </Card>
    </div>
  );
}
