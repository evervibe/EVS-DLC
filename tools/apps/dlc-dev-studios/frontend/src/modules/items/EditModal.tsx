import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/tools/ui/components/FormModal';
import { CreateTItemDto } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTItemDto) => void;
  defaultValues?: CreateTItemDto;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function EditModal({ isOpen, onClose, onSubmit, defaultValues, mode, isSubmitting }: EditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTItemDto>({
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues ?? {});
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Item' : 'Edit Item'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Create' : 'Save changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('a_name', { required: 'Name is required' })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Item name"
          />
          {errors.a_name && (
            <p className="mt-1 text-sm text-red-600">{errors.a_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name (USA)</label>
          <input
            {...register('a_name_usa')}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Localized name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type Index</label>
            <input
              type="number"
              {...register('a_type_idx', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              type="number"
              {...register('a_level', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              {...register('a_price', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Enabled</label>
            <select
              {...register('a_enable', { valueAsNumber: true })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value={1}>Enabled</option>
              <option value={0}>Disabled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('a_descr')}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            rows={3}
            placeholder="Short description"
          />
        </div>
      </div>
    </FormModal>
  );
}
