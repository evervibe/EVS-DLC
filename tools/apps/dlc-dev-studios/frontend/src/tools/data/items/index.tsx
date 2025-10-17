import { useState } from 'react';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/tools/data/items/hooks';
import { TItem, CreateTItemDto, UpdateTItemDto } from '@/tools/data/items/types';
import { TableView } from '@/tools/ui/components/TableView';
import { Button } from '@/tools/ui/components/Button';
import { FormModal } from '@/tools/ui/components/FormModal';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function ItemsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);

  const { data: items = [], isLoading, error } = useItems();
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const { register, handleSubmit, reset } = useForm<CreateTItemDto>();

  const onCreateSubmit = async (data: CreateTItemDto) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      reset();
    } catch (err) {
      console.error('Failed to create item:', err);
    }
  };

  const onUpdateSubmit = async (data: UpdateTItemDto) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, data });
      setEditingItem(null);
      reset();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const onDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
  };

  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'code' as const, label: 'Code' },
    { key: 'name' as const, label: 'Name' },
    { key: 'type' as const, label: 'Type' },
    { key: 'level' as const, label: 'Level' },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (item: TItem) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingItem(item);
              reset(item);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item.id)}
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
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-gray-600">Manage game items (t_item)</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Item
        </Button>
      </div>

      <TableView
        columns={columns}
        data={items}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        emptyMessage="No items found. Create your first item to get started."
      />

      {/* Create Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create Item"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code *</label>
            <input
              {...register('code', { required: true })}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              placeholder="ITEM_001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Sword of Power"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              {...register('type', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              {...register('level', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              placeholder="10"
            />
          </div>
        </form>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={!!editingItem}
        onClose={() => {
          setEditingItem(null);
          reset();
        }}
        title="Edit Item"
        onSubmit={handleSubmit(onUpdateSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code *</label>
            <input
              {...register('code', { required: true })}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              {...register('type', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              {...register('level', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </form>
      </FormModal>
    </div>
  );
}
