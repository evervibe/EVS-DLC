import { FormModal } from '@/components/ui/FormModal';

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name?: string | null;
  isLoading?: boolean;
}

export function DeleteConfirm({ isOpen, onClose, onConfirm, name, isLoading }: DeleteConfirmProps) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Purge String"
      onSubmit={onConfirm}
      submitLabel="Confirm purge"
      isSubmitting={isLoading}
    >
      <p className="text-sm text-rose-200">
        This translation entry{' '}
        <span className="font-semibold text-rose-100">{name || 'selection'}</span> will be erased permanently.
      </p>
    </FormModal>
  );
}
