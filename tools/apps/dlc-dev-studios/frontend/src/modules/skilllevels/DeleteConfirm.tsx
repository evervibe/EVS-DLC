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
      title="Delete Skill Level"
      onSubmit={onConfirm}
      submitLabel="Delete"
      isSubmitting={isLoading}
    >
      <p className="text-sm text-gray-600">
        Remove skill level <span className="font-semibold">{name || 'entry'}</span>? Progression data will be lost.
      </p>
    </FormModal>
  );
}
