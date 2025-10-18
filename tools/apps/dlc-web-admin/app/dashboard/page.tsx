'use client';

import { Card } from '@/components/ui/card';
import { HealthStatusBadge } from '@/components/feedback/health-status-badge';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/ui/loader';
import { Database, Zap, Package, Globe } from 'lucide-react';

async function fetchStats() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';
  
  const [itemsRes, skillsRes, skillLevelsRes, stringsRes] = await Promise.allSettled([
    fetch(`${baseUrl}/game/items`).then(r => r.json()),
    fetch(`${baseUrl}/game/skills`).then(r => r.json()),
    fetch(`${baseUrl}/game/skilllevels`).then(r => r.json()),
    fetch(`${baseUrl}/game/strings`).then(r => r.json()),
  ]);

  return {
    items: itemsRes.status === 'fulfilled' ? (Array.isArray(itemsRes.value) ? itemsRes.value.length : 0) : 0,
    skills: skillsRes.status === 'fulfilled' ? (Array.isArray(skillsRes.value) ? skillsRes.value.length : 0) : 0,
    skillLevels: skillLevelsRes.status === 'fulfilled' ? (Array.isArray(skillLevelsRes.value) ? skillLevelsRes.value.length : 0) : 0,
    strings: stringsRes.status === 'fulfilled' ? (Array.isArray(stringsRes.value) ? stringsRes.value.length : 0) : 0,
  };
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
    refetchInterval: 60_000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <ApiOfflineNotice />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-400">
              EverVibe Studios DLC Development Interface
            </p>
          </div>
          <HealthStatusBadge />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Items" accent="gold">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-500/20 p-3">
                  <Package className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.items || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Items</div>
                </div>
              </div>
            </Card>

            <Card title="Skills" accent="accent">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.skills || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Skills</div>
                </div>
              </div>
            </Card>

            <Card title="Skill Levels" accent="emerald">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-500/20 p-3">
                  <Database className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.skillLevels || 0}
                  </div>
                  <div className="text-sm text-gray-400">Skill Levels</div>
                </div>
              </div>
            </Card>

            <Card title="Strings" accent="crimson">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-rose-500/20 p-3">
                  <Globe className="h-8 w-8 text-rose-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.strings || 0}
                  </div>
                  <div className="text-sm text-gray-400">Localization Strings</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8">
          <Card title="Quick Actions" description="Manage your game data">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/items"
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-amber-500 hover:bg-gray-800"
              >
                <Package className="h-8 w-8 text-amber-400" />
                <span className="text-sm font-medium text-gray-300">Manage Items</span>
              </a>
              <a
                href="/skills"
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-blue-500 hover:bg-gray-800"
              >
                <Zap className="h-8 w-8 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Manage Skills</span>
              </a>
              <a
                href="/skilllevels"
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-emerald-500 hover:bg-gray-800"
              >
                <Database className="h-8 w-8 text-emerald-400" />
                <span className="text-sm font-medium text-gray-300">Skill Levels</span>
              </a>
              <a
                href="/strings"
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-rose-500 hover:bg-gray-800"
              >
                <Globe className="h-8 w-8 text-rose-400" />
                <span className="text-sm font-medium text-gray-300">Localization</span>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
