import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/components/ui/FormModal';
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
      title={mode === 'create' ? 'Summon Item' : 'Refine Item'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Summon' : 'Commit changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="label-field">Name</label>
          <input
            {...register('a_name', { required: 'Name is required' })}
            className="mt-2 w-full input-field"
            placeholder="Item name"
          />
          {errors.a_name && (
            <p className="form-hint mt-2">{errors.a_name.message}</p>
          )}
        </div>

        <div>
          <label className="label-field">Name (USA)</label>
          <input
            {...register('a_name_usa')}
            className="mt-2 w-full input-field"
            placeholder="Localized name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Type Index</label>
            <input
              type="number"
              {...register('a_type_idx', { valueAsNumber: true })}
              className="mt-2 w-full input-field"
            />
          </div>
          <div>
            <label className="label-field">Level</label>
            <input
              type="number"
              {...register('a_level', { valueAsNumber: true })}
              className="mt-2 w-full input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Price</label>
            <input
              type="number"
              {...register('a_price', { valueAsNumber: true })}
              className="mt-2 w-full input-field"
            />
          </div>
          <div>
            <label className="label-field">Enabled</label>
            <select
              {...register('a_enable', { valueAsNumber: true })}
              className="mt-2 w-full input-select"
            >
              <option value={1}>Enabled</option>
              <option value={0}>Disabled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-field">Description</label>
          <textarea
            {...register('a_descr')}
            className="mt-2 w-full input-field"
            rows={3}
            placeholder="Short description"
          />
        </div>
      </div>
    </FormModal>
  );
}
