import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileBarChart, BarChart3, TrendingUp, XCircle, FileText,
  Download, Eye, Calendar
} from 'lucide-react';

const reportTypes = [
  { id: 'source', label: 'Source Wise Report', icon: FileBarChart, lastGenerated: '2 hours ago' },
  { id: 'agent', label: 'Agent Wise Performance', icon: BarChart3, lastGenerated: '1 hour ago' },
  { id: 'funnel', label: 'Conversion Funnel', icon: TrendingUp, lastGenerated: '30 mins ago' },
  { id: 'lost', label: 'Lost Reason Analysis', icon: XCircle, lastGenerated: '4 hours ago' },
];

const sourceData = [
  { source: 'Google Ads', leads: 534, converted: 128, rate: '24.0%' },
  { source: 'Facebook Ads', leads: 312, converted: 67, rate: '21.5%' },
  { source: 'Website', leads: 412, converted: 118, rate: '28.6%' },
  { source: 'Referral', leads: 156, converted: 71, rate: '45.5%' },
  { source: 'LinkedIn', leads: 134, converted: 34, rate: '25.4%' },
];

const agentData = [
  { agent: 'Vikram Singh', leads: 45, converted: 12, rate: '26.7%', calls: 128 },
  { agent: 'Neha Verma', leads: 38, converted: 9, rate: '23.7%', calls: 98 },
  { agent: 'Raj Malhotra', leads: 42, converted: 11, rate: '26.2%', calls: 112 },
  { agent: 'Anita Desai', leads: 52, converted: 18, rate: '34.6%', calls: 156 },
];

const lostReasons = [
  { reason: 'Budget Constraints', count: 89, percentage: '32%' },
  { reason: 'Competitor Chosen', count: 67, percentage: '24%' },
  { reason: 'No Response', count: 56, percentage: '20%' },
  { reason: 'Timeline Mismatch', count: 45, percentage: '16%' },
  { reason: 'Other', count: 23, percentage: '8%' },
];

const LMReports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive lead performance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{report.label}</p>
                      <p className="text-xs text-muted-foreground">Last: {report.lastGenerated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs flex-1">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs flex-1">
                      <Download className="w-3 h-3 mr-1" /> Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Wise Report */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center justify-between">
              <span>Source Wise Report</span>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Source</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Leads</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Converted</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Rate</th>
                </tr>
              </thead>
              <tbody>
                {sourceData.map((item) => (
                  <tr key={item.source} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3 font-medium text-foreground">{item.source}</td>
                    <td className="p-3 text-muted-foreground">{item.leads}</td>
                    <td className="p-3 text-muted-foreground">{item.converted}</td>
                    <td className="p-3">
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{item.rate}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center justify-between">
              <span>Agent Performance</span>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Agent</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Leads</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Converted</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Calls</th>
                </tr>
              </thead>
              <tbody>
                {agentData.map((item) => (
                  <tr key={item.agent} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3 font-medium text-foreground">{item.agent}</td>
                    <td className="p-3 text-muted-foreground">{item.leads}</td>
                    <td className="p-3 text-muted-foreground">{item.converted}</td>
                    <td className="p-3 text-muted-foreground">{item.calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Lost Reason Analysis */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Lost Reason Analysis</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {lostReasons.map((reason, index) => (
              <motion.div
                key={reason.reason}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-accent/30 border border-border text-center"
              >
                <p className="text-2xl font-bold text-red-400">{reason.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{reason.reason}</p>
                <Badge className="mt-2 bg-red-500/20 text-red-400 text-xs">{reason.percentage}</Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMReports;
