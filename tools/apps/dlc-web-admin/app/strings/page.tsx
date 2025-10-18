'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ErrorBox } from '@/components/ui/error-box';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function fetchStrings() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';
  const response = await fetch(`${baseUrl}/data/t_string`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch strings');
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

export default function StringsPage() {
  const [search, setSearch] = useState('');
  const { data: strings, isLoading, error } = useQuery({
    queryKey: ['strings'],
    queryFn: fetchStrings,
  });

  const filteredStrings = strings?.filter((str: any) =>
    search ? str.a_string_id?.toLowerCase().includes(search.toLowerCase()) ||
             str.a_string?.toLowerCase().includes(search.toLowerCase()) : true
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
            <div className="rounded-full bg-rose-500/20 p-3">
              <Globe className="h-8 w-8 text-rose-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
                Localization Strings
              </h1>
              <p className="mt-2 text-gray-400">
                Manage game text and localization
              </p>
            </div>
          </div>
        </div>

        <Card title="Strings" description="Browse and manage localization strings" accent="crimson">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search strings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          )}

          {error && (
            <ErrorBox title="Failed to load strings">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </ErrorBox>
          )}

          {!isLoading && !error && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Showing {filteredStrings.length} of {strings?.length || 0} strings
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Key</th>
                      <th className="pb-3 pr-4">Value</th>
                      <th className="pb-3 pr-4">Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStrings.map((str: any) => {
                      const uniqueKey = str.a_index || str.a_string_id || `${str.a_language}-${str.a_string?.substring(0, 20)}`;
                      
                      return (
                        <tr
                          key={uniqueKey}
                          className="border-b border-gray-800 text-sm hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 pr-4 text-gray-300">{str.a_index || '-'}</td>
                          <td className="py-3 pr-4 text-gray-100 font-mono text-xs">
                            {str.a_string_id || '-'}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 max-w-md truncate">
                            {str.a_string || '-'}
                          </td>
                          <td className="py-3 pr-4">
                            <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2 py-1 text-xs text-rose-300">
                              {str.a_language || 'EN'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredStrings.length === 0 && !error && (
                <div className="py-12 text-center text-gray-500">
                  {search ? 'No strings match your search' : 'No strings found'}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
