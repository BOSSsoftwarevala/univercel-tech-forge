import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Calendar,
  Clock,
  Eye,
  Shield,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  action: string;
  category: 'decision' | 'escalation' | 'ai_review' | 'system';
  details: string;
  actorId: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'forwarded';
}

interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  generatedAt: string;
  size: string;
}

const mockAuditLog: AuditEntry[] = [
  {
    id: 'AUD-001',
    action: 'Escalation Resolved',
    category: 'escalation',
    details: 'ESC-001 resolved with corrective action plan',
    actorId: 'PM-CURRENT',
    timestamp: '2035-01-15 10:30',
    status: 'completed'
  },
  {
    id: 'AUD-002',
    action: 'AI Alert Acknowledged',
    category: 'ai_review',
    details: 'QA-002 underperformance pattern acknowledged',
    actorId: 'PM-CURRENT',
    timestamp: '2035-01-15 09:45',
    status: 'completed'
  },
  {
    id: 'AUD-003',
    action: 'Exception Approved',
    category: 'decision',
    details: 'DEC-001 SLA exception approved for external dependency',
    actorId: 'PM-CURRENT',
    timestamp: '2035-01-15 09:15',
    status: 'completed'
  },
  {
    id: 'AUD-004',
    action: 'Financial Recommendation',
    category: 'decision',
    details: 'DEC-003 penalty waiver recommended to Finance',
    actorId: 'PM-CURRENT',
    timestamp: '2035-01-14 17:30',
    status: 'forwarded'
  },
  {
    id: 'AUD-005',
    action: 'Escalation Forwarded',
    category: 'escalation',
    details: 'ESC-005 critical breach forwarded to Master Admin',
    actorId: 'PM-CURRENT',
    timestamp: '2035-01-14 16:00',
    status: 'forwarded'
  }
];

const mockReports: Report[] = [
  { id: 'RPT-001', name: 'Daily Quality Summary', type: 'daily', generatedAt: '2035-01-15 06:00', size: '2.4 MB' },
  { id: 'RPT-002', name: 'Weekly SLA Report', type: 'weekly', generatedAt: '2035-01-13 00:00', size: '8.7 MB' },
  { id: 'RPT-003', name: 'Monthly Performance Review', type: 'monthly', generatedAt: '2035-01-01 00:00', size: '24.3 MB' },
  { id: 'RPT-004', name: 'Escalation Trends Analysis', type: 'custom', generatedAt: '2035-01-10 14:30', size: '5.1 MB' }
];

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'decision':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Decision</Badge>;
    case 'escalation':
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Escalation</Badge>;
    case 'ai_review':
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">AI Review</Badge>;
    case 'system':
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">System</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    case 'forwarded':
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Forwarded</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getReportTypeBadge = (type: string) => {
  switch (type) {
    case 'daily':
      return <Badge variant="outline" className="text-xs">Daily</Badge>;
    case 'weekly':
      return <Badge variant="outline" className="text-xs">Weekly</Badge>;
    case 'monthly':
      return <Badge variant="outline" className="text-xs">Monthly</Badge>;
    case 'custom':
      return <Badge variant="outline" className="text-xs">Custom</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>;
  }
};

export const PMReportsAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'reports'>('audit');
  const [searchTerm, setSearchTerm] = useState('');

  const handleExportPDF = (report: Report) => {
    toast.success(`Exporting ${report.name}`, {
      description: 'PDF export initiated (read-only)'
    });
    console.log('[PRO-MANAGER] PDF export:', report.id);
  };

  const handleViewAudit = (entry: AuditEntry) => {
    toast.info(`Viewing audit entry ${entry.id}`, {
      description: entry.details
    });
    console.log('[PRO-MANAGER] Audit view:', entry.id);
  };

  const filteredAudit = mockAuditLog.filter(entry =>
    entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Reports & Audit Log
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            READ-ONLY • PDF Export Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === 'audit' ? 'default' : 'outline'}
            onClick={() => setActiveTab('audit')}
          >
            Audit Log
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'reports' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </Button>
        </div>

        {activeTab === 'audit' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Audit Entries */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredAudit.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-muted/30 border border-border/50 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{entry.id}</span>
                      {getCategoryBadge(entry.category)}
                    </div>
                    {getStatusBadge(entry.status)}
                  </div>
                  <p className="font-medium text-sm mb-1">{entry.action}</p>
                  <p className="text-xs text-muted-foreground mb-2">{entry.details}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleViewAudit(entry)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {mockReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-muted/30 border border-border/50 rounded-lg p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{report.name}</span>
                      {getReportTypeBadge(report.type)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.generatedAt}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => handleExportPDF(report)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Immutable audit log • Read-only access • PDF export only
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
