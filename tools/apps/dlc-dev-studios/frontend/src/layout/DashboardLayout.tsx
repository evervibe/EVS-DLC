import { useMemo, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Activity,
  Database,
  LayoutDashboard,
  Languages,
  Menu,
  Settings,
  ShieldCheck,
  Swords,
  Users,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENV } from '@/core/config/env';

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/health', label: 'Health', icon: ShieldCheck },
  { to: '/items', label: 'Items', icon: Database },
  { to: '/skills', label: 'Skills', icon: Swords },
  { to: '/skilllevels', label: 'Skill Levels', icon: Users },
  { to: '/strings', label: 'Strings', icon: Languages },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const appName = useMemo(() => ENV.APP_NAME || 'DLC Web Admin', []);
  const appVersion = useMemo(() => ENV.APP_VERSION || '1.0.0-alpha', []);

  return (
    <div className="flex min-h-screen bg-brand-gradient text-gray-100">
      <aside className="hidden w-72 flex-col border-r border-gold/20 bg-charcoal/70 px-6 py-8 shadow-gold-glow lg:flex">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="font-display text-2xl uppercase tracking-[0.6em] text-gold">{appName}</div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Command Console</p>
          </div>
          <div className="gold-divider" />
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition',
                    isActive
                      ? 'bg-gold/10 text-gold shadow-gold-glow'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gold',
                  ].join(' ')
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto space-y-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          <p className="text-gold/80">v{appVersion}</p>
          <div className="gold-divider" />
          <p>EverVibe Studios · DLC Admin Network</p>
        </div>
      </aside>

      <AnimatePresence>
        {isSidebarOpen ? (
          <motion.div
            key="mobile-sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="relative z-10 flex w-72 flex-col border-r border-gold/20 bg-charcoal/95 px-6 py-8"
            >
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute right-4 top-4 rounded-full border border-gold/20 p-1 text-gold/80"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-6 pt-6">
                <div className="font-display text-xl uppercase tracking-[0.5em] text-gold">{appName}</div>
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition',
                          isActive
                            ? 'bg-gold/10 text-gold shadow-gold-glow'
                            : 'text-gray-400 hover:bg-white/5 hover:text-gold',
                        ].join(' ')
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-gold/10 bg-charcoal/70 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 text-gold transition hover:border-gold hover:text-gold lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold/60">EverVibe Command Deck</p>
                <h1 className="font-display text-2xl uppercase tracking-[0.5em] text-gold">
                  DLC Admin Observatory
                </h1>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400 sm:flex">
              <Activity className="h-4 w-4 text-gold" />
              <span>Realm Status: Operational</span>
            </div>
          </div>
        </header>

        <main className="relative flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-gold/10 bg-charcoal/80 py-5 text-center text-xs uppercase tracking-[0.3em] text-gold/70">
          DLC Web Admin – v1.0.0-alpha © EverVibe Studios
        </footer>
      </div>
    </div>
  );
}
