import { useQuery } from '@tanstack/react-query';
import { Card } from '@/tools/ui/components/Card';
import { Loader } from '@/tools/ui/components/Loader';
import { ErrorBox } from '@/tools/ui/components/ErrorBox';
import { api } from '@/api/client';
import { Database, Zap, Users, Languages } from 'lucide-react';

export function DashboardPage() {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      try {
        const response = await api.get('/healthz');
        return response.data;
      } catch (err) {
        throw new Error('Failed to fetch health status');
      }
    },
  });

  const stats = [
    { label: 'Items', icon: Database, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Skills', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Skill Levels', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Strings', icon: Languages, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to DLC Web Admin Interface</p>
      </div>

      <Card title="API Health Status">
        {isLoading && <Loader />}
        {error && <ErrorBox message={error instanceof Error ? error.message : 'Error loading health status'} />}
        {healthData && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="font-medium">API is healthy</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Connected to: {import.meta.env.VITE_API_URL || 'http://localhost:4000'}</p>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
