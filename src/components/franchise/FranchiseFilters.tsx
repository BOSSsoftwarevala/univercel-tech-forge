import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Franchise } from '@/pages/FranchiseManagement';

interface FranchiseFiltersProps {
  filters: {
    status: string;
    state: string;
    search: string;
  };
  onFiltersChange: (filters: { status: string; state: string; search: string }) => void;
  franchises: Franchise[];
}

const FranchiseFilters = ({ filters, onFiltersChange, franchises }: FranchiseFiltersProps) => {
  const uniqueStates = [...new Set(franchises.map(f => f.state))];

  const clearFilters = () => {
    onFiltersChange({ status: 'all', state: 'all', search: '' });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.state !== 'all' || filters.search;

  return (
    <div className="glass-panel p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search franchises by name, owner, email, city..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State Filter */}
        <div className="w-full lg:w-48">
          <Select
            value={filters.state}
            onValueChange={(value) => onFiltersChange({ ...filters, state: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueStates.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="command-button"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FranchiseFilters;
