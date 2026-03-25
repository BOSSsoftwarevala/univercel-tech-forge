import React, { memo, useCallback, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: number;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  headerHeight?: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  getRowKey?: (item: T, index: number) => string | number;
  emptyMessage?: string;
}

function VirtualizedTableInner<T extends Record<string, unknown>>({
  data,
  columns,
  rowHeight = 48,
  headerHeight = 52,
  className,
  onRowClick,
  getRowKey = (_, index) => index,
  emptyMessage = 'No data available'
}: VirtualizedTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(500);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Calculate visible range
  const overscan = 5;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(data.length, startIndex + visibleCount);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(current => {
      if (current?.key !== key) return { key, direction: 'asc' };
      if (current.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  }, []);

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height - headerHeight);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [headerHeight]);

  const totalHeight = data.length * rowHeight;
  const visibleData = sortedData.slice(startIndex, endIndex);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative rounded-xl border border-cyan-500/20 bg-slate-900/50 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-10 flex bg-slate-800/90 backdrop-blur-sm border-b border-cyan-500/20"
        style={{ height: headerHeight }}
      >
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className={cn(
              "flex items-center px-4 font-medium text-cyan-400 text-sm",
              column.sortable && "cursor-pointer hover:bg-cyan-500/10 transition-colors"
            )}
            style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
            onClick={() => column.sortable && handleSort(String(column.key))}
          >
            {column.header}
            {sortConfig?.key === column.key && (
              <span className="ml-2 text-cyan-300">
                {sortConfig.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Body */}
      <div
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              {emptyMessage}
            </div>
          ) : (
            visibleData.map((item, i) => {
              const actualIndex = startIndex + i;
              return (
                <div
                  key={getRowKey(item, actualIndex)}
                  className={cn(
                    "absolute left-0 right-0 flex items-center border-b border-slate-700/50",
                    "hover:bg-cyan-500/5 transition-colors cursor-pointer",
                    actualIndex % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/20"
                  )}
                  style={{
                    height: rowHeight,
                    top: actualIndex * rowHeight,
                  }}
                  onClick={() => onRowClick?.(item, actualIndex)}
                >
                  {columns.map((column) => (
                    <div
                      key={String(column.key)}
                      className="px-4 text-sm text-slate-300 truncate"
                      style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
                    >
                      {column.render 
                        ? column.render(item, actualIndex)
                        : String(item[column.key as keyof T] ?? '')
                      }
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-2 right-4 text-xs text-cyan-500/60">
        {data.length.toLocaleString()} rows | Showing {startIndex + 1}-{Math.min(endIndex, data.length)}
      </div>
    </div>
  );
}

export const VirtualizedTable = memo(VirtualizedTableInner) as typeof VirtualizedTableInner;
