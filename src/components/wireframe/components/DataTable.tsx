import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: any) => void;
  isDark?: boolean;
}

export function DataTable({
  columns,
  data,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
  isDark = true
}: DataTableProps) {
  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark ? 'border-slate-700' : 'border-gray-200'
    }`}>
      <Table>
        <TableHeader>
          <TableRow className={isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}>
            {columns.map((col) => (
              <TableHead key={col.key} className="font-semibold">
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && (
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow 
              key={idx}
              className={`cursor-pointer transition-colors ${
                isDark ? 'hover:bg-slate-800/50 border-slate-700' : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className={`flex items-center justify-between px-4 py-3 border-t ${
        isDark ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'
      }`}>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
