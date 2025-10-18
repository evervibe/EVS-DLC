import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
}: FormModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={onClose} />
      <div
        className={cn(
          'glass-panel relative z-10 w-full max-w-xl overflow-hidden border-gold/20 p-0 text-gray-100',
          'shadow-gold-glow',
        )}
      >
        <div className="flex items-center justify-between border-b border-gold/20 bg-charcoal/80 px-6 py-4">
          <div className="font-display text-lg uppercase tracking-[0.3em] text-gold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-full border border-gold/30 p-1 text-gold/80 transition hover:text-gold"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex justify-end gap-3 border-t border-gold/10 bg-charcoal/70 px-6 py-4">
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onSubmit} disabled={isSubmitting} type="button">
            {isSubmitting ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
