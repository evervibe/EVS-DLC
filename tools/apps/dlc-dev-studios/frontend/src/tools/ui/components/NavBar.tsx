import { Link } from 'react-router-dom';
import { Database, Zap, Users, Languages, Settings, LayoutDashboard } from 'lucide-react';

export function NavBar() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/items', label: 'Items', icon: Database },
    { to: '/skills', label: 'Skills', icon: Zap },
    { to: '/skilllevels', label: 'Skill Levels', icon: Users },
    { to: '/strings', label: 'Strings', icon: Languages },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="border-b bg-secondary text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DLC Web Admin</span>
          <span className="ml-2 rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
            v{import.meta.env.VITE_APP_VERSION || '0.0.1-alpha'}
          </span>
        </div>
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-white/10"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
