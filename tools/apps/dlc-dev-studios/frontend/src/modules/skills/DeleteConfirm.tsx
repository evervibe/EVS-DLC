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
      title="Delete Skill"
      onSubmit={onConfirm}
      submitLabel="Delete"
      isSubmitting={isLoading}
    >
      <p className="text-sm text-gray-600">
        Do you really want to delete <span className="font-semibold">{name || 'this skill'}</span>? This action is
        irreversible.
      </p>
    </FormModal>
  );
}
