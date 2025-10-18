import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Check, XCircle, Trash2, Search, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableView } from '@/components/ui/TableView';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/feedback/ToastContext';
import { HealthStatusBadge } from '../shared/HealthStatusBadge';
import { ApiOfflineNotice } from '../shared/ApiOfflineNotice';
import { useCreateItem, useDeleteItem, useItemList, useUpdateItem } from './hooks';
import { CreateTItemDto, ItemListParams, TItem, UpdateTItemDto } from './types';
import { EditModal } from './EditModal';
import { DeleteConfirm } from './DeleteConfirm';

interface ItemRow extends TItem {
  id: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function ItemsListView() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const debouncedSearch = useDebounce(search, 400);

  const listParams: ItemListParams = useMemo(
    () => ({ page, pageSize, search: debouncedSearch.trim() || undefined }),
    [page, pageSize, debouncedSearch],
  );

  const listQuery = useItemList(listParams);
  const isApiUnavailable = listQuery.isError;
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalItem, setModalItem] = useState<TItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<TItem | null>(null);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);

  const inlineForm = useForm<UpdateTItemDto>();

  const handleInlineEdit = (item: TItem) => {
    setInlineEditId(item.a_index);
    inlineForm.reset({
      a_name: item.a_name ?? '',
      a_name_usa: item.a_name_usa ?? '',
      a_type_idx: item.a_type_idx,
      a_level: item.a_level,
      a_price: item.a_price,
      a_enable: item.a_enable,
      a_descr: item.a_descr ?? '',
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
      addToast('Item updated', 'success');
      cancelInlineEdit();
    } catch (error) {
      console.error(error);
      addToast('Failed to update item', 'error');
    }
  });

  const handleCreate = async (values: CreateTItemDto) => {
    try {
      await createMutation.mutateAsync(values);
      addToast('Item created', 'success');
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      addToast('Failed to create item', 'error');
    }
  };

  const handleModalUpdate = async (values: CreateTItemDto) => {
    if (!modalItem) return;
    try {
      await updateMutation.mutateAsync({ id: modalItem.a_index, payload: values });
      addToast('Item updated', 'success');
      setModalItem(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to update item', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteMutation.mutateAsync(deleteItem.a_index);
      addToast('Item deleted', 'success');
      setDeleteItem(null);
    } catch (error) {
      console.error(error);
      addToast('Failed to delete item', 'error');
    }
  };

  const total = listQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * pageSize, total);

  const rows: ItemRow[] = (listQuery.data?.data ?? []).map((item) => ({
    ...item,
    id: item.a_index,
  }));

  const columns = [
    { key: 'a_index' as const, label: 'ID' },
    {
      key: 'a_name' as const,
      label: 'Name',
      render: (item: ItemRow) =>
        inlineEditId === item.a_index ? (
          <input
            className="w-full rounded-lg border border-gold/30 bg-charcoal/70 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            {...inlineForm.register('a_name', { required: true })}
          />
        ) : (
          item.a_name || '—'
        ),
    },
    {
      key: 'a_type_idx' as const,
      label: 'Type',
      render: (item: ItemRow) =>
        inlineEditId === item.a_index ? (
          <input
            type="number"
            className="w-full rounded-lg border border-gold/30 bg-charcoal/70 px-3 py-2 text-sm text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            {...inlineForm.register('a_type_idx', { valueAsNumber: true })}
          />
        ) : (
          item.a_type_idx
        ),
    },
    {
      key: 'a_level' as const,
      label: 'Level',
      render: (item: ItemRow) =>
        inlineEditId === item.a_index ? (
          <input
            type="number"
            className="w-full rounded-lg border border-gold/30 bg-charcoal/70 px-3 py-2 text-sm text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            {...inlineForm.register('a_level', { valueAsNumber: true })}
          />
        ) : (
          item.a_level
        ),
    },
    {
      key: 'a_price' as const,
      label: 'Price',
      render: (item: ItemRow) =>
        inlineEditId === item.a_index ? (
          <input
            type="number"
            className="w-full rounded-lg border border-gold/30 bg-charcoal/70 px-3 py-2 text-sm text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            {...inlineForm.register('a_price', { valueAsNumber: true })}
          />
        ) : (
          item.a_price
        ),
    },
    {
      key: 'a_enable' as const,
      label: 'Enabled',
      render: (item: ItemRow) =>
        inlineEditId === item.a_index ? (
          <select
            className="w-full rounded-lg border border-gold/30 bg-charcoal/70 px-3 py-2 text-sm text-gray-100 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            {...inlineForm.register('a_enable', { valueAsNumber: true })}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        ) : item.a_enable === 1 ? (
          'Yes'
        ) : (
          'No'
        ),
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (item: ItemRow) => (
        <div className="flex items-center gap-2">
          {inlineEditId === item.a_index ? (
            <>
              <Button size="sm" variant="primary" onClick={submitInlineEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelInlineEdit}>
                <XCircle className="h-4 w-4 text-gray-500" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => handleInlineEdit(item)}>
                <PencilLine className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setModalItem(item)}>
                <span className="sr-only">Open modal</span>
                <Pencil className="h-4 w-4 text-indigo-600" />
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={() => setDeleteItem(item)}>
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
          <h1 className="font-display text-2xl uppercase tracking-[0.4em] text-gold">Artifact Registry</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Manage game items (t_item)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HealthStatusBadge />
          <Button onClick={() => setIsCreateOpen(true)} disabled={isApiUnavailable} className="gap-2">
            <Plus className="h-4 w-4" /> Summon Item
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
                placeholder="Search artifacts..."
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

          <TableView<ItemRow>
            columns={columns}
            data={rows}
            isLoading={listQuery.isLoading}
            error={listQuery.error instanceof Error ? listQuery.error.message : null}
            emptyMessage={search ? 'No items match your search.' : 'No artifacts recorded yet.'}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-gray-400">
            <p>
              Showing {rangeStart} – {rangeEnd} of {total} artifacts
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
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        onSubmit={handleModalUpdate}
        mode="edit"
        defaultValues={modalItem || undefined}
        isSubmitting={updateMutation.isPending}
      />

      <DeleteConfirm
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        name={deleteItem?.a_name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
