/**
 * FRANCHISE OWNER - COMMISSION & AUTO-CUT SYSTEM
 * Auto-calculated, transparent ledger
 */

import React from 'react';
import { 
  Percent, TrendingUp, Clock, CheckCircle, RefreshCw,
  Download, FileText, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const commissionData = {
  earned: 156800,
  pending: 48500,
  paid: 108300,
  adjustments: -2500,
};

const commissionLedger = [
  { id: 1, orderId: 'ORD-2024-156', product: 'Business CRM Pro', amount: 4500, status: 'Paid', date: 'Jan 18, 2024' },
  { id: 2, orderId: 'ORD-2024-155', product: 'E-Commerce Suite', amount: 8500, status: 'Pending', date: 'Jan 17, 2024' },
  { id: 3, orderId: 'ORD-2024-154', product: 'Domain + Hosting', amount: 450, status: 'Paid', date: 'Jan 16, 2024' },
  { id: 4, orderId: 'ORD-2024-153', product: 'HR Management System', amount: 5500, status: 'Paid', date: 'Jan 15, 2024' },
  { id: 5, orderId: 'ORD-2024-152', product: 'Inventory Pro', amount: 3200, status: 'Pending', date: 'Jan 14, 2024' },
];

const adjustmentLogs = [
  { id: 1, type: 'Refund Impact', amount: -1500, reason: 'Client refund - ORD-2024-120', date: 'Jan 12, 2024' },
  { id: 2, type: 'Bonus', amount: 2000, reason: 'Monthly target achieved', date: 'Jan 10, 2024' },
  { id: 3, type: 'Refund Impact', amount: -1000, reason: 'Partial refund - ORD-2024-98', date: 'Jan 05, 2024' },
];

export function FOCommissionScreen() {
  const { toast } = useToast();

  const handleDownloadStatement = () => {
    toast({
      title: "Statement Download Started",
      description: "Your commission statement is being prepared...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Percent className="h-6 w-6 text-primary" />
            Commission & Auto-Cut System
          </h1>
          <p className="text-muted-foreground">Auto-calculated • No manual edit • Transparent Ledger</p>
        </div>
        <Button onClick={handleDownloadStatement} className="gap-2">
          <Download className="h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Commission Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Total Earned</span>
            </div>
            <p className="text-2xl font-bold text-emerald-500">₹{commissionData.earned.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-500">₹{commissionData.pending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Paid Out</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">₹{commissionData.paid.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Adjustments</span>
            </div>
            <p className="text-2xl font-bold text-red-500">₹{Math.abs(commissionData.adjustments).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Ledger */}
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Commission Ledger
          </CardTitle>
          <Badge variant="outline">Auto-Calculated</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commissionLedger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    entry.status === 'Paid' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    <Percent className={`h-5 w-5 ${
                      entry.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{entry.product}</p>
                    <p className="text-sm text-muted-foreground">{entry.orderId} • {entry.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={entry.status === 'Paid' ? 'default' : 'secondary'}>
                    {entry.status}
                  </Badge>
                  <span className="font-medium text-emerald-500">+₹{entry.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adjustment Logs */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Adjustment Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adjustmentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    log.amount > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}>
                    <RefreshCw className={`h-5 w-5 ${
                      log.amount > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{log.type}</p>
                    <p className="text-sm text-muted-foreground">{log.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{log.date}</span>
                  <span className={`font-medium ${log.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {log.amount > 0 ? '+' : ''}₹{log.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">Commission Auto-Cut Active</h3>
              <p className="text-sm text-muted-foreground">
                Commissions are automatically calculated at checkout. No manual edits allowed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
