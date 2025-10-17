import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { DashboardPage } from '@/pages/dashboard';
import { ItemsPage } from '@/tools/data/items';
import { SkillsPage } from '@/tools/data/skills';
import { SkillLevelsPage } from '@/tools/data/skilllevel';
import { StringsPage } from '@/tools/data/strings';
import { SettingsPage } from '@/pages/settings';
import { HealthMonitor } from '@/pages/HealthMonitor';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'health',
        element: <HealthMonitor />,
      },
      {
        path: 'items',
        element: <ItemsPage />,
      },
      {
        path: 'skills',
        element: <SkillsPage />,
      },
      {
        path: 'skilllevels',
        element: <SkillLevelsPage />,
      },
      {
        path: 'strings',
        element: <StringsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
