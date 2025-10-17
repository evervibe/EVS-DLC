import { Outlet } from 'react-router-dom';
import { NavBar } from '@/tools/ui/components/NavBar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-4 text-center text-sm text-gray-600">
        <p>
          DLC Web Admin - v{import.meta.env.VITE_APP_VERSION || '0.0.1-alpha'} - EverVibe Studios
        </p>
      </footer>
    </div>
  );
}
