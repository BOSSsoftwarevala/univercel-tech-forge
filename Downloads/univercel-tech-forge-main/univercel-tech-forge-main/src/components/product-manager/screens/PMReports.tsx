import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  BarChart3, Download, CheckCircle2, AlertCircle, TrendingUp,
  TrendingDown, Users, Activity, FileText, Calendar
} from 'lucide-react';

interface PMReportsProps {
  reportType: string;
}

const PMReports: React.FC<PMReportsProps> = ({ reportType }) => {
  const getTitle = () => {
    switch (reportType) {
      case 'software-usage': return 'Software Usage Report';
      case 'deployment-success': return 'Deployment Success Rate';
      case 'failure-reports': return 'Failure Reports';
      case 'export-reports': return 'Export Reports';
      default: return 'Reports';
    }
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting ${format.toUpperCase()}`, {
      description: 'Report will be downloaded shortly'
    });
  };

  if (reportType === 'software-usage') {
    const usageData = [
      { product: 'ERP Suite', users: 1250, sessions: 45000, avgTime: '32 min', trend: 12 },
      { product: 'CRM Pro', users: 890, sessions: 28000, avgTime: '25 min', trend: 8 },
      { product: 'HR System', users: 670, sessions: 19000, avgTime: '18 min', trend: -3 },
      { product: 'Inventory', users: 340, sessions: 8500, avgTime: '15 min', trend: 5 },
      { product: 'E-Commerce', users: 1520, sessions: 62000, avgTime: '45 min', trend: 22 },
    ];

    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">Usage analytics across all products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </motion.div>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-4">
            {usageData.map((item, index) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{item.product}</h3>
                      <div className={`flex items-center gap-1 text-sm ${item.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {item.trend}%
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                        <p className="text-lg font-bold">{item.users.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Active Users</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <Activity className="w-5 h-5 mx-auto mb-1 text-violet-400" />
                        <p className="text-lg font-bold">{item.sessions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Sessions</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/30 rounded-lg">
                        <Calendar className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <p className="text-lg font-bold">{item.avgTime}</p>
                        <p className="text-xs text-muted-foreground">Avg. Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (reportType === 'deployment-success') {
    const deploymentData = [
      { month: 'Jan 2024', total: 45, success: 43, failed: 2, rate: 95.6 },
      { month: 'Dec 2023', total: 38, success: 35, failed: 3, rate: 92.1 },
      { month: 'Nov 2023', total: 42, success: 40, failed: 2, rate: 95.2 },
      { month: 'Oct 2023', total: 35, success: 33, failed: 2, rate: 94.3 },
    ];

    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">Monthly deployment success rates</p>
            </div>
          </div>
        </motion.div>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-4">
            {deploymentData.map((item, index) => (
              <motion.div
                key={item.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{item.month}</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {item.rate}% Success
                      </Badge>
                    </div>
                    <Progress value={item.rate} className="h-2 mb-3" />
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-bold text-lg">{item.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-emerald-400">{item.success}</p>
                        <p className="text-xs text-muted-foreground">Success</p>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-red-400">{item.failed}</p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (reportType === 'failure-reports') {
    const failureData = [
      { id: 'FAIL-001', product: 'Inventory Manager', version: 'v1.0.0', date: '2024-01-14', reason: 'Database migration failed', resolved: true },
      { id: 'FAIL-002', product: 'HR System', version: 'v4.1.1', date: '2024-01-10', reason: 'Build timeout exceeded', resolved: true },
      { id: 'FAIL-003', product: 'CRM Pro', version: 'v2.7.9', date: '2024-01-05', reason: 'Memory limit reached', resolved: true },
    ];

    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">Recent deployment failures</p>
          </div>
        </motion.div>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-3">
            {failureData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{item.product}</h3>
                        <p className="text-xs text-muted-foreground">{item.version} • {item.date}</p>
                      </div>
                      <Badge variant={item.resolved ? 'secondary' : 'destructive'}>
                        {item.resolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-400">{item.reason}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Export Reports
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">Export data in various formats</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Product Catalog', format: 'CSV', icon: FileText, color: 'blue' },
          { name: 'Deployment History', format: 'PDF', icon: FileText, color: 'red' },
          { name: 'Usage Analytics', format: 'XLSX', icon: BarChart3, color: 'green' },
          { name: 'License Summary', format: 'PDF', icon: FileText, color: 'amber' },
          { name: 'Audit Logs', format: 'CSV', icon: Activity, color: 'violet' },
          { name: 'Full Report', format: 'PDF', icon: FileText, color: 'indigo' },
        ].map((report, index) => (
          <motion.div
            key={report.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card/50 border-border/50 hover:border-violet-500/30 transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <report.icon className="w-8 h-8 mx-auto mb-3 text-violet-400" />
                <h3 className="font-medium mb-1">{report.name}</h3>
                <Badge variant="secondary" className="mb-3">{report.format}</Badge>
                <Button className="w-full gap-2" size="sm" onClick={() => handleExport(report.format)}>
                  <Download className="w-4 h-4" /> Export
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PMReports;
