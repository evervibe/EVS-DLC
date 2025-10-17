import { Card } from '@/tools/ui/components/Card';

export function SettingsPage() {
  const envVars = {
    'API URL': import.meta.env.VITE_API_URL || 'http://localhost:30089',
    'App Name': import.meta.env.VITE_APP_NAME || 'DLC Web Admin',
    'App Version': import.meta.env.VITE_APP_VERSION || '0.8.5',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Application configuration and environment</p>
      </div>

      <Card title="Environment Variables">
        <div className="space-y-3">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">{key}</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="API Endpoints">
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-700">Available Endpoints:</p>
          <ul className="list-inside list-disc space-y-1 text-gray-600">
            <li>GET /data/t_item - List all items</li>
            <li>GET /data/t_skill - List all skills</li>
            <li>GET /data/t_skilllevel - List all skill levels</li>
            <li>GET /data/t_string - List all strings</li>
            <li>GET /healthz - API health check</li>
          </ul>
        </div>
      </Card>

      <Card title="About">
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>DLC Web Admin</strong> is a frontend interface for managing DLC API data.
          </p>
          <p>Built with Vite, React 19, TypeScript, and Tailwind CSS.</p>
          <p>© 2025 EverVibe Studios</p>
        </div>
      </Card>
    </div>
  );
}
