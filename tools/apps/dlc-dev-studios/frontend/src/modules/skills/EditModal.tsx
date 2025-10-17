import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/tools/ui/components/FormModal';
import { CreateTSkillDto } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTSkillDto) => void;
  defaultValues?: CreateTSkillDto;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function EditModal({ isOpen, onClose, onSubmit, defaultValues, mode, isSubmitting }: EditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTSkillDto>({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues ?? { a_index: undefined });
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Skill' : 'Edit Skill'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Create' : 'Save changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Skill ID</label>
          <input
            type="number"
            {...register('a_index', {
              valueAsNumber: true,
              required: 'Skill ID is required',
            })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Unique skill index"
            disabled={mode === 'edit'}
          />
          {errors.a_index && <p className="mt-1 text-sm text-red-600">{errors.a_index.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('a_name', { required: 'Skill name is required' })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Skill name"
          />
          {errors.a_name && <p className="mt-1 text-sm text-red-600">{errors.a_name.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job</label>
            <input
              type="number"
              {...register('a_job', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="number"
              {...register('a_type', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Level</label>
            <input
              type="number"
              {...register('a_maxLevel', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Type</label>
            <input
              type="number"
              {...register('a_targetType', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Client Description</label>
          <textarea
            {...register('a_client_description')}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            rows={3}
            placeholder="Optional description"
          />
        </div>
      </div>
    </FormModal>
  );
}
