import { useState } from 'react';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/tools/data/skills/hooks';
import { TSkill, CreateTSkillDto, UpdateTSkillDto } from '@/tools/data/skills/types';
import { TableView } from '@/tools/ui/components/TableView';
import { Button } from '@/tools/ui/components/Button';
import { FormModal } from '@/tools/ui/components/FormModal';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function SkillsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<TSkill | null>(null);

  const { data: skills = [], isLoading, error } = useSkills();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  const { register, handleSubmit, reset } = useForm<CreateTSkillDto>();

  const onCreateSubmit = async (data: CreateTSkillDto) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      reset();
    } catch (err) {
      console.error('Failed to create skill:', err);
    }
  };

  const onUpdateSubmit = async (data: UpdateTSkillDto) => {
    if (!editingSkill) return;
    try {
      await updateMutation.mutateAsync({ id: editingSkill.id, data });
      setEditingSkill(null);
      reset();
    } catch (err) {
      console.error('Failed to update skill:', err);
    }
  };

  const onDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete skill:', err);
      }
    }
  };

  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'code' as const, label: 'Code' },
    { key: 'name' as const, label: 'Name' },
    { key: 'description' as const, label: 'Description' },
    { key: 'max_level' as const, label: 'Max Level' },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (skill: TSkill) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingSkill(skill);
              reset(skill);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(skill.id)}
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
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-gray-600">Manage game skills (t_skill)</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Skill
        </Button>
      </div>

      <TableView
        columns={columns}
        data={skills}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        emptyMessage="No skills found. Create your first skill to get started."
      />

      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create Skill"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Level</label>
            <input
              {...register('max_level', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={!!editingSkill}
        onClose={() => {
          setEditingSkill(null);
          reset();
        }}
        title="Edit Skill"
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Level</label>
            <input
              {...register('max_level', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </form>
      </FormModal>
    </div>
  );
}
