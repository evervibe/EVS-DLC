import { useState } from 'react';
import { useStrings, useCreateString, useUpdateString, useDeleteString } from '@/tools/data/strings/hooks';
import { TString, CreateTStringDto, UpdateTStringDto } from '@/tools/data/strings/types';
import { TableView } from '@/tools/ui/components/TableView';
import { Button } from '@/tools/ui/components/Button';
import { FormModal } from '@/tools/ui/components/FormModal';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function StringsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingString, setEditingString] = useState<TString | null>(null);

  const { data: strings = [], isLoading, error } = useStrings();
  const createMutation = useCreateString();
  const updateMutation = useUpdateString();
  const deleteMutation = useDeleteString();

  const { register, handleSubmit, reset } = useForm<CreateTStringDto>();

  const onCreateSubmit = async (data: CreateTStringDto) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      reset();
    } catch (err) {
      console.error('Failed to create string:', err);
    }
  };

  const onUpdateSubmit = async (data: UpdateTStringDto) => {
    if (!editingString) return;
    try {
      await updateMutation.mutateAsync({ id: editingString.id, data });
      setEditingString(null);
      reset();
    } catch (err) {
      console.error('Failed to update string:', err);
    }
  };

  const onDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this string?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete string:', err);
      }
    }
  };

  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'key' as const, label: 'Key' },
    { key: 'value' as const, label: 'Value' },
    { key: 'language' as const, label: 'Language' },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (str: TString) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingString(str);
              reset(str);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(str.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Strings</h1>
          <p className="text-gray-600">Manage localization strings (t_string)</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create String
        </Button>
      </div>

      <TableView
        columns={columns}
        data={strings}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        emptyMessage="No strings found. Create your first string to get started."
      />

      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create String"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Key *</label>
            <input
              {...register('key', { required: true })}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <textarea
              {...register('value')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <input
              {...register('language')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              placeholder="en, de, es, etc."
            />
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={!!editingString}
        onClose={() => {
          setEditingString(null);
          reset();
        }}
        title="Edit String"
        onSubmit={handleSubmit(onUpdateSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Key *</label>
            <input
              {...register('key', { required: true })}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <textarea
              {...register('value')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <input
              {...register('language')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </form>
      </FormModal>
    </div>
  );
}
