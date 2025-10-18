'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReviewQueuePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/strings">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Strings
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-500/20 p-3">
              <CheckCircle className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Review Queue
              </h1>
              <p className="mt-2 text-gray-400">
                Approve or reject strings pending review
              </p>
            </div>
          </div>
        </div>

        <Card title="Pending Reviews" description="Strings waiting for approval" accent="gold">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-4">Review Queue - Coming Soon</p>
            <p className="text-sm">This feature will allow batch approval/rejection of strings in review status.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
