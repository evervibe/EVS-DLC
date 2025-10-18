'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  accent?: 'gold' | 'accent' | 'emerald' | 'crimson';
  bleed?: boolean;
}

const accentMap: Record<NonNullable<CardProps['accent']>, string> = {
  gold: 'from-amber-400/40 to-amber-400/10 text-amber-400',
  accent: 'from-blue-400/40 to-blue-400/10 text-blue-400',
  emerald: 'from-emerald-400/60 to-emerald-400/10 text-emerald-300',
  crimson: 'from-rose-500/60 to-rose-500/10 text-rose-300',
};

export function Card({
  children,
  className,
  title,
  description,
  accent = 'gold',
  bleed = false,
}: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur shadow-lg',
        bleed ? '' : 'p-6',
        className,
      )}
    >
      {title ? (
        <div className={cn('mb-4 flex flex-col gap-2', bleed ? 'p-6 pb-4' : '')}>
          <div
            className={cn(
              'inline-flex w-max items-center gap-2 rounded-full bg-gradient-to-r px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
              accentMap[accent],
            )}
          >
            {title}
          </div>
          {description ? (
            <p className="text-sm text-gray-300">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={cn('flex-1', bleed ? 'p-6 pt-0' : '')}>{children}</div>
    </motion.section>
  );
}
