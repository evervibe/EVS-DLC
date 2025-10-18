import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-[3px]',
  lg: 'h-14 w-14 border-4',
};

export function Loader({ size = 'md', className, label }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-gold/40 border-t-transparent text-gold',
          sizeMap[size],
          className,
        )}
      />
      {label ? <span className="text-xs uppercase tracking-[0.2em] text-gold/80">{label}</span> : null}
    </div>
  );
}
