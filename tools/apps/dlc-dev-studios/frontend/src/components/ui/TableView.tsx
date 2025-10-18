import { ReactNode } from 'react';
import { Loader } from './Loader';
import { ErrorBox } from './ErrorBox';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => ReactNode;
  alignment?: 'left' | 'center' | 'right';
  width?: string;
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
    return <Loader label="Summoning entries" />;
  }

  if (error) {
    return <ErrorBox message={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel border-gold/10 p-10 text-center text-sm text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gold/10 shadow-inner-ring">
      <table className="w-full min-w-[720px] border-separate border-spacing-0">
        <thead className="bg-charcoal/60 text-xs uppercase tracking-[0.2em] text-gold/80">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="border-b border-gold/10 px-6 py-3 text-left"
                style={{ textAlign: column.alignment ?? 'left', width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, itemIndex) => (
            <tr
              key={item.id}
              className="bg-charcoal/40 text-sm text-gray-200 transition hover:bg-charcoal/70"
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={String(column.key)}
                  className="border-b border-gold/5 px-6 py-4"
                  style={{
                    textAlign: column.alignment ?? 'left',
                    borderBottomWidth: itemIndex === data.length - 1 ? 0 : undefined,
                  }}
                >
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
