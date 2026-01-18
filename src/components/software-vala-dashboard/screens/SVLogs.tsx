/**
 * LOGS SCREEN
 * System logs with filtering
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Clock
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  source: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: '2026-01-18 14:32:15', level: 'success', message: 'API request completed successfully', source: 'api-gateway' },
  { id: '2', timestamp: '2026-01-18 14:32:10', level: 'info', message: 'New user session started', source: 'auth-service' },
  { id: '3', timestamp: '2026-01-18 14:31:55', level: 'warning', message: 'Rate limit approaching threshold (85%)', source: 'rate-limiter' },
  { id: '4', timestamp: '2026-01-18 14:31:40', level: 'error', message: 'Failed to connect to translation service', source: 'translation-api' },
  { id: '5', timestamp: '2026-01-18 14:31:25', level: 'success', message: 'Model GPT-5 response generated', source: 'ai-engine' },
  { id: '6', timestamp: '2026-01-18 14:31:10', level: 'info', message: 'Scheduled backup completed', source: 'backup-service' },
  { id: '7', timestamp: '2026-01-18 14:30:55', level: 'success', message: 'APK build v2.4.1 deployed', source: 'build-service' },
  { id: '8', timestamp: '2026-01-18 14:30:40', level: 'warning', message: 'High memory usage detected (78%)', source: 'monitoring' },
  { id: '9', timestamp: '2026-01-18 14:30:25', level: 'info', message: 'Cache cleared for region: US', source: 'cache-service' },
  { id: '10', timestamp: '2026-01-18 14:30:10', level: 'error', message: 'Database connection timeout', source: 'db-service' },
];

const levelConfig = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  warning: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
};

export const SVLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Logs</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor system events and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Log Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {mockLogs.filter(l => l.level === 'info').length} Info
        </Badge>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {mockLogs.filter(l => l.level === 'success').length} Success
        </Badge>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {mockLogs.filter(l => l.level === 'warning').length} Warnings
        </Badge>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {mockLogs.filter(l => l.level === 'error').length} Errors
        </Badge>
      </div>

      {/* Logs List */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const config = levelConfig[log.level];
              const Icon = config.icon;

              return (
                <div 
                  key={log.id}
                  className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800">{log.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">
                        {log.source}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${config.bg} ${config.color} ${config.border} capitalize`}
                  >
                    {log.level}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
