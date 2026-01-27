/**
 * OptimizedTable Component
 * Memoized table with virtualization support for large datasets
 */

import React, { memo, useMemo, useCallback, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  className?: string;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  className?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
}

// Memoized table row component
const TableRowMemo = memo(function TableRowMemo<T>({
  item,
  columns,
  onRowClick,
  rowClassName,
}: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
}) {
  const handleClick = useCallback(() => {
    onRowClick?.(item);
  }, [item, onRowClick]);

  return (
    <TableRow
      className={cn(
        onRowClick && 'cursor-pointer hover:bg-muted/50',
        rowClassName?.(item)
      )}
      onClick={handleClick}
    >
      {columns.map((column, colIndex) => (
        <TableCell
          key={column.key}
          className={column.className}
          style={{ width: column.width }}
        >
          {column.render
            ? column.render(item, colIndex)
            : (item as Record<string, unknown>)[column.key] as React.ReactNode}
        </TableCell>
      ))}
    </TableRow>
  );
}) as <T>(props: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
}) => React.ReactElement;

// Skeleton loading rows
const SkeletonRow = memo(function SkeletonRow({
  columnCount,
}: {
  columnCount: number;
}) {
  return (
    <TableRow>
      {Array.from({ length: columnCount }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
});

function OptimizedTableComponent<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'কোনো ডেটা নেই',
  pageSize = 10,
  showPagination = true,
  className,
  onRowClick,
  rowClassName,
}: OptimizedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!showPagination) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize, showPagination]);

  // Reset to first page when data changes significantly
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('rounded-md border', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width }}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} columnCount={columns.length} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={cn('rounded-md border p-8 text-center', className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width }}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRowMemo
                key={keyExtractor(item)}
                item={item}
                columns={columns}
                onRowClick={onRowClick}
                rowClassName={rowClassName}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            মোট {data.length} টি আইটেম থেকে {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, data.length)} দেখানো হচ্ছে
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export memoized version
export const OptimizedTable = memo(OptimizedTableComponent) as typeof OptimizedTableComponent;
