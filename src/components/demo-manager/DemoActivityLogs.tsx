import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  History, Search, Filter, PlusCircle, Edit, Trash2, 
  RefreshCw, Link2, Eye, Clock, User, Monitor
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: 'add' | 'edit' | 'delete' | 'fix' | 'status_change' | 'url_update';
  demoTitle: string;
  demoId: string;
  timestamp: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

const mockLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'add',
    demoTitle: 'Restaurant POS System',
    demoId: 'demo-001',
    timestamp: '10 minutes ago',
    details: 'New demo added to Food & Beverage category'
  },
  {
    id: '2',
    action: 'fix',
    demoTitle: 'E-Commerce Pro Suite',
    demoId: 'demo-002',
    timestamp: '25 minutes ago',
    details: 'Fixed broken URL - demo restored',
    previousValue: 'https://old-url.broken.com',
    newValue: 'https://new-url.working.com'
  },
  {
    id: '3',
    action: 'edit',
    demoTitle: 'CRM Enterprise',
    demoId: 'demo-003',
    timestamp: '1 hour ago',
    details: 'Updated demo thumbnail and description'
  },
  {
    id: '4',
    action: 'status_change',
    demoTitle: 'HR Management System',
    demoId: 'demo-004',
    timestamp: '2 hours ago',
    details: 'Changed status from active to maintenance',
    previousValue: 'active',
    newValue: 'maintenance'
  },
  {
    id: '5',
    action: 'url_update',
    demoTitle: 'School ERP Demo',
    demoId: 'demo-005',
    timestamp: '3 hours ago',
    details: 'Replaced demo URL with new version',
    previousValue: 'https://v1.school-demo.com',
    newValue: 'https://v2.school-demo.com'
  },
  {
    id: '6',
    action: 'delete',
    demoTitle: 'Old Inventory System',
    demoId: 'demo-006',
    timestamp: '5 hours ago',
    details: 'Demo removed - product discontinued'
  },
  {
    id: '7',
    action: 'add',
    demoTitle: 'Gym Management Pro',
    demoId: 'demo-007',
    timestamp: 'Yesterday',
    details: 'New demo added to Health & Fitness category'
  },
  {
    id: '8',
    action: 'edit',
    demoTitle: 'Hospital Management',
    demoId: 'demo-008',
    timestamp: 'Yesterday',
    details: 'Updated category from Healthcare to Hospital Management'
  }
];

const DemoActivityLogs = () => {
  const [logs] = useState<ActivityLog[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string | null>(null);

  const getActionIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'add': return <PlusCircle className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'fix': return <RefreshCw className="w-4 h-4" />;
      case 'url_update': return <Link2 className="w-4 h-4" />;
      case 'status_change': return <Eye className="w-4 h-4" />;
    }
  };

  const getActionBadge = (action: ActivityLog['action']) => {
    switch (action) {
      case 'add':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{getActionIcon(action)} Added</Badge>;
      case 'edit':
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">{getActionIcon(action)} Edited</Badge>;
      case 'delete':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">{getActionIcon(action)} Deleted</Badge>;
      case 'fix':
        return <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">{getActionIcon(action)} Fixed</Badge>;
      case 'url_update':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{getActionIcon(action)} URL Updated</Badge>;
      case 'status_change':
        return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">{getActionIcon(action)} Status Changed</Badge>;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.demoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterAction || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const actionFilters = [
    { value: null, label: 'All Actions' },
    { value: 'add', label: 'Added' },
    { value: 'edit', label: 'Edited' },
    { value: 'delete', label: 'Deleted' },
    { value: 'fix', label: 'Fixed' },
    { value: 'url_update', label: 'URL Updates' },
    { value: 'status_change', label: 'Status Changes' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-cyan-400" />
            Demo Activity Log
          </h1>
          <p className="text-slate-400 mt-1">Track all demo changes - add, edit, delete, and fix actions</p>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          {logs.length} Total Actions
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by demo title or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              {actionFilters.map((filter) => (
                <Button
                  key={filter.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterAction(filter.value)}
                  className={`border-slate-600 ${
                    filterAction === filter.value 
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-slate-700/50 to-transparent" />

        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-14"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-4 top-4 w-4 h-4 rounded-full border-2 ${
                log.action === 'add' ? 'bg-emerald-500/20 border-emerald-500' :
                log.action === 'edit' ? 'bg-blue-500/20 border-blue-500' :
                log.action === 'delete' ? 'bg-red-500/20 border-red-500' :
                log.action === 'fix' ? 'bg-orange-500/20 border-orange-500' :
                'bg-cyan-500/20 border-cyan-500'
              }`} />

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Monitor className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-white">{log.demoTitle}</span>
                        {getActionBadge(log.action)}
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-2">{log.details}</p>
                      
                      {(log.previousValue || log.newValue) && (
                        <div className="flex items-center gap-2 text-xs mt-3 p-2 rounded-lg bg-slate-800/50">
                          {log.previousValue && (
                            <code className="text-red-400 line-through">{log.previousValue}</code>
                          )}
                          {log.previousValue && log.newValue && (
                            <span className="text-slate-500">→</span>
                          )}
                          {log.newValue && (
                            <code className="text-emerald-400">{log.newValue}</code>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-16">
              <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400">No activity found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoActivityLogs;
