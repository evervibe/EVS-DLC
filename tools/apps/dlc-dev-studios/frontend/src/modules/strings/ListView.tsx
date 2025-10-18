import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, PencilLine, Pencil, Check, XCircle, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableView } from '@/components/ui/TableView';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/feedback/ToastContext';
import { HealthStatusBadge } from '../shared/HealthStatusBadge';
import { ApiOfflineNotice } from '../shared/ApiOfflineNotice';
import { useCreateString, useDeleteString, useStringList, useUpdateString } from './hooks';
import { CreateTStringDto, StringListParams, TString, UpdateTStringDto } from './types';
import { EditModal } from './EditModal';
import { DeleteConfirm } from './DeleteConfirm';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type StringRow = TString & { id: number };

export function StringsListView() {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalString, setModalString] = useState<TString | null>(null);
  const [deleteStringItem, setDeleteStringItem] = useState<TString | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const params: StringListParams = useMemo(
    () => ({
      page,
      pageSize,
      search: debouncedSearch.trim() || undefined,
    }),
    [page, pageSize, debouncedSearch],
  );

  const listQuery = useStringList(params);
  const isApiUnavailable = listQuery.isError;
  const createMutation = useCreateString();
  const updateMutation = useUpdateString();
  const deleteMutation = useDeleteString();

  const inlineForm = useForm<UpdateTStringDto>();

  const isEditingRow = (row: StringRow) => inlineEditId === row.a_index;

  const beginInlineEdit = (record: TString) => {
    setInlineEditId(record.a_index);
    inlineForm.reset({
      a_string: record.a_string ?? '',
      a_string_usa: record.a_string_usa ?? '',
      a_string_ger: record.a_string_ger ?? '',
      a_string_twn: record.a_string_twn ?? '',
    });
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
    inlineForm.reset({});
  };

  const submitInlineEdit = inlineForm.handleSubmit(async (values) => {
    if (!inlineEditId) {
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: inlineEditId, payload: values });
      addToast('String updated', 'success');
      cancelInlineEdit();
    } catch (error) {
      console.error(error);
      addToast('Failed to update string', 'error');
    }
  });

  const handleCreate = async (values: CreateTStringDto) => {
    try {
      await createMutation.mutateAsync(values);
      addToast('String created', 'success');
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      addToast('Failed to create string', 'error');
    }
  };

  const handleModalUpdate = async (values: CreateTStringDto) => {
    if (!modalString) {
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: modalString.a_index, payload: values });
      addToast('String updated', 'success');
      setModalString(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to update string', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteStringItem) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteStringItem.a_index);
      addToast('String deleted', 'success');
      setDeleteStringItem(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to delete string', 'error');
    }
  };

  const total = listQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * pageSize, total);

  const rows: StringRow[] = (listQuery.data?.data ?? []).map((entry) => ({
    ...entry,
    id: entry.a_index,
  }));

  const textAreaClassName = 'w-full resize-none input-field focus:ring-2 focus:ring-gold/40';

  const columns = [
    { key: 'a_index' as const, label: 'ID' },
    {
      key: 'a_string' as const,
      label: 'Default',
      render: (row: StringRow) =>
        isEditingRow(row) ? (
          <textarea
            rows={2}
            className={textAreaClassName}
            {...inlineForm.register('a_string', { required: true })}
          />
        ) : (
          row.a_string || '—'
        ),
    },
    {
      key: 'a_string_usa' as const,
      label: 'English',
      render: (row: StringRow) =>
        isEditingRow(row) ? (
          <textarea
            rows={2}
            className={textAreaClassName}
            {...inlineForm.register('a_string_usa', { required: true })}
          />
        ) : (
          row.a_string_usa || '—'
        ),
    },
    {
      key: 'a_string_ger' as const,
      label: 'German',
      render: (row: StringRow) =>
        isEditingRow(row) ? (
          <textarea
            rows={2}
            className={textAreaClassName}
            {...inlineForm.register('a_string_ger')}
          />
        ) : (
          row.a_string_ger || '—'
        ),
    },
    {
      key: 'a_string_twn' as const,
      label: 'Traditional Chinese',
      render: (row: StringRow) =>
        isEditingRow(row) ? (
          <textarea
            rows={2}
            className={textAreaClassName}
            {...inlineForm.register('a_string_twn')}
          />
        ) : (
          row.a_string_twn || '—'
        ),
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (row: StringRow) => (
        <div className="flex items-center gap-2">
          {isEditingRow(row) ? (
            <>
              <Button size="sm" variant="primary" onClick={submitInlineEdit} disabled={updateMutation.isPending}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelInlineEdit}>
                <XCircle className="h-4 w-4 text-rose-300" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => beginInlineEdit(row)}>
              <PencilLine className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setModalString(row)}>
            <span className="sr-only">Edit details</span>
            <Pencil className="h-4 w-4 text-gold" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteStringItem(row)}>
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
          <h1 className="font-display text-2xl uppercase tracking-[0.4em] text-gold">Translation Archives</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Manage localization entries (t_string)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HealthStatusBadge />
          <Button onClick={() => setIsCreateOpen(true)} disabled={isApiUnavailable} className="gap-2">
            <Plus className="h-4 w-4" /> Add String
          </Button>
        </div>
      </header>

      {isApiUnavailable ? (
        <ApiOfflineNotice onRetry={() => listQuery.refetch()} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-full border border-gold/30 bg-charcoal/70 py-2 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
                placeholder="Search strings..."
              />
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              <span>Results per page</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
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

          <TableView<StringRow>
            columns={columns}
            data={rows}
            isLoading={listQuery.isLoading}
            error={listQuery.error instanceof Error ? listQuery.error.message : null}
            emptyMessage={search ? 'No strings match your search.' : 'No strings found.'}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-gray-400">
            <p>
              Showing {rangeStart} – {rangeEnd} of {total} strings
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
        </>
      )}

      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
        isSubmitting={createMutation.isPending}
      />

      <EditModal
        isOpen={!!modalString}
        onClose={() => setModalString(null)}
        onSubmit={handleModalUpdate}
        mode="edit"
        defaultValues={modalString || undefined}
        isSubmitting={updateMutation.isPending}
      />

      <DeleteConfirm
        isOpen={!!deleteStringItem}
        onClose={() => setDeleteStringItem(null)}
        onConfirm={handleDelete}
        name={
          deleteStringItem
            ? deleteStringItem.a_string ?? deleteStringItem.a_string_usa ?? `#${deleteStringItem.a_index}`
            : undefined
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
