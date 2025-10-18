import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/components/ui/FormModal';
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
      title={mode === 'create' ? 'Forge Skill' : 'Refine Skill'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Forge' : 'Commit changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="label-field">Skill ID</label>
          <input
            type="number"
            {...register('a_index', {
              valueAsNumber: true,
              required: 'Skill ID is required',
            })}
            className="mt-2 w-full input-field"
            placeholder="Unique skill index"
            disabled={mode === 'edit'}
          />
          {errors.a_index && <p className="form-hint mt-2">{errors.a_index.message}</p>}
        </div>

        <div>
          <label className="label-field">Name</label>
          <input
            {...register('a_name', { required: 'Skill name is required' })}
            className="mt-2 w-full input-field"
            placeholder="Skill name"
          />
          {errors.a_name && <p className="form-hint mt-2">{errors.a_name.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Job</label>
            <input type="number" {...register('a_job', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
          <div>
            <label className="label-field">Type</label>
            <input type="number" {...register('a_type', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Max Level</label>
            <input
              type="number"
              {...register('a_maxLevel', { valueAsNumber: true })}
              className="mt-2 w-full input-field"
            />
          </div>
          <div>
            <label className="label-field">Target Type</label>
            <input
              type="number"
              {...register('a_targetType', { valueAsNumber: true })}
              className="mt-2 w-full input-field"
            />
          </div>
        </div>

        <div>
          <label className="label-field">Description</label>
          <textarea
            {...register('a_descr')}
            className="mt-2 w-full input-field"
            placeholder="Skill description"
            rows={3}
          />
        </div>
      </div>
    </FormModal>
  );
}
