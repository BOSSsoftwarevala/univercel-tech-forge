import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Users, Wallet, PlayCircle, FileText, Filter, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const leadHistory = [
  { id: 1, action: 'Lead Assigned', lead: 'R*** V***', to: 'Tech Solutions Mumbai', date: '2 hours ago' },
  { id: 2, action: 'Lead Converted', lead: 'S*** P***', to: 'Digital Pune', date: '1 day ago' },
  { id: 3, action: 'Lead Declined', lead: 'A*** K***', reason: 'Budget mismatch', date: '2 days ago' },
  { id: 4, action: 'Lead Auto-Assigned', lead: 'M*** S***', to: 'Smart Systems Thane', date: '3 days ago' },
];

const payoutHistory = [
  { id: 1, type: 'Commission', amount: '₹45,000', to: 'Self', status: 'completed', date: '2 hours ago' },
  { id: 2, type: 'Reseller Payout', amount: '₹24,000', to: 'Tech Solutions Mumbai', status: 'pending', date: '1 day ago' },
  { id: 3, type: 'Bonus', amount: '₹15,000', to: 'Self', status: 'completed', date: '3 days ago' },
  { id: 4, type: 'Commission', amount: '₹72,000', to: 'Self', status: 'completed', date: '5 days ago' },
];

const demoLogs = [
  { id: 1, action: 'Demo Issued', category: 'POS System', client: 'R*** V***', date: '2 hours ago' },
  { id: 2, action: 'Demo Viewed', category: 'School ERP', client: 'S*** P***', views: 12, date: '1 day ago' },
  { id: 3, action: 'Demo Expired', category: 'Hospital Management', client: 'A*** K***', date: '3 days ago' },
  { id: 4, action: 'Demo Extended', category: 'CRM System', client: 'M*** S***', date: '5 days ago' },
];

const resellerPerformance = [
  { reseller: 'Tech Solutions Mumbai', leads: 34, conversions: 12, rate: '35%', trend: 'up' },
  { reseller: 'Digital Pune', leads: 28, conversions: 9, rate: '32%', trend: 'stable' },
  { reseller: 'InfoTech Nagpur', leads: 15, conversions: 4, rate: '27%', trend: 'down' },
  { reseller: 'Smart Systems Thane', leads: 22, conversions: 7, rate: '32%', trend: 'up' },
];

export const FranchiseAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Territory-Level Audit Logs</h2>
          <p className="text-sm text-muted-foreground">Complete activity history and records</p>
        </div>
        <Button variant="outline" className="border-primary/30">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-panel border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="pl-10 bg-secondary/30 border-border/30"
                />
              </div>
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40 bg-secondary/30 border-border/30">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Lead History
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Payout History
          </TabsTrigger>
          <TabsTrigger value="demos" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Demo Logs
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reseller Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Lead Activity History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadHistory.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.lead} {log.to ? `→ ${log.to}` : log.reason ? `- ${log.reason}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.date}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Payout History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payoutHistory.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        log.type === 'Bonus' ? 'bg-neon-purple/10' : 'bg-neon-green/10'
                      }`}>
                        <Wallet className={`w-5 h-5 ${
                          log.type === 'Bonus' ? 'text-neon-purple' : 'text-neon-green'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{log.type}</p>
                        <p className="text-sm text-muted-foreground">To: {log.to}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-foreground">{log.amount}</p>
                      <Badge variant={log.status === 'completed' ? 'default' : 'secondary'}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demos">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Demo Issuance Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.category} - {log.client} {log.views ? `(${log.views} views)` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.date}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Reseller Performance Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resellerPerformance.map((reseller, index) => (
                <motion.div
                  key={reseller.reseller}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{reseller.reseller}</p>
                      <p className="text-sm text-muted-foreground">
                        {reseller.leads} leads • {reseller.conversions} conversions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-mono font-bold ${
                        reseller.trend === 'up' ? 'text-neon-green' :
                        reseller.trend === 'down' ? 'text-neon-red' : 'text-foreground'
                      }`}>{reseller.rate}</p>
                      <Badge variant={
                        reseller.trend === 'up' ? 'default' :
                        reseller.trend === 'down' ? 'destructive' : 'secondary'
                      }>
                        {reseller.trend === 'up' ? '↑' : reseller.trend === 'down' ? '↓' : '→'} {reseller.trend}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
