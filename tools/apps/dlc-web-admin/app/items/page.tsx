'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ErrorBox } from '@/components/ui/error-box';
import { ApiOfflineNotice } from '@/components/feedback/api-offline-notice';
import { Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function fetchItems() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';
  const response = await fetch(`${baseUrl}/data/t_item`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch items');
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

export default function ItemsPage() {
  const [search, setSearch] = useState('');
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const filteredItems = items?.filter((item: any) =>
    search ? item.a_name?.toLowerCase().includes(search.toLowerCase()) ||
             item.a_name_usa?.toLowerCase().includes(search.toLowerCase()) : true
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
            <div className="rounded-full bg-amber-500/20 p-3">
              <Package className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Items Management
              </h1>
              <p className="mt-2 text-gray-400">
                Manage game items, weapons, armor, and consumables
              </p>
            </div>
          </div>
        </div>

        <Card title="Items List" description="Browse and manage all items">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader size="lg" />
            </div>
          )}

          {error && (
            <ErrorBox title="Failed to load items">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </ErrorBox>
          )}

          {!isLoading && !error && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Showing {filteredItems.length} of {items?.length || 0} items
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Name (USA)</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Level</th>
                      <th className="pb-3 pr-4">Price</th>
                      <th className="pb-3 pr-4">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item: any) => (
                      <tr
                        key={item.a_index}
                        className="border-b border-gray-800 text-sm hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 pr-4 text-gray-300">{item.a_index}</td>
                        <td className="py-3 pr-4 text-gray-100 font-medium">
                          {item.a_name || '-'}
                        </td>
                        <td className="py-3 pr-4 text-gray-300">
                          {item.a_name_usa || '-'}
                        </td>
                        <td className="py-3 pr-4 text-gray-300">{item.a_type_idx}</td>
                        <td className="py-3 pr-4 text-gray-300">{item.a_level}</td>
                        <td className="py-3 pr-4 text-amber-400">{item.a_price}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                              item.a_enable
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {item.a_enable ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredItems.length === 0 && !error && (
                <div className="py-12 text-center text-gray-500">
                  {search ? 'No items match your search' : 'No items found'}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
