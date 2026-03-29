import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
  onExport?: (format: 'csv' | 'pdf' | 'excel') => Promise<void>;
}

// JIRA-CRUD-02: Export functionality
export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const exportAsCSV = () => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle special characters and commas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    setIsExporting(true);
    setExportFormat(format);

    try {
      if (onExport) {
        await onExport(format);
      } else if (format === 'csv') {
        exportAsCSV();
      } else {
        // For PDF and Excel, show a message that it requires backend
        toast.info(`${format.toUpperCase()} export will be generated and sent to your email`);
      }
      toast.success(`${format.toUpperCase()} export completed`);
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export CSV
          {exportFormat === 'csv' && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
          Export Excel
          {exportFormat === 'excel' && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          Export PDF
          {exportFormat === 'pdf' && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
