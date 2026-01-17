/**
 * ISSUES MANAGEMENT
 * Demo issues, product bugs, AI detected issues
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, AlertTriangle, Cpu, Wrench, CheckCircle, 
  Clock, User, ChevronRight, Sparkles 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  type: 'demo' | 'bug' | 'ai-detected';
  severity: 'critical' | 'high' | 'medium' | 'low';
  product: string;
  status: 'open' | 'assigned' | 'fixed';
  assignee?: string;
  createdAt: string;
}

const issues: Issue[] = [
  { id: '1', title: 'Demo login not working', type: 'demo', severity: 'critical', product: 'School ERP Pro', status: 'open', createdAt: '2 hours ago' },
  { id: '2', title: 'Payment gateway timeout', type: 'bug', severity: 'high', product: 'Restaurant POS', status: 'assigned', assignee: 'Dev Team A', createdAt: '4 hours ago' },
  { id: '3', title: 'Memory leak detected', type: 'ai-detected', severity: 'high', product: 'Hospital Management', status: 'open', createdAt: '1 day ago' },
  { id: '4', title: 'Demo data not seeding', type: 'demo', severity: 'medium', product: 'Gym Management', status: 'fixed', createdAt: '2 days ago' },
  { id: '5', title: 'Slow query detected', type: 'ai-detected', severity: 'medium', product: 'School ERP Pro', status: 'assigned', assignee: 'Database Team', createdAt: '3 days ago' },
  { id: '6', title: 'UI alignment issue', type: 'bug', severity: 'low', product: 'CRM Pro', status: 'open', createdAt: '5 days ago' },
];

const severityConfig = {
  critical: { color: 'red', label: 'Critical' },
  high: { color: 'orange', label: 'High' },
  medium: { color: 'yellow', label: 'Medium' },
  low: { color: 'green', label: 'Low' },
};

const typeConfig = {
  demo: { icon: AlertTriangle, color: 'violet', label: 'Demo Issue' },
  bug: { icon: Bug, color: 'red', label: 'Product Bug' },
  'ai-detected': { icon: Cpu, color: 'blue', label: 'AI Detected' },
};

const statusConfig = {
  open: { color: 'red', label: 'Open' },
  assigned: { color: 'yellow', label: 'Assigned' },
  fixed: { color: 'green', label: 'Fixed' },
};

export const Issues: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredIssues = issues.filter(issue => {
    if (activeTab === 'all') return true;
    return issue.type === activeTab;
  });

  const handleAutoFix = (issueId: string) => {
    toast.success('AI Auto-Fix initiated...', {
      description: 'Analyzing issue and applying fixes',
    });
  };

  const handleAssign = (issueId: string) => {
    toast.info('Opening assignment dialog...');
  };

  const handleClose = (issueId: string) => {
    toast.success('Issue marked as closed');
  };

  const openIssues = issues.filter(i => i.status === 'open').length;
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const aiDetected = issues.filter(i => i.type === 'ai-detected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bug className="w-5 h-5 text-violet-400" />
          Issues Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Demo issues, product bugs & AI detected problems
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-400">{openIssues}</p>
                <p className="text-xs text-muted-foreground">Open Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bug className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-400">{criticalIssues}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-400">{aiDetected}</p>
                <p className="text-xs text-muted-foreground">AI Detected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="demo">Demo Issues</TabsTrigger>
          <TabsTrigger value="bug">Bugs</TabsTrigger>
          <TabsTrigger value="ai-detected">AI Detected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="bg-card/80 border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {filteredIssues.map((issue, idx) => {
                  const typeInfo = typeConfig[issue.type];
                  const sevInfo = severityConfig[issue.severity];
                  const statInfo = statusConfig[issue.status];
                  const TypeIcon = typeInfo.icon;
                  
                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${typeInfo.color}-500/20 flex items-center justify-center`}>
                            <TypeIcon className={`w-5 h-5 text-${typeInfo.color}-400`} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{issue.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`text-xs bg-${sevInfo.color}-500/20 text-${sevInfo.color}-500`}>
                                {sevInfo.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{issue.product}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{issue.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`bg-${statInfo.color}-500/20 text-${statInfo.color}-500`}>
                            {statInfo.label}
                          </Badge>
                          {issue.type === 'ai-detected' && (
                            <Button 
                              size="sm" 
                              className="bg-violet-600 hover:bg-violet-700"
                              onClick={() => handleAutoFix(issue.id)}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Auto Fix
                            </Button>
                          )}
                          {issue.status === 'open' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAssign(issue.id)}
                            >
                              <User className="w-3 h-3 mr-1" />
                              Assign
                            </Button>
                          )}
                          {issue.status !== 'fixed' && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleClose(issue.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Close
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
