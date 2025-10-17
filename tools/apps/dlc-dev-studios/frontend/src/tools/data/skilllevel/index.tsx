import { useState } from 'react';
import { useSkillLevels, useCreateSkillLevel, useUpdateSkillLevel, useDeleteSkillLevel } from '@/tools/data/skilllevel/hooks';
import { TSkillLevel, CreateTSkillLevelDto, UpdateTSkillLevelDto } from '@/tools/data/skilllevel/types';
import { TableView } from '@/tools/ui/components/TableView';
import { Button } from '@/tools/ui/components/Button';
import { FormModal } from '@/tools/ui/components/FormModal';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function SkillLevelsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSkillLevel, setEditingSkillLevel] = useState<TSkillLevel | null>(null);

  const { data: skillLevels = [], isLoading, error } = useSkillLevels();
  const createMutation = useCreateSkillLevel();
  const updateMutation = useUpdateSkillLevel();
  const deleteMutation = useDeleteSkillLevel();

  const { register, handleSubmit, reset } = useForm<CreateTSkillLevelDto>();

  const onCreateSubmit = async (data: CreateTSkillLevelDto) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      reset();
    } catch (err) {
      console.error('Failed to create skill level:', err);
    }
  };

  const onUpdateSubmit = async (data: UpdateTSkillLevelDto) => {
    if (!editingSkillLevel) return;
    try {
      await updateMutation.mutateAsync({ id: editingSkillLevel.id, data });
      setEditingSkillLevel(null);
      reset();
    } catch (err) {
      console.error('Failed to update skill level:', err);
    }
  };

  const onDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this skill level?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete skill level:', err);
      }
    }
  };

  const columns = [
    { key: 'id' as const, label: 'ID' },
    { key: 'skill_id' as const, label: 'Skill ID' },
    { key: 'level' as const, label: 'Level' },
    { key: 'required_exp' as const, label: 'Required Exp' },
    { key: 'effect_value' as const, label: 'Effect Value' },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (skillLevel: TSkillLevel) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingSkillLevel(skillLevel);
              reset(skillLevel);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(skillLevel.id)}
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
          <h1 className="text-3xl font-bold">Skill Levels</h1>
          <p className="text-gray-600">Manage skill levels (t_skilllevel)</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Skill Level
        </Button>
      </div>

      <TableView
        columns={columns}
        data={skillLevels}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        emptyMessage="No skill levels found. Create your first skill level to get started."
      />

      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create Skill Level"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Skill ID *</label>
            <input
              {...register('skill_id', { required: true, valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level *</label>
            <input
              {...register('level', { required: true, valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Required Exp</label>
            <input
              {...register('required_exp', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Effect Value</label>
            <input
              {...register('effect_value', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={!!editingSkillLevel}
        onClose={() => {
          setEditingSkillLevel(null);
          reset();
        }}
        title="Edit Skill Level"
        onSubmit={handleSubmit(onUpdateSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Skill ID *</label>
            <input
              {...register('skill_id', { required: true, valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level *</label>
            <input
              {...register('level', { required: true, valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Required Exp</label>
            <input
              {...register('required_exp', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Effect Value</label>
            <input
              {...register('effect_value', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </form>
      </FormModal>
    </div>
  );
}
