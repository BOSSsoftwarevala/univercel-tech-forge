/**
 * SCREEN 2: DEMO LIST
 * Table with demos
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Play, Pause, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface WFDemoListProps {
  onSelectDemo: (demoId: string) => void;
}

const mockDemos = [
  { id: '1', name: 'CRM Pro Demo', product: 'CRM Suite', type: 'Live', status: 'live', manager: 'John D.' },
  { id: '2', name: 'ERP Overview', product: 'ERP System', type: 'Recorded', status: 'live', manager: 'Sarah M.' },
  { id: '3', name: 'HR Module Tour', product: 'HR Platform', type: 'Interactive', status: 'scheduled', manager: 'Mike R.' },
  { id: '4', name: 'Analytics Dashboard', product: 'Analytics Pro', type: 'Live', status: 'draft', manager: 'Lisa K.' },
  { id: '5', name: 'Mobile App Demo', product: 'Mobile Suite', type: 'Recorded', status: 'expired', manager: 'Tom B.' },
  { id: '6', name: 'Security Features', product: 'Security Pro', type: 'Interactive', status: 'live', manager: 'Anna S.' },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    live: 'bg-green-500/10 text-green-600 border-green-500/20',
    draft: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    expired: 'bg-red-500/10 text-red-600 border-red-500/20',
  };
  return styles[status] || styles.draft;
};

const getTypeBadge = (type: string) => {
  const styles: Record<string, string> = {
    Live: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    Recorded: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    Interactive: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  };
  return styles[type] || '';
};

export const WFDemoList: React.FC<WFDemoListProps> = ({ onSelectDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDemos = mockDemos.filter(demo => {
    const matchesSearch = demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          demo.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || demo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Demos</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all product demos</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success('Create demo dialog would open')}>
          <Plus className="w-4 h-4" />
          New Demo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search demos..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Demo Name</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Manager</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemos.map((demo, index) => (
                <motion.tr
                  key={demo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectDemo(demo.id)}
                >
                  <TableCell className="font-medium">{demo.name}</TableCell>
                  <TableCell className="text-muted-foreground">{demo.product}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeBadge(demo.type)}>
                      {demo.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(demo.status)}>
                      {demo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{demo.manager}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectDemo(demo.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {demo.status === 'live' ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
