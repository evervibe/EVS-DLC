import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/tools/ui/components/FormModal';
import { CreateTSkillLevelDto } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTSkillLevelDto) => void;
  defaultValues?: CreateTSkillLevelDto;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function EditModal({ isOpen, onClose, onSubmit, defaultValues, mode, isSubmitting }: EditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTSkillLevelDto>({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues ?? { a_index: undefined });
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Skill Level' : 'Edit Skill Level'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Create' : 'Save changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Level ID</label>
          <input
            type="number"
            {...register('a_index', { valueAsNumber: true, required: 'Level ID is required' })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Unique level index"
            disabled={mode === 'edit'}
          />
          {errors.a_index && <p className="mt-1 text-sm text-red-600">{errors.a_index.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              type="number"
              {...register('a_level', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Required HP</label>
            <input
              type="number"
              {...register('a_needHP', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Required MP</label>
            <input
              type="number"
              {...register('a_needMP', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Required GP</label>
            <input
              type="number"
              {...register('a_needGP', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Learn Level</label>
          <input
            type="number"
            {...register('a_learnLevel', { valueAsNumber: true })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </FormModal>
  );
}
