/**
 * STEP 10: CRUD Action Bar Component
 * Provides standard Create/Read/Update/Archive buttons for any entity
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Plus, RefreshCw, Download, Upload, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ActionButton from './ActionButton';
import { ButtonAction, ButtonVariant } from '@/hooks/useSidebarActions';

interface CRUDActionBarProps {
  entityName: string;
  onCreateNew?: () => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  onExport?: () => Promise<void> | void;
  onImport?: () => Promise<void> | void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showCreate?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  createLabel?: string;
  isCreateReady?: boolean;
  isExportReady?: boolean;
  isImportReady?: boolean;
  customButtons?: ButtonAction[];
  onCustomButtonClick?: (buttonId: string) => Promise<void>;
  className?: string;
}

const CRUDActionBar: React.FC<CRUDActionBarProps> = ({
  entityName,
  onCreateNew,
  onRefresh,
  onExport,
  onImport,
  onSearch,
  searchPlaceholder,
  showSearch = true,
  showCreate = true,
  showRefresh = true,
  showExport = true,
  showImport = false,
  createLabel,
  isCreateReady = true,
  isExportReady = true,
  isImportReady = true,
  customButtons = [],
  onCustomButtonClick,
  className
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-4 p-4 bg-card/50 border border-border/50 rounded-lg",
      className
    )}>
      {/* Left: Search */}
      {showSearch && (
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder={searchPlaceholder || `Search ${entityName}...`}
            className="pl-10 bg-background"
          />
        </div>
      )}

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Custom Buttons */}
        {customButtons.map(button => (
          <ActionButton
            key={button.id}
            actionId={`${entityName}-${button.id}`}
            label={button.label}
            buttonVariant={button.variant}
            onClick={async () => onCustomButtonClick?.(button.id)}
            isReady={button.isReady}
            requiresConfirmation={button.requiresConfirmation}
            variant={button.variant === 'primary' ? 'default' : button.variant === 'danger' ? 'destructive' : 'outline'}
            size="sm"
          />
        ))}

        {/* Refresh */}
        {showRefresh && onRefresh && (
          <ActionButton
            actionId={`${entityName}-refresh`}
            label="Refresh"
            buttonVariant="secondary"
            onClick={onRefresh}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </ActionButton>
        )}

        {/* Export */}
        {showExport && onExport && (
          <ActionButton
            actionId={`${entityName}-export`}
            label="Export"
            buttonVariant="secondary"
            onClick={onExport}
            isReady={isExportReady}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </ActionButton>
        )}

        {/* Import */}
        {showImport && onImport && (
          <ActionButton
            actionId={`${entityName}-import`}
            label="Import"
            buttonVariant="secondary"
            onClick={onImport}
            isReady={isImportReady}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Import
          </ActionButton>
        )}

        {/* Create New */}
        {showCreate && onCreateNew && (
          <ActionButton
            actionId={`${entityName}-create`}
            label={createLabel || `Add ${entityName}`}
            buttonVariant="primary"
            onClick={onCreateNew}
            isReady={isCreateReady}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {createLabel || `Add ${entityName}`}
          </ActionButton>
        )}
      </div>
    </div>
  );
};

export default CRUDActionBar;
