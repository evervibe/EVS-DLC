'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ErrorBox } from '@/components/ui/error-box';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function fetchSkills() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';
  const response = await fetch(`${baseUrl}/data/t_skill`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
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

export default function SkillsPage() {
  const [search, setSearch] = useState('');
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });

  const filteredSkills = skills?.filter((skill: any) =>
    search ? skill.a_name?.toLowerCase().includes(search.toLowerCase()) : true
  ) || [];

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
            <div className="rounded-full bg-blue-500/20 p-3">
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Skills Management
              </h1>
              <p className="mt-2 text-gray-400">
                Manage abilities, spells, and character skills
              </p>
            </div>
          </div>
        </div>

        <Card title="Skills List" description="Browse and manage all skills" accent="accent">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          )}

          {error && (
            <ErrorBox title="Failed to load skills">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </ErrorBox>
          )}

          {!isLoading && !error && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Showing {filteredSkills.length} of {skills?.length || 0} skills
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Level</th>
                      <th className="pb-3 pr-4">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkills.map((skill: any) => (
                      <tr
                        key={skill.a_index}
                        className="border-b border-gray-800 text-sm hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 pr-4 text-gray-300">{skill.a_index}</td>
                        <td className="py-3 pr-4 text-gray-100 font-medium">
                          {skill.a_name || '-'}
                        </td>
                        <td className="py-3 pr-4 text-gray-300">{skill.a_type_idx || '-'}</td>
                        <td className="py-3 pr-4 text-gray-300">{skill.a_level || '-'}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                              skill.a_enable
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {skill.a_enable ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredSkills.length === 0 && !error && (
                <div className="py-12 text-center text-gray-500">
                  {search ? 'No skills match your search' : 'No skills found'}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
