'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { getExportPreview, publishExport } from '../_actions/strings.actions';

export default function ExportPage() {
  const [preview, setPreview] = useState<any>(null);
  const [version, setVersion] = useState('1.4.0');
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);

  const handlePreview = () => {
    startTransition(async () => {
      try {
        const data = await getExportPreview();
        setPreview(data.data);
      } catch (error) {
        console.error('Preview failed:', error);
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      try {
        const data = await publishExport(version, notes);
        setResult(data.data);
      } catch (error) {
        console.error('Publish failed:', error);
      }
    });
  };

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
            <div className="rounded-full bg-green-500/20 p-3">
              <Download className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Export Strings
              </h1>
              <p className="mt-2 text-gray-400">
                Generate deterministic .load file for game integration
              </p>
            </div>
          </div>
        </div>

        {!preview && !result && (
          <Card title="Export Preview" description="Check what will be exported" accent="emerald">
            <div className="space-y-6">
              <p className="text-gray-300">
                Preview the export to see approved strings count and statistics before generating files.
              </p>
              <Button onClick={handlePreview} disabled={isPending}>
                {isPending ? <Loader size="sm" className="mr-2" /> : <FileText className="mr-2 h-4 w-4" />}
                Generate Preview
              </Button>
            </div>
          </Card>
        )}

        {preview && !result && (
          <Card title="Export Details" description="Ready to publish" accent="emerald">
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400">{preview.rowCount}</div>
                  <div className="text-sm text-gray-400">Approved Strings</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400">{preview.locales?.length || 0}</div>
                  <div className="text-sm text-gray-400">Languages</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 col-span-2">
                  <div className="text-xs font-mono text-gray-400 break-all">{preview.hash}</div>
                  <div className="text-sm text-gray-400">Content Hash</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="1.4.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    rows={3}
                    placeholder="What's new in this export..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handlePublish} disabled={isPending || !version}>
                    {isPending ? <Loader size="sm" className="mr-2" /> : <Download className="mr-2 h-4 w-4" />}
                    Publish Export
                  </Button>
                  <Button variant="secondary" onClick={() => setPreview(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {result && (
          <Card title="Export Complete" description="Files generated successfully" accent="emerald">
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-2">✓ Export published successfully!</p>
                <p className="text-sm text-gray-300">Version: {result.version}</p>
                <p className="text-sm text-gray-300">Location: {result.exportDir}</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-300">Generated Files:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="font-mono">• strings.load ({result.manifest?.rowCount} rows)</li>
                  <li className="font-mono">• manifest.json</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setPreview(null); setResult(null); }}>
                  Export Again
                </Button>
                <Link href="/strings">
                  <Button variant="ghost">
                    Back to Strings
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
