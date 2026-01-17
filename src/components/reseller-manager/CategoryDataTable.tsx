import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, Plus, Download, MoreHorizontal, Eye, Edit, 
  CheckCircle, XCircle, Pause, Play, ArrowUp, Brain,
  Loader2, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { NanoCategory } from './types/categoryTypes';

interface DataItem {
  id: string;
  name: string;
  resellerId: string;
  status: 'active' | 'pending' | 'suspended' | 'completed';
  amount?: number;
  date: string;
  priority?: 'high' | 'medium' | 'low';
}

interface CategoryDataTableProps {
  nano: NanoCategory;
  onAction: (action: string, itemId: string) => void;
}

// Generate mock data based on nano category
const generateMockData = (nano: NanoCategory): DataItem[] => {
  const items: DataItem[] = [];
  const statuses: DataItem['status'][] = ['active', 'pending', 'suspended', 'completed'];
  const priorities: DataItem['priority'][] = ['high', 'medium', 'low'];
  
  for (let i = 0; i < Math.min(nano.count, 10); i++) {
    items.push({
      id: `${nano.id}-${i + 1}`,
      name: `${nano.name} Item ${i + 1}`,
      resellerId: `VL-RS-${1000 + i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 10000) + 100,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: priorities[Math.floor(Math.random() * priorities.length)]
    });
  }
  return items;
};

export const CategoryDataTable: React.FC<CategoryDataTableProps> = ({ nano, onAction }) => {
  const [data, setData] = useState<DataItem[]>(() => generateMockData(nano));
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.resellerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action: string, itemId: string) => {
    setLoadingAction(`${action}-${itemId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (action) {
      case 'approve':
        setData(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'completed' as const } : item
        ));
        toast.success('Item approved successfully');
        break;
      case 'reject':
        setData(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'suspended' as const } : item
        ));
        toast.success('Item rejected');
        break;
      case 'suspend':
        setData(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'suspended' as const } : item
        ));
        toast.success('Item suspended');
        break;
      case 'resume':
        setData(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'active' as const } : item
        ));
        toast.success('Item resumed');
        break;
      case 'escalate':
        toast.success('Escalated to next level');
        break;
      case 'ai-review':
        toast.success('AI review initiated');
        break;
      default:
        toast.info(`Action: ${action}`);
    }
    
    setLoadingAction(null);
    onAction(action, itemId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setData(generateMockData(nano));
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleExport = () => {
    toast.success('Export started - file will download shortly');
  };

  const handleCreate = () => {
    toast.success('Create dialog would open');
  };

  const getStatusBadge = (status: DataItem['status']) => {
    const config = {
      active: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      suspended: 'bg-red-500/10 text-red-500',
      completed: 'bg-blue-500/10 text-blue-500'
    };
    return <Badge className={config[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority?: DataItem['priority']) => {
    if (!priority) return null;
    const config = {
      high: 'bg-red-500/10 text-red-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-green-500/10 text-green-500'
    };
    return <Badge variant="outline" className={config[priority]}>{priority}</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">{nano.name}</CardTitle>
            <Badge variant="secondary">{nano.count} items</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button size="sm" onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Reseller ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.resellerId}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>${item.amount?.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {loadingAction?.startsWith(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleAction('view', item.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('edit', item.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {item.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleAction('approve', item.id)}>
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction('reject', item.id)}>
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {item.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleAction('suspend', item.id)}>
                              <Pause className="h-4 w-4 mr-2 text-yellow-500" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {item.status === 'suspended' && (
                            <DropdownMenuItem onClick={() => handleAction('resume', item.id)}>
                              <Play className="h-4 w-4 mr-2 text-green-500" />
                              Resume
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleAction('escalate', item.id)}>
                            <ArrowUp className="h-4 w-4 mr-2 text-purple-500" />
                            Escalate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('ai-review', item.id)}>
                            <Brain className="h-4 w-4 mr-2 text-blue-500" />
                            AI Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No items found
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
