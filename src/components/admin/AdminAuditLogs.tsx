// ==============================================
// Admin Audit Logs
// Approvals, Suspensions, Role Assignments, Module Toggles
// Immutable - Append-Only
// ==============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ScrollText, Search, Filter, Lock, CheckCircle,
  UserX, Shield, Boxes, Clock, Download
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'approval' | 'suspension' | 'role_change' | 'module_toggle';
  actor: string;
  target: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
  checksum: string;
}

export function AdminAuditLogs() {
  const [logs] = useState<AuditLog[]>([
    {
      id: 'log-001',
      timestamp: '2024-01-30 14:45:32',
      action: 'ACCOUNT_ACTIVATED',
      category: 'approval',
      actor: 'AD-****42',
      target: 'VL-****5678',
      details: 'Reseller account activated',
      status: 'success',
      checksum: 'sha256:a1b2c3d4...',
    },
    {
      id: 'log-002',
      timestamp: '2024-01-30 14:30:15',
      action: 'USER_SUSPENDED',
      category: 'suspension',
      actor: 'AD-****42',
      target: 'VL-****9012',
      details: 'Policy violation: Unauthorized marketing',
      status: 'success',
      checksum: 'sha256:e5f6g7h8...',
    },
    {
      id: 'log-003',
      timestamp: '2024-01-30 13:00:00',
      action: 'ROLE_ASSIGNED',
      category: 'role_change',
      actor: 'AD-****42',
      target: 'VL-****3456',
      details: 'Role changed: client → influencer',
      status: 'success',
      checksum: 'sha256:i9j0k1l2...',
    },
    {
      id: 'log-004',
      timestamp: '2024-01-30 12:45:00',
      action: 'MODULE_DISABLED',
      category: 'module_toggle',
      actor: 'AD-****18',
      target: 'Partner Portal',
      details: 'Module disabled for maintenance',
      status: 'success',
      checksum: 'sha256:m3n4o5p6...',
    },
    {
      id: 'log-005',
      timestamp: '2024-01-30 11:30:00',
      action: 'APPROVAL_ESCALATED',
      category: 'approval',
      actor: 'AD-****42',
      target: 'REQ-****789',
      details: 'High-risk action escalated to Super Admin',
      status: 'success',
      checksum: 'sha256:q7r8s9t0...',
    },
    {
      id: 'log-006',
      timestamp: '2024-01-30 10:15:00',
      action: 'USER_REACTIVATED',
      category: 'suspension',
      actor: 'AD-****42',
      target: 'VL-****7890',
      details: 'Suspension lifted after review',
      status: 'success',
      checksum: 'sha256:u1v2w3x4...',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'approval': return CheckCircle;
      case 'suspension': return UserX;
      case 'role_change': return Shield;
      case 'module_toggle': return Boxes;
      default: return ScrollText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'approval': return 'bg-green-500/20 text-green-400';
      case 'suspension': return 'bg-red-500/20 text-red-400';
      case 'role_change': return 'bg-blue-500/20 text-blue-400';
      case 'module_toggle': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleExport = () => {
    toast.error('BLOCKED: Audit log export requires Super Admin approval');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          Audit Logs
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Immutable
          </Badge>
          <Button size="sm" variant="outline" onClick={handleExport} className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Export (Approval)
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="approval">Approvals</SelectItem>
            <SelectItem value="suspension">Suspensions</SelectItem>
            <SelectItem value="role_change">Role Changes</SelectItem>
            <SelectItem value="module_toggle">Module Toggles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.map(log => {
              const CategoryIcon = getCategoryIcon(log.category);
              
              return (
                <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(log.category)}`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-sm">{log.action}</span>
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Actor: {log.actor}</span>
                          <span>Target: {log.target}</span>
                          <span className="font-mono text-[10px] opacity-50">{log.checksum}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getCategoryColor(log.category)} variant="outline">
                        {log.category.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1 font-mono flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filteredLogs.length} of {logs.length} logs</span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          All actions are reversible and cryptographically signed
        </span>
      </div>
    </div>
  );
}
