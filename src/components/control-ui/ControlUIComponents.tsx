import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const SectionCard = ({
  title,
  description,
  icon,
  children,
  className,
  headerAction
}: SectionCardProps) => {
  return (
    <Card className={cn("bg-[#12121a] border-gray-800/50 shadow-lg", className)}>
      <CardHeader className="pb-4 border-b border-gray-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-base font-semibold text-white">{title}</CardTitle>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {headerAction}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 text-gray-500">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-medium text-gray-400">{title}</h4>
      <p className="text-xs text-gray-600 mt-1 max-w-[200px]">{description}</p>
    </div>
  );
};

interface DataTableHeaderProps {
  columns: { label: string; className?: string }[];
}

export const DataTableHeader = ({ columns }: DataTableHeaderProps) => {
  return (
    <div className="sticky top-0 bg-[#0a0a0f] border-b border-gray-800/50 py-2 px-3 z-10">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
        {columns.map((col, idx) => (
          <div 
            key={idx} 
            className={cn("text-[10px] uppercase tracking-wider font-medium text-gray-500", col.className)}
          >
            {col.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export const StatusPill = ({ 
  status, 
  size = 'sm' 
}: { 
  status: 'success' | 'warning' | 'error' | 'info' | 'pending'; 
  size?: 'xs' | 'sm' 
}) => {
  const styles = {
    success: 'bg-green-500/15 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/15 text-red-400 border-red-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    pending: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  };

  const labels = {
    success: 'Active',
    warning: 'Warning',
    error: 'Critical',
    info: 'Info',
    pending: 'Pending',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
        styles[status]
      )}
    >
      <span className={cn(
        "rounded-full mr-1",
        size === 'xs' ? 'w-1 h-1' : 'w-1.5 h-1.5',
        status === 'success' && 'bg-green-400',
        status === 'warning' && 'bg-amber-400',
        status === 'error' && 'bg-red-400',
        status === 'info' && 'bg-blue-400',
        status === 'pending' && 'bg-gray-400',
      )} />
      {labels[status]}
    </span>
  );
};

export const MaskedValue = ({ value, type = 'id' }: { value: string; type?: 'id' | 'email' | 'phone' }) => {
  const masked = React.useMemo(() => {
    if (type === 'email') {
      const [local, domain] = value.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    }
    if (type === 'phone') {
      return `***${value.slice(-4)}`;
    }
    return `${value.slice(0, 6)}...${value.slice(-4)}`;
  }, [value, type]);

  return (
    <span 
      className="font-mono text-xs text-gray-400 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onCopy={(e) => e.preventDefault()}
    >
      {masked}
    </span>
  );
};
