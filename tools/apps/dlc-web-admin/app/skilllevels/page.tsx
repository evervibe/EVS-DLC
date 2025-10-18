'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { StatusError } from '@/components/ui/status-error';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { Database, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function fetchSkillLevels() {
  const response = await fetch('/api/dlc/data/t_skilllevel', {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const error: any = new Error('Failed to fetch skill levels');
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }
  
  const result = await response.json();
  // Handle wrapped response format: { success: true, data: [...] }
  if (result?.success && Array.isArray(result.data)) {
    return result.data;
  }
  // Handle direct array response
  if (Array.isArray(result)) {
    return result;
  }
  return [];
}

export default function SkillLevelsPage() {
  const { data: skillLevels, isLoading, error, refetch } = useQuery({
    queryKey: ['skilllevels'],
    queryFn: fetchSkillLevels,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <ApiOfflineNotice />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-500/20 p-3">
              <Database className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Skill Levels
              </h1>
              <p className="mt-2 text-gray-400">
                Manage skill progression and level data
              </p>
            </div>
          </div>
        </div>

        <Card title="Skill Levels" description="Browse skill level configurations" accent="emerald">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          )}

          {error && (
            <StatusError 
              error={error instanceof Error ? error : new Error('Unknown error occurred')}
              onRetry={() => refetch()}
            />
          )}

          {!isLoading && !error && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Total: {skillLevels?.length || 0} skill levels
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Skill ID</th>
                      <th className="pb-3 pr-4">Level</th>
                      <th className="pb-3 pr-4">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillLevels?.map((level: any) => {
                      const uniqueKey = level.a_index || `${level.a_skill_idx}-${level.a_level}`;
                      const previewText = level.a_descr || level.a_name || Object.keys(level).slice(0, 3).join(', ');
                      
                      return (
                        <tr
                          key={uniqueKey}
                          className="border-b border-gray-800 text-sm hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 pr-4 text-gray-300">{level.a_index || '-'}</td>
                          <td className="py-3 pr-4 text-gray-100">{level.a_skill_idx || '-'}</td>
                          <td className="py-3 pr-4 text-emerald-400">{level.a_level || '-'}</td>
                          <td className="py-3 pr-4 text-gray-300 text-xs">
                            {previewText.substring(0, 50)}{previewText.length > 50 ? '...' : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {(!skillLevels || skillLevels.length === 0) && !error && (
                <div className="py-12 text-center text-gray-500">
                  No skill levels found
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
