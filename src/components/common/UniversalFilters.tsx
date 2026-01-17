import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Calendar, User, MapPin, Tag, RefreshCw, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface FilterConfig {
  dateRange?: { from: Date | undefined; to: Date | undefined };
  status?: string;
  owner?: string;
  region?: string;
  category?: string;
  priority?: string;
  source?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface UniversalFiltersProps {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  statusOptions?: FilterOption[];
  ownerOptions?: FilterOption[];
  regionOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  priorityOptions?: FilterOption[];
  sourceOptions?: FilterOption[];
  showDateRange?: boolean;
  showStatus?: boolean;
  showOwner?: boolean;
  showRegion?: boolean;
  showCategory?: boolean;
  showPriority?: boolean;
  showSource?: boolean;
  savedFilters?: { name: string; config: FilterConfig }[];
  onSaveFilter?: (name: string, config: FilterConfig) => void;
  onDeleteSavedFilter?: (name: string) => void;
}

const defaultStatusOptions: FilterOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const defaultRegionOptions: FilterOption[] = [
  { value: 'all', label: 'All Regions' },
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'global', label: 'Global' },
];

const defaultPriorityOptions: FilterOption[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function UniversalFilters({
  filters,
  onFiltersChange,
  statusOptions = defaultStatusOptions,
  ownerOptions = [],
  regionOptions = defaultRegionOptions,
  categoryOptions = [],
  priorityOptions = defaultPriorityOptions,
  sourceOptions = [],
  showDateRange = true,
  showStatus = true,
  showOwner = false,
  showRegion = true,
  showCategory = false,
  showPriority = false,
  showSource = false,
  savedFilters = [],
  onSaveFilter,
  onDeleteSavedFilter,
}: UniversalFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'dateRange') return value?.from || value?.to;
    return value && value !== 'all';
  }).length;

  const handleReset = () => {
    onFiltersChange({
      dateRange: { from: undefined, to: undefined },
      status: 'all',
      owner: undefined,
      region: 'all',
      category: undefined,
      priority: 'all',
      source: undefined,
    });
  };

  const handleSaveFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), filters);
      setSaveFilterName('');
    }
  };

  const handleLoadFilter = (config: FilterConfig) => {
    onFiltersChange(config);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn("gap-2", activeFilterCount > 0 && "border-primary text-primary")}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Quick Status Filter */}
        {showStatus && (
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Quick Region Filter */}
        {showRegion && (
          <Select
            value={filters.region || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
          >
            <SelectTrigger className="w-36 h-9">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Range Picker */}
        {showDateRange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Calendar className="w-4 h-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, 'MMM d')} - {format(filters.dateRange.to, 'MMM d')}
                    </>
                  ) : (
                    format(filters.dateRange.from, 'MMM d, yyyy')
                  )
                ) : (
                  'Date Range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={{
                  from: filters.dateRange?.from,
                  to: filters.dateRange?.to,
                }}
                onSelect={(range) => onFiltersChange({
                  ...filters,
                  dateRange: { from: range?.from, to: range?.to },
                })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        )}

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Save className="w-4 h-4" />
                Saved ({savedFilters.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium">Saved Filters</p>
                {savedFilters.map((sf, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadFilter(sf.config)}
                      className="justify-start flex-1"
                    >
                      {sf.name}
                    </Button>
                    {onDeleteSavedFilter && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteSavedFilter(sf.name)}
                        className="h-6 w-6"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Expanded Filters Panel */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showOwner && ownerOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Owner
                </label>
                <Select
                  value={filters.owner || ''}
                  onValueChange={(value) => onFiltersChange({ ...filters, owner: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownerOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showCategory && categoryOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Category
                </label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showPriority && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={filters.priority || 'all'}
                  onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showSource && sourceOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Select
                  value={filters.source || ''}
                  onValueChange={(value) => onFiltersChange({ ...filters, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Save Current Filter */}
          {onSaveFilter && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <input
                type="text"
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
                placeholder="Filter name..."
                className="flex-1 h-9 px-3 rounded-md border bg-background text-sm"
              />
              <Button size="sm" onClick={handleSaveFilter} disabled={!saveFilterName.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save Filter
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active:</span>
          {filters.status && filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, status: 'all' })}
              />
            </Badge>
          )}
          {filters.region && filters.region !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Region: {filters.region}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, region: 'all' })}
              />
            </Badge>
          )}
          {filters.priority && filters.priority !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Priority: {filters.priority}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, priority: 'all' })}
              />
            </Badge>
          )}
          {(filters.dateRange?.from || filters.dateRange?.to) && (
            <Badge variant="secondary" className="gap-1">
              Date Range
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, dateRange: { from: undefined, to: undefined } })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export default UniversalFilters;
