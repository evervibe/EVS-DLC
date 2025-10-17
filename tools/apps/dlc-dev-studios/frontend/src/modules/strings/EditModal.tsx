import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/tools/ui/components/FormModal';
import { CreateTStringDto } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTStringDto) => void;
  defaultValues?: CreateTStringDto;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function EditModal({ isOpen, onClose, onSubmit, defaultValues, mode, isSubmitting }: EditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTStringDto>({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues ?? { a_index: undefined });
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create String' : 'Edit String'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Create' : 'Save changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">String ID</label>
          <input
            type="number"
            {...register('a_index', { valueAsNumber: true, required: 'String ID is required' })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Unique identifier"
            disabled={mode === 'edit'}
          />
          {errors.a_index && <p className="mt-1 text-sm text-red-600">{errors.a_index.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Default Text</label>
          <textarea
            {...register('a_string', { required: 'Default text is required' })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            rows={3}
            placeholder="Primary string"
          />
          {errors.a_string && <p className="mt-1 text-sm text-red-600">{errors.a_string.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">English (USA)</label>
            <textarea
              {...register('a_string_usa')}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">German</label>
            <textarea
              {...register('a_string_ger')}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              rows={2}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Traditional Chinese</label>
          <textarea
            {...register('a_string_twn')}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            rows={2}
          />
        </div>
      </div>
    </FormModal>
  );
}
