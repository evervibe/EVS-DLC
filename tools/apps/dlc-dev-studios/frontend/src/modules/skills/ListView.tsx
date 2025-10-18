import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, PencilLine, Pencil, Check, XCircle, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableView } from '@/components/ui/TableView';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/feedback/ToastContext';
import { HealthStatusBadge } from '../shared/HealthStatusBadge';
import { ApiOfflineNotice } from '../shared/ApiOfflineNotice';
import { useCreateSkill, useDeleteSkill, useSkillList, useUpdateSkill } from './hooks';
import { CreateTSkillDto, SkillListParams, TSkill, UpdateTSkillDto } from './types';
import { EditModal } from './EditModal';
import { DeleteConfirm } from './DeleteConfirm';

interface SkillRow extends TSkill {
  id: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function SkillsListView() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const debouncedSearch = useDebounce(search, 400);

  const params: SkillListParams = useMemo(
    () => ({ page, pageSize, search: debouncedSearch.trim() || undefined }),
    [page, pageSize, debouncedSearch],
  );

  const listQuery = useSkillList(params);
  const isApiUnavailable = listQuery.isError;
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalSkill, setModalSkill] = useState<TSkill | null>(null);
  const [deleteSkill, setDeleteSkill] = useState<TSkill | null>(null);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);

  const inlineForm = useForm<UpdateTSkillDto>();

  const handleInlineEdit = (skill: TSkill) => {
    setInlineEditId(skill.a_index);
    inlineForm.reset({
      a_name: skill.a_name ?? '',
      a_job: skill.a_job,
      a_type: skill.a_type,
      a_maxLevel: skill.a_maxLevel,
      a_targetType: skill.a_targetType,
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
      addToast('Skill updated', 'success');
      cancelInlineEdit();
    } catch (error) {
      console.error(error);
      addToast('Failed to update skill', 'error');
    }
  });

  const handleCreate = async (values: CreateTSkillDto) => {
    try {
      await createMutation.mutateAsync(values);
      addToast('Skill created', 'success');
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      addToast('Failed to create skill', 'error');
    }
  };

  const handleModalUpdate = async (values: CreateTSkillDto) => {
    if (!modalSkill) return;
    try {
      await updateMutation.mutateAsync({ id: modalSkill.a_index, payload: values });
      addToast('Skill updated', 'success');
      setModalSkill(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to update skill', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteSkill) return;
    try {
      await deleteMutation.mutateAsync(deleteSkill.a_index);
      addToast('Skill deleted', 'success');
      setDeleteSkill(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to delete skill', 'error');
    }
  };

  const total = listQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * pageSize, total);

  const rows: SkillRow[] = (listQuery.data?.data ?? []).map((skill) => ({
    ...skill,
    id: skill.a_index,
  }));

  const columns = [
    { key: 'a_index' as const, label: 'ID' },
    {
      key: 'a_name' as const,
      label: 'Name',
      render: (skill: SkillRow) =>
        inlineEditId === skill.a_index ? (
          <input
            className="w-full input-field"
            {...inlineForm.register('a_name', { required: true })}
          />
        ) : (
          skill.a_name || '—'
        ),
    },
    {
      key: 'a_job' as const,
      label: 'Job',
      render: (skill: SkillRow) =>
        inlineEditId === skill.a_index ? (
          <input
            type="number"
            className="w-full input-field"
            {...inlineForm.register('a_job', { valueAsNumber: true })}
          />
        ) : (
          skill.a_job
        ),
    },
    {
      key: 'a_type' as const,
      label: 'Type',
      render: (skill: SkillRow) =>
        inlineEditId === skill.a_index ? (
          <input
            type="number"
            className="w-full input-field"
            {...inlineForm.register('a_type', { valueAsNumber: true })}
          />
        ) : (
          skill.a_type
        ),
    },
    {
      key: 'a_maxLevel' as const,
      label: 'Max Level',
      render: (skill: SkillRow) =>
        inlineEditId === skill.a_index ? (
          <input
            type="number"
            className="w-full input-field"
            {...inlineForm.register('a_maxLevel', { valueAsNumber: true })}
          />
        ) : (
          skill.a_maxLevel
        ),
    },
    {
      key: 'a_targetType' as const,
      label: 'Target Type',
      render: (skill: SkillRow) =>
        inlineEditId === skill.a_index ? (
          <input
            type="number"
            className="w-full input-field"
            {...inlineForm.register('a_targetType', { valueAsNumber: true })}
          />
        ) : (
          skill.a_targetType
        ),
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (skill: SkillRow) => (
        <div className="flex items-center gap-2">
          {inlineEditId === skill.a_index ? (
            <>
              <Button size="sm" variant="primary" onClick={submitInlineEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelInlineEdit}>
                <XCircle className="h-4 w-4 text-rose-300" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => handleInlineEdit(skill)}>
              <PencilLine className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setModalSkill(skill)}>
            <span className="sr-only">Edit details</span>
            <Pencil className="h-4 w-4 text-gold" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteSkill(skill)}>
            <Trash2 className="h-4 w-4 text-rose-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-display text-2xl uppercase tracking-[0.4em] text-gold">Skill Codex</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Manage skill definitions (t_skill)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HealthStatusBadge />
          <Button onClick={() => setIsCreateOpen(true)} disabled={isApiUnavailable} className="gap-2">
            <Plus className="h-4 w-4" /> Add Skill
          </Button>
        </div>
      </header>

      {isApiUnavailable ? (
        <ApiOfflineNotice onRetry={() => listQuery.refetch()} />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-full border border-gold/30 bg-charcoal/70 py-2 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
                placeholder="Search skills..."
              />
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              <span>Results per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-full border border-gold/30 bg-charcoal/70 px-4 py-2 text-sm text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TableView<SkillRow>
            columns={columns}
            data={rows}
            isLoading={listQuery.isLoading}
            error={listQuery.error instanceof Error ? listQuery.error.message : null}
            emptyMessage={search ? 'No skills match your search.' : 'No skills recorded yet.'}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-gray-400">
            <p>
              Showing {rangeStart} – {rangeEnd} of {total} skills
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                size="sm"
              >
                Previous
              </Button>
              <span className="text-gray-300">Page {page} of {totalPages}</span>
              <Button
                variant="ghost"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
        isSubmitting={createMutation.isPending}
      />

      <EditModal
        isOpen={!!modalSkill}
        onClose={() => setModalSkill(null)}
        onSubmit={handleModalUpdate}
        mode="edit"
        defaultValues={modalSkill || undefined}
        isSubmitting={updateMutation.isPending}
      />

      <DeleteConfirm
        isOpen={!!deleteSkill}
        onClose={() => setDeleteSkill(null)}
        onConfirm={handleDelete}
        name={deleteSkill?.a_name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
