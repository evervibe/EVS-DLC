import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/components/ui/FormModal';
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
      reset(defaultValues ?? {});
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Forge Level' : 'Refine Level'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Forge' : 'Commit changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="label-field">Skill Index</label>
          <input
            type="number"
            {...register('a_skillIndex', {
              valueAsNumber: true,
              required: 'Skill index required',
            })}
            className="mt-2 w-full input-field"
            placeholder="Skill reference"
          />
          {errors.a_skillIndex && <p className="form-hint mt-2">{errors.a_skillIndex.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Level</label>
            <input type="number" {...register('a_level', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
          <div>
            <label className="label-field">Target</label>
            <input type="number" {...register('a_target', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Value</label>
            <input type="number" {...register('a_value', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
          <div>
            <label className="label-field">Learn Level</label>
            <input
              type="number"
              {...register('a_learnLevel', { valueAsNumber: true })}
              className="mt-2 w-full input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Required HP</label>
            <input type="number" {...register('a_needHP', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
          <div>
            <label className="label-field">Required MP</label>
            <input type="number" {...register('a_needMP', { valueAsNumber: true })} className="mt-2 w-full input-field" />
          </div>
        </div>

        <div>
          <label className="label-field">Notes</label>
          <textarea
            {...register('a_desc')}
            className="mt-2 w-full input-field"
            placeholder="Optional notes"
            rows={3}
          />
        </div>
      </div>
    </FormModal>
  );
}
