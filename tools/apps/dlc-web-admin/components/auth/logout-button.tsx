'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="text-gray-400 hover:text-gray-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
