'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDryRun, setIsDryRun] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    // TODO: Implement import logic
    console.log('Importing file:', file.name, 'Dry run:', isDryRun);
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
            <div className="rounded-full bg-blue-500/20 p-3">
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Import Strings
              </h1>
              <p className="mt-2 text-gray-400">
                Bulk import from CSV or XLSX files
              </p>
            </div>
          </div>
        </div>

        <Card title="Upload File" description="Import localization strings from CSV/XLSX" accent="accent">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-4">
                {file ? `Selected: ${file.name}` : 'Drop your CSV or XLSX file here, or click to browse'}
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="secondary" size="sm">
                  Choose File
                </Button>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="dry-run"
                checked={isDryRun}
                onChange={(e) => setIsDryRun(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
              />
              <label htmlFor="dry-run" className="text-gray-300 text-sm">
                Dry run (preview changes without committing)
              </label>
            </div>

            <Button
              onClick={handleImport}
              disabled={!file}
              className="w-full"
            >
              {isDryRun ? 'Preview Import' : 'Import Now'}
            </Button>

            <div className="text-sm text-gray-500 space-y-2">
              <p className="font-semibold">File Format:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>First column must be &apos;a_index&apos;</li>
                <li>Language columns: usa, ger, spn, frc, jpn, etc.</li>
                <li>Tab-separated or comma-separated</li>
                <li>UTF-8 encoding</li>
                <li>Max 255 characters per field</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
