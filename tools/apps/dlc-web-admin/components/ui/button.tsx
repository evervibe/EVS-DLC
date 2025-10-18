'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-gray-900 shadow-lg shadow-amber-500/40 hover:from-amber-400 hover:to-amber-400 focus-visible:ring-amber-400/70',
  secondary:
    'bg-gray-800 text-gray-100 border border-amber-500/40 hover:border-amber-500 focus-visible:ring-amber-500/50',
  ghost:
    'bg-transparent text-gray-200 hover:bg-white/10 focus-visible:ring-amber-400/40',
  danger:
    'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/40 hover:from-rose-500 hover:to-rose-500 focus-visible:ring-rose-400/70',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-wide',
  md: 'px-4 py-2 text-sm tracking-[0.15em]',
  lg: 'px-6 py-3 text-base tracking-[0.2em] uppercase',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, block, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-60',
          variantStyles[variant],
          sizeStyles[size],
          block ? 'w-full' : '',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
