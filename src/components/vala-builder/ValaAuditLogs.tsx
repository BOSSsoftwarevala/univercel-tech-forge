import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Search, Filter, Download, Calendar, User, Bot,
  Code2, CheckCircle2, XCircle, AlertTriangle, Clock, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  actor: string;
  actorType: 'human' | 'ai';
  target: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'pending';
  details: string;
  ip?: string;
}

const mockLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-17 14:32:15',
    action: 'approve_build_request',
    module: 'vala_builder',
    actor: 'Boss Admin',
    actorType: 'human',
    target: 'REQ-001',
    severity: 'high',
    status: 'success',
    details: 'Approved Restaurant POS build request',
    ip: '192.168.1.100'
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-17 14:30:45',
    action: 'ai_build_started',
    module: 'vala_builder',
    actor: 'VALA-DEV',
    actorType: 'ai',
    target: 'BUILD-001',
    severity: 'medium',
    status: 'success',
    details: 'AI initiated build for Restaurant POS module'
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-17 14:28:10',
    action: 'submit_build_request',
    module: 'vala_builder',
    actor: 'John Smith (Franchise)',
    actorType: 'human',
    target: 'REQ-001',
    severity: 'low',
    status: 'success',
    details: 'New build request submitted for Restaurant POS',
    ip: '203.45.67.89'
  },
  {
    id: 'LOG-004',
    timestamp: '2024-01-17 14:25:30',
    action: 'auto_fix_applied',
    module: 'vala_builder',
    actor: 'VALA-SUPPORT',
    actorType: 'ai',
    target: 'BUILD-002',
    severity: 'medium',
    status: 'success',
    details: 'AI automatically fixed login crash issue'
  },
  {
    id: 'LOG-005',
    timestamp: '2024-01-17 14:20:00',
    action: 'security_scan_complete',
    module: 'vala_builder',
    actor: 'VALA-SECURITY',
    actorType: 'ai',
    target: 'BUILD-003',
    severity: 'low',
    status: 'success',
    details: 'Security scan passed with no vulnerabilities'
  },
  {
    id: 'LOG-006',
    timestamp: '2024-01-17 14:15:22',
    action: 'deploy_blocked',
    module: 'vala_builder',
    actor: 'VALA-DEV',
    actorType: 'ai',
    target: 'BUILD-004',
    severity: 'high',
    status: 'pending',
    details: 'Deployment requires Boss approval'
  },
  {
    id: 'LOG-007',
    timestamp: '2024-01-17 14:10:05',
    action: 'qa_test_failed',
    module: 'vala_builder',
    actor: 'VALA-QA',
    actorType: 'ai',
    target: 'BUILD-005',
    severity: 'critical',
    status: 'failed',
    details: 'Button click test failed on checkout screen'
  },
];

const ValaAuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterActorType, setFilterActorType] = useState('all');

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success': return { color: 'text-emerald-400', icon: CheckCircle2 };
      case 'failed': return { color: 'text-red-400', icon: XCircle };
      case 'pending': return { color: 'text-amber-400', icon: Clock };
      default: return { color: 'text-slate-400', icon: Clock };
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;
    if (filterActorType !== 'all' && log.actorType !== filterActorType) return false;
    if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.details.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-400" />
            Audit Logs
          </h2>
          <p className="text-slate-400 text-sm">Complete audit trail of all VALA Builder actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-slate-400 border-slate-600">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" className="text-slate-400 border-slate-600">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="pl-10 bg-slate-900/50 border-slate-700"
          />
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterActorType} onValueChange={setFilterActorType}>
          <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700">
            <SelectValue placeholder="Actor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actors</SelectItem>
            <SelectItem value="human">Human</SelectItem>
            <SelectItem value="ai">AI Bot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{mockLogs.filter(l => l.status === 'success').length}</div>
              <div className="text-xs text-slate-400">Successful</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{mockLogs.filter(l => l.status === 'failed').length}</div>
              <div className="text-xs text-slate-400">Failed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{mockLogs.filter(l => l.actorType === 'ai').length}</div>
              <div className="text-xs text-slate-400">AI Actions</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{mockLogs.filter(l => l.actorType === 'human').length}</div>
              <div className="text-xs text-slate-400">Human Actions</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800">
            {filteredLogs.map((log, index) => {
              const statusConfig = getStatusConfig(log.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${log.actorType === 'ai' ? 'bg-purple-500/20' : 'bg-teal-500/20'}`}>
                        {log.actorType === 'ai' ? (
                          <Bot className="w-4 h-4 text-purple-400" />
                        ) : (
                          <User className="w-4 h-4 text-teal-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-white">{log.action}</code>
                          <Badge className={getSeverityConfig(log.severity)}>{log.severity}</Badge>
                          <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                            {log.target}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">{log.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {log.timestamp}
                          </span>
                          <span>{log.actor}</span>
                          {log.ip && (
                            <span className="font-mono">{log.ip}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValaAuditLogs;
