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
      title="Delete String"
      onSubmit={onConfirm}
      submitLabel="Delete"
      isSubmitting={isLoading}
    >
      <p className="text-sm text-gray-600">
        Delete string entry <span className="font-semibold">{name || 'record'}</span>? Applications referencing this key
        will show empty text.
      </p>
    </FormModal>
  );
}
