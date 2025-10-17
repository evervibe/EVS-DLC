import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, PencilLine, Pencil, Check, XCircle, Trash2, Search } from 'lucide-react';
import { Button } from '@/tools/ui/components/Button';
import { TableView } from '@/tools/ui/components/TableView';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/feedback/ToastContext';
import { HealthStatusBadge } from '../shared/HealthStatusBadge';
import { useCreateSkillLevel, useDeleteSkillLevel, useSkillLevelList, useUpdateSkillLevel } from './hooks';
import {
  CreateTSkillLevelDto,
  SkillLevelListParams,
  TSkillLevel,
  UpdateTSkillLevelDto,
} from './types';
import { EditModal } from './EditModal';
import { DeleteConfirm } from './DeleteConfirm';

interface SkillLevelRow extends TSkillLevel {
  id: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function SkillLevelsListView() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [skillFilter, setSkillFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const debouncedSkill = useDebounce(skillFilter, 300);

  const params: SkillLevelListParams = useMemo(() => {
    const trimmedSkill = debouncedSkill.trim();
    const skillId = trimmedSkill && /^\d+$/.test(trimmedSkill) ? Number(trimmedSkill) : undefined;

    return {
      page,
      pageSize,
      search: debouncedSearch.trim() || undefined,
      skillId,
    };
  }, [page, pageSize, debouncedSearch, debouncedSkill]);

  const listQuery = useSkillLevelList(params);
  const createMutation = useCreateSkillLevel();
  const updateMutation = useUpdateSkillLevel();
  const deleteMutation = useDeleteSkillLevel();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalLevel, setModalLevel] = useState<TSkillLevel | null>(null);
  const [deleteLevel, setDeleteLevel] = useState<TSkillLevel | null>(null);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);

  const inlineForm = useForm<UpdateTSkillLevelDto>();

  const handleInlineEdit = (level: TSkillLevel) => {
    setInlineEditId(level.a_index);
    inlineForm.reset({
      a_level: level.a_level,
      a_needHP: level.a_needHP,
      a_needMP: level.a_needMP,
      a_needGP: level.a_needGP,
      a_learnLevel: level.a_learnLevel,
    });
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
    inlineForm.reset({});
  };

  const submitInlineEdit = inlineForm.handleSubmit(async (values) => {
    if (!inlineEditId) return;
    try {
      await updateMutation.mutateAsync({ id: inlineEditId, payload: values });
      addToast('Skill level updated', 'success');
      cancelInlineEdit();
    } catch (error) {
      console.error(error);
      addToast('Failed to update skill level', 'error');
    }
  });

  const handleCreate = async (values: CreateTSkillLevelDto) => {
    try {
      await createMutation.mutateAsync(values);
      addToast('Skill level created', 'success');
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      addToast('Failed to create skill level', 'error');
    }
  };

  const handleModalUpdate = async (values: CreateTSkillLevelDto) => {
    if (!modalLevel) return;
    try {
      await updateMutation.mutateAsync({ id: modalLevel.a_index, payload: values });
      addToast('Skill level updated', 'success');
      setModalLevel(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to update skill level', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteLevel) return;
    try {
      await deleteMutation.mutateAsync(deleteLevel.a_index);
      addToast('Skill level deleted', 'success');
      setDeleteLevel(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to delete skill level', 'error');
    }
  };

  const total = listQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * pageSize, total);

  const rows: SkillLevelRow[] = (listQuery.data?.data ?? []).map((level) => ({
    ...level,
    id: level.a_index,
  }));

  const columns = [
    { key: 'a_index' as const, label: 'ID' },
    {
      key: 'skill' as const,
      label: 'Skill',
      render: (level: SkillLevelRow) => level.skill?.a_name || level.skill?.a_index || '—',
    },
    {
      key: 'a_level' as const,
      label: 'Level',
      render: (level: SkillLevelRow) =>
        inlineEditId === level.a_index ? (
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            {...inlineForm.register('a_level', { valueAsNumber: true })}
          />
        ) : (
          level.a_level
        ),
    },
    {
      key: 'a_needHP' as const,
      label: 'HP',
      render: (level: SkillLevelRow) =>
        inlineEditId === level.a_index ? (
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            {...inlineForm.register('a_needHP', { valueAsNumber: true })}
          />
        ) : (
          level.a_needHP
        ),
    },
    {
      key: 'a_needMP' as const,
      label: 'MP',
      render: (level: SkillLevelRow) =>
        inlineEditId === level.a_index ? (
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            {...inlineForm.register('a_needMP', { valueAsNumber: true })}
          />
        ) : (
          level.a_needMP
        ),
    },
    {
      key: 'a_learnLevel' as const,
      label: 'Learn Level',
      render: (level: SkillLevelRow) =>
        inlineEditId === level.a_index ? (
          <input
            type="number"
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            {...inlineForm.register('a_learnLevel', { valueAsNumber: true })}
          />
        ) : (
          level.a_learnLevel
        ),
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (level: SkillLevelRow) => (
        <div className="flex items-center gap-2">
          {inlineEditId === level.a_index ? (
            <>
              <Button size="sm" variant="primary" onClick={submitInlineEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelInlineEdit}>
                <XCircle className="h-4 w-4 text-gray-500" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => handleInlineEdit(level)}>
              <PencilLine className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setModalLevel(level)}>
            <span className="sr-only">Edit details</span>
            <Pencil className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteLevel(level)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Skill Levels</h1>
          <p className="text-gray-600">Manage level tuning for skills (t_skilllevel)</p>
        </div>
        <div className="flex items-center gap-3">
          <HealthStatusBadge />
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Skill Level
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-48 rounded-lg border border-gray-300 py-2 pl-10 pr-3"
              placeholder="Search levels..."
            />
          </div>
          <div>
            <label className="mr-2 text-sm text-gray-600">Skill ID</label>
            <input
              value={skillFilter}
              onChange={(e) => {
                setSkillFilter(e.target.value);
                setPage(1);
              }}
              className="w-28 rounded border border-gray-300 px-2 py-2"
              inputMode="numeric"
              placeholder="Any"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>Page size:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded border border-gray-300 px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TableView<SkillLevelRow>
        columns={columns}
        data={rows}
        isLoading={listQuery.isLoading}
        error={listQuery.error instanceof Error ? listQuery.error.message : null}
        emptyMessage={search ? 'No skill levels match your search.' : 'No skill levels found.'}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Showing {rangeStart} - {rangeEnd} of {total} levels
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
        isSubmitting={createMutation.isPending}
      />

      <EditModal
        isOpen={!!modalLevel}
        onClose={() => setModalLevel(null)}
        onSubmit={handleModalUpdate}
        mode="edit"
        defaultValues={modalLevel || undefined}
        isSubmitting={updateMutation.isPending}
      />

      <DeleteConfirm
        isOpen={!!deleteLevel}
        onClose={() => setDeleteLevel(null)}
        onConfirm={handleDelete}
        name={deleteLevel?.skill?.a_name ?? String(deleteLevel?.a_index || '')}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
