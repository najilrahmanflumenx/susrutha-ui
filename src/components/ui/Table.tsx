'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyText?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyText = 'No data available',
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-primary/10 bg-surface-card shadow-sm">
      <table className="w-full text-left border-collapse font-sans text-sm">
        <thead>
          <tr className="bg-surface-elevated border-b border-primary/10 text-xs uppercase tracking-widest text-primary font-bold">
            {columns.map((col, idx) => (
              <th key={idx} className={cn('px-6 py-4 font-bold', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-text-muted italic"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'hover:bg-primary/5 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={cn('px-6 py-4 text-text-primary', col.className)}>
                    {typeof col.accessorKey === 'function'
                      ? col.accessorKey(row)
                      : (row[col.accessorKey] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
