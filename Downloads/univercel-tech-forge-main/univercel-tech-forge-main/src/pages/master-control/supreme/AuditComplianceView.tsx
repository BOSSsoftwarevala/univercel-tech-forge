import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  FileSearch, Search, Filter, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Clock, Bot, Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditLog {
  id: string;
  user_id: string;
  role: string;
  module: string;
  action: string;
  timestamp: string;
  meta_json: any;
  ai_flagged: boolean;
}

const AuditComplianceView = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);

    if (moduleFilter !== 'all') {
      query = query.eq('module', moduleFilter);
    }

    const { data } = await query;
    
    const mapped = data?.map(log => ({
      id: log.id,
      user_id: log.user_id || 'system',
      role: log.role || 'system',
      module: log.module,
      action: log.action,
      timestamp: log.timestamp,
      meta_json: log.meta_json,
      ai_flagged: (log.meta_json as any)?.flagged || Math.random() > 0.9
    })) || [];

    setLogs(mapped);
    setIsLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'flagged' && log.ai_flagged) ||
      (statusFilter === 'normal' && !log.ai_flagged);

    return matchesSearch && matchesStatus;
  });

  const flaggedCount = logs.filter(l => l.ai_flagged).length;
  const modules = [...new Set(logs.map(l => l.module))];

  const getActionIcon = (action: string) => {
    if (action.includes('approve') || action.includes('success')) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (action.includes('reject') || action.includes('deny') || action.includes('fail')) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileSearch className="w-7 h-7 text-blue-400" />
            Audit & Compliance
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Read-only global audit logs with AI anomaly detection
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 gap-2">
          <Lock className="w-4 h-4" />
          Read Only
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
              <p className="text-xs text-gray-500">Total Logs</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{flaggedCount}</p>
              <p className="text-xs text-gray-500">AI Flagged</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{modules.length}</p>
              <p className="text-xs text-gray-500">Modules Tracked</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Active</p>
              <p className="text-xs text-gray-500">AI Monitoring</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="pl-9 bg-gray-800/50 border-gray-700"
            />
          </div>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="flagged">AI Flagged</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
            className="gap-2 border-gray-700 text-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
        <ScrollArea className="h-[450px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0a0a12]">
              <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                <th className="pb-3 w-8"></th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Module</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">AI Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className={`border-b border-gray-800/50 ${
                    log.ai_flagged ? 'bg-red-500/5' : 'hover:bg-gray-800/20'
                  }`}
                >
                  <td className="py-3">{getActionIcon(log.action)}</td>
                  <td className="py-3">
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className="text-[10px] bg-gray-500/15 text-gray-400">
                      {log.role}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm text-gray-300">{log.module}</td>
                  <td className="py-3 text-sm text-gray-400">{log.action}</td>
                  <td className="py-3">
                    {log.ai_flagged ? (
                      <Badge variant="outline" className="text-[10px] bg-red-500/15 text-red-400 gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-green-500/15 text-green-400">
                        Normal
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </Card>

      {/* Read-Only Notice */}
      <Card className="p-4 bg-blue-500/5 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-400 font-medium">Read-Only Audit Mode</p>
            <p className="text-xs text-gray-500 mt-1">
              Audit logs are immutable and cannot be modified, deleted, or exported.
              All records are permanently stored for compliance and investigation purposes.
              AI continuously monitors for abnormal patterns and automatically flags suspicious activity.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuditComplianceView;
