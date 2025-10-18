'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ErrorBox } from '@/components/ui/error-box';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { Database, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function fetchSkillLevels() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';
  const response = await fetch(`${baseUrl}/game/skilllevels`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch skill levels');
  }
  
  return response.json();
}

export default function SkillLevelsPage() {
  const { data: skillLevels, isLoading, error } = useQuery({
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
            <ErrorBox title="Failed to load skill levels">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </ErrorBox>
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
                    {skillLevels?.map((level: any, idx: number) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-800 text-sm hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 pr-4 text-gray-300">{level.a_index || idx}</td>
                        <td className="py-3 pr-4 text-gray-100">{level.a_skill_idx || '-'}</td>
                        <td className="py-3 pr-4 text-emerald-400">{level.a_level || '-'}</td>
                        <td className="py-3 pr-4 text-gray-300 text-xs">
                          {JSON.stringify(level).substring(0, 50)}...
                        </td>
                      </tr>
                    ))}
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
