/**
 * DEMO LOGS (AUDIT) SCREEN
 * Log Types: Demo created, Demo scanned, AI fix applied, User accessed, Error detected
 * READ-ONLY • IMMUTABLE
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Search,
  Filter,
  Download,
  PlusCircle,
  Scan,
  Bot,
  User,
  AlertOctagon,
  Clock,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  type: 'created' | 'scanned' | 'ai-fix' | 'accessed' | 'error';
  message: string;
  software: string;
  user: string;
  timestamp: string;
  details?: string;
}

const logData: LogEntry[] = [
  { id: '1', type: 'created', message: 'Demo created from master template', software: 'SchoolERP Pro v2', user: 'System', timestamp: '2024-01-19 14:32:15', details: 'Cloned from SchoolERP Master' },
  { id: '2', type: 'scanned', message: 'Full health scan completed', software: 'HospitalCRM', user: 'Vala AI', timestamp: '2024-01-19 14:28:45', details: '100% button test passed' },
  { id: '3', type: 'ai-fix', message: 'AI applied 3 UI fixes', software: 'RetailPOS Master', user: 'Vala AI', timestamp: '2024-01-19 14:15:22', details: 'Fixed navigation, modal, sidebar' },
  { id: '4', type: 'accessed', message: 'Demo accessed by client', software: 'BuilderCRM Elite', user: 'Client #4521', timestamp: '2024-01-19 13:55:10', details: 'IP: 192.168.x.x | India' },
  { id: '5', type: 'error', message: 'API endpoint failure detected', software: 'LogisticsERP', user: 'Health Monitor', timestamp: '2024-01-19 13:42:33', details: '/api/tracking returned 500' },
  { id: '6', type: 'created', message: 'Demo created from template', software: 'FinanceHRM', user: 'System', timestamp: '2024-01-19 13:30:00', details: 'Cloned from HRM Master' },
  { id: '7', type: 'ai-fix', message: 'Theme matching applied', software: 'SchoolERP Pro', user: 'Vala AI', timestamp: '2024-01-19 13:15:45', details: 'Color palette updated' },
  { id: '8', type: 'scanned', message: 'Security scan completed', software: 'All Demos', user: 'Security Bot', timestamp: '2024-01-19 12:00:00', details: 'No vulnerabilities found' },
  { id: '9', type: 'accessed', message: 'Demo accessed by client', software: 'HospitalCRM', user: 'Client #3892', timestamp: '2024-01-19 11:45:22', details: 'IP: 10.0.x.x | UAE' },
  { id: '10', type: 'error', message: 'Button click test failed', software: 'RetailPOS Master', user: 'Health Monitor', timestamp: '2024-01-19 11:30:15', details: '5 buttons non-responsive' },
];

export const DMELogsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'created': return <PlusCircle className="w-4 h-4 text-neon-green" />;
      case 'scanned': return <Scan className="w-4 h-4 text-primary" />;
      case 'ai-fix': return <Bot className="w-4 h-4 text-neon-teal" />;
      case 'accessed': return <User className="w-4 h-4 text-blue-400" />;
      case 'error': return <AlertOctagon className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'created': return <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Created</Badge>;
      case 'scanned': return <Badge className="bg-primary/20 text-primary border-primary/30">Scanned</Badge>;
      case 'ai-fix': return <Badge className="bg-neon-teal/20 text-neon-teal border-neon-teal/30">AI Fix</Badge>;
      case 'accessed': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Accessed</Badge>;
      case 'error': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Error</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  const handleExport = () => {
    toast.success('Exporting logs...');
  };

  const filteredLogs = logData.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.software.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterType || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const logCounts = {
    created: logData.filter(l => l.type === 'created').length,
    scanned: logData.filter(l => l.type === 'scanned').length,
    aiFix: logData.filter(l => l.type === 'ai-fix').length,
    accessed: logData.filter(l => l.type === 'accessed').length,
    error: logData.filter(l => l.type === 'error').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Demo Logs
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Immutable audit trail
            <Badge variant="outline" className="text-[10px] gap-1">
              <Lock className="w-2 h-2" />
              READ-ONLY
            </Badge>
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Created', count: logCounts.created, color: 'text-neon-green', type: 'created' },
          { label: 'Scanned', count: logCounts.scanned, color: 'text-primary', type: 'scanned' },
          { label: 'AI Fixes', count: logCounts.aiFix, color: 'text-neon-teal', type: 'ai-fix' },
          { label: 'Accessed', count: logCounts.accessed, color: 'text-blue-400', type: 'accessed' },
          { label: 'Errors', count: logCounts.error, color: 'text-red-400', type: 'error' },
        ].map((stat) => (
          <Card 
            key={stat.type} 
            className={`glass-card border-border/50 cursor-pointer transition-all ${
              filterType === stat.type ? 'border-primary' : ''
            }`}
            onClick={() => setFilterType(filterType === stat.type ? null : stat.type)}
          >
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {filterType && (
          <Button variant="outline" size="sm" onClick={() => setFilterType(null)}>
            Clear Filter
          </Button>
        )}
      </div>

      {/* Logs List */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neon-green" />
            Audit Log ({filteredLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
              >
                <div className="mt-0.5">{getTypeIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeBadge(log.type)}
                    <span className="text-sm font-medium text-foreground truncate">{log.message}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{log.software}</span>
                    <span>•</span>
                    <span>{log.user}</span>
                    {log.details && (
                      <>
                        <span>•</span>
                        <span className="truncate">{log.details}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {log.timestamp}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
