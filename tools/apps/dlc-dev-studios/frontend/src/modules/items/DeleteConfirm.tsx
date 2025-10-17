import { FormModal } from '@/tools/ui/components/FormModal';

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
      title="Delete Item"
      onSubmit={onConfirm}
      submitLabel="Delete"
      isSubmitting={isLoading}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <span className="font-semibold">{name || 'this item'}</span>? This action
        cannot be undone.
      </p>
    </FormModal>
  );
}
