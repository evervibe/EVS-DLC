import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          DLC Web Admin
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          EverVibe Studios Development Interface
        </p>
        <div className="mb-8">
          <Link href="/dashboard">
            <Button size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          Version 1.3.0 - Next.js 15 + React 19
        </div>
      </div>
    </div>
  );
}
