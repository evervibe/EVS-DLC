'use client';

import { useState, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { StatusError } from '@/components/ui/status-error';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { Globe, ArrowLeft, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { fetchStrings, type StringsListParams } from './_actions/strings.actions';

export default function StringsPage() {
  const [filters, setFilters] = useState<StringsListParams>({
    limit: 50,
    offset: 0,
    orderBy: 'a_index',
    orderDir: 'ASC',
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['strings', filters],
    queryFn: () => fetchStrings(filters),
  });

  const strings = data?.data || [];
  const meta = data?.meta || { total: 0, limit: 50, offset: 0 };

  const handleFilterChange = (key: keyof StringsListParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  const handlePageChange = (newOffset: number) => {
    setFilters((prev) => ({ ...prev, offset: newOffset }));
  };

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
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-rose-500/20 p-3">
                <Globe className="h-8 w-8 text-rose-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
                  Localization Strings
                </h1>
                <p className="mt-2 text-gray-400">
                  Manage game text and translations with workflow
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href="/strings/review">
                <Button variant="secondary" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Review Queue
                </Button>
              </Link>
              <Link href="/strings/import">
                <Button variant="secondary" size="sm">
                  Import CSV
                </Button>
              </Link>
              <Link href="/strings/export">
                <Button variant="secondary" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card title="Strings" description="Browse and manage localization strings" accent="crimson">
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={filters.q || ''}
              onChange={(e) => handleFilterChange('q', e.target.value || undefined)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
            </select>
            
            <select
              value={filters.langMissing || ''}
              onChange={(e) => handleFilterChange('langMissing', e.target.value || undefined)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">No Language Filter</option>
              <option value="usa">Missing: English (USA)</option>
              <option value="ger">Missing: German</option>
              <option value="spn">Missing: Spanish</option>
              <option value="frc">Missing: French</option>
              <option value="jpn">Missing: Japanese</option>
            </select>
            
            <select
              value={filters.limit || 50}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

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
              <div className="text-sm text-gray-400 mb-4 flex justify-between items-center">
                <span>
                  Showing {meta.offset + 1} - {Math.min(meta.offset + meta.limit, meta.total)} of {meta.total} strings
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={meta.offset === 0}
                    onClick={() => handlePageChange(Math.max(0, meta.offset - (filters.limit || 50)))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={meta.offset + meta.limit >= meta.total}
                    onClick={() => handlePageChange(meta.offset + (filters.limit || 50))}
                  >
                    Next
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                      <th className="pb-3 pr-4 w-20">ID</th>
                      <th className="pb-3 pr-4 w-24">Status</th>
                      <th className="pb-3 pr-4">English</th>
                      <th className="pb-3 pr-4">German</th>
                      <th className="pb-3 pr-4 w-32">Version</th>
                      <th className="pb-3 pr-4 w-32">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strings.map((str: any) => {
                      const status = str.meta?.status || 'draft';
                      const statusColors = {
                        draft: 'bg-gray-500/20 text-gray-300',
                        review: 'bg-yellow-500/20 text-yellow-300',
                        approved: 'bg-green-500/20 text-green-300',
                      };
                      
                      return (
                        <tr
                          key={str.a_index}
                          className="border-b border-gray-800 text-sm hover:bg-gray-800/50 transition-colors cursor-pointer"
                          onClick={() => {
                            // TODO: Open edit drawer
                            console.log('Edit string:', str.a_index);
                          }}
                        >
                          <td className="py-3 pr-4 text-gray-300">{str.a_index}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${statusColors[status as keyof typeof statusColors]}`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-gray-300 max-w-xs truncate">
                            {str.a_string_usa || '-'}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 max-w-xs truncate">
                            {str.a_string_ger || '-'}
                          </td>
                          <td className="py-3 pr-4 text-gray-400 text-xs">
                            v{str.meta?.version || 1}
                          </td>
                          <td className="py-3 pr-4 text-gray-400 text-xs">
                            {str.meta?.updated_by || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {strings.length === 0 && !error && (
                <div className="py-12 text-center text-gray-500">
                  {filters.q || filters.status || filters.langMissing
                    ? 'No strings match your filters'
                    : 'No strings found'}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
