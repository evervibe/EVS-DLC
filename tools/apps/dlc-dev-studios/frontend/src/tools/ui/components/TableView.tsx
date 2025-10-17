import { ReactNode } from 'react';
import { Loader } from './Loader';
import { ErrorBox } from './ErrorBox';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => ReactNode;
}

interface TableViewProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export function TableView<T extends { id: number | string }>({
  columns,
  data,
  isLoading,
  error,
  emptyMessage = 'No data available',
}: TableViewProps<T>) {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorBox message={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-gray-50 p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-900">
                  {column.render
                    ? column.render(item)
                    : column.key !== 'actions'
                    ? String(item[column.key as keyof T] ?? '')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
