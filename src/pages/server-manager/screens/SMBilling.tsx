import { motion } from 'framer-motion';
import { 
  Receipt, Server, TrendingUp, Download, Calendar,
  CreditCard, ArrowUpRight, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const serverCosts = [
  { server: 'prod-api-01', plan: 'Compute M', cost: 3999, usage: 78 },
  { server: 'prod-api-02', plan: 'Compute M', cost: 3999, usage: 65 },
  { server: 'prod-db-01', plan: 'Memory L', cost: 7999, usage: 92 },
  { server: 'prod-cache-01', plan: 'Compute S', cost: 1999, usage: 45 },
];

const invoices = [
  { id: 'INV-2024-001', period: 'January 2024', amount: 17996, status: 'paid', date: '2024-01-15' },
  { id: 'INV-2023-012', period: 'December 2023', amount: 15997, status: 'paid', date: '2023-12-15' },
  { id: 'INV-2023-011', period: 'November 2023', amount: 15997, status: 'paid', date: '2023-11-15' },
];

const SMBilling = () => {
  const totalCost = serverCosts.reduce((a, b) => a + b.cost, 0);
  const forecast = totalCost * 1.05; // 5% projected increase

  const handleDownload = (invoiceId: string) => {
    toast.success(`Downloading ${invoiceId}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
        <p className="text-slate-400">Track costs and download invoices</p>
      </div>

      {/* Billing Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-sm">Current Month</span>
            </div>
            <p className="text-2xl font-bold text-white">₹{totalCost.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 text-sm">Monthly Forecast</span>
            </div>
            <p className="text-2xl font-bold text-white">₹{Math.round(forecast).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Active Servers</span>
            </div>
            <p className="text-2xl font-bold text-white">{serverCosts.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Wallet Balance</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">₹25,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Server-wise Cost Breakdown */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Server-wise Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serverCosts.map((server, i) => (
              <motion.div
                key={server.server}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">{server.server}</p>
                      <p className="text-slate-400 text-sm">{server.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">₹{server.cost.toLocaleString()}/mo</p>
                    <p className="text-slate-400 text-sm">{server.usage}% utilization</p>
                  </div>
                </div>
                <Progress value={server.usage} className="h-1.5 bg-slate-700" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice, i) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Receipt className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{invoice.id}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {invoice.period}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white font-bold">₹{invoice.amount.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">{invoice.date}</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {invoice.status}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-cyan-400"
                    onClick={() => handleDownload(invoice.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMBilling;
