import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal } from '@/components/ui/FormModal';
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
      reset(defaultValues ?? {});
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Forge String' : 'Refine String'}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={mode === 'create' ? 'Forge' : 'Commit changes'}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label className="label-field">Default String</label>
          <textarea
            rows={3}
            {...register('a_string', { required: 'String content required' })}
            className="mt-2 w-full input-field"
            placeholder="Base localization"
          />
          {errors.a_string && <p className="form-hint mt-2">{errors.a_string.message}</p>}
        </div>

        <div>
          <label className="label-field">English</label>
          <textarea rows={3} {...register('a_string_usa')} className="mt-2 w-full input-field" placeholder="EN" />
        </div>

        <div>
          <label className="label-field">German</label>
          <textarea rows={3} {...register('a_string_ger')} className="mt-2 w-full input-field" placeholder="DE" />
        </div>

        <div>
          <label className="label-field">Traditional Chinese</label>
          <textarea rows={3} {...register('a_string_twn')} className="mt-2 w-full input-field" placeholder="ZH-TW" />
        </div>
      </div>
    </FormModal>
  );
}
