/**
 * LOGS & SECURITY SECTION
 * Transaction Logs, Finance Activity, Masked View, Fraud Detection
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Lock,
  FileText,
  Activity,
  Eye,
  Shield,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface LogsSecurityProps {
  activeView: FinanceView;
}

const LogsSecurity: React.FC<LogsSecurityProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'log_transactions': return 'Transaction Logs';
      case 'log_activity': return 'Finance Activity Log';
      case 'log_masked_view': return 'Masked Data View';
      case 'log_fraud_detection': return 'Fraud Detection';
      default: return 'Logs & Security';
    }
  };

  const transactionLogs = [
    { id: 'LOG001', txnId: 'TXN-98765', action: 'Payment Received', amount: '₹50,000', user: 'DEL-****', time: '10:30:45 AM', ip: '192.168.*.***', status: 'Success' },
    { id: 'LOG002', txnId: 'TXN-98764', action: 'Withdrawal', amount: '₹25,000', user: 'MUM-****', time: '10:25:12 AM', ip: '10.0.*.***', status: 'Success' },
    { id: 'LOG003', txnId: 'TXN-98763', action: 'Transfer', amount: '₹15,000', user: 'BLR-****', time: '10:20:33 AM', ip: '172.16.*.***', status: 'Failed' },
    { id: 'LOG004', txnId: 'TXN-98762', action: 'Refund', amount: '₹8,500', user: 'CHN-****', time: '10:15:01 AM', ip: '192.168.*.***', status: 'Success' },
    { id: 'LOG005', txnId: 'TXN-98761', action: 'Commission', amount: '₹12,000', user: 'PUN-****', time: '10:10:22 AM', ip: '10.0.*.***', status: 'Success' },
  ];

  const activityLogs = [
    { id: 'ACT001', user: 'Finance Admin', action: 'Approved payout request', target: 'PAY-12345', time: '10:30 AM', module: 'Payouts' },
    { id: 'ACT002', user: 'System', action: 'Auto-generated invoice', target: 'INV-2024-156', time: '10:25 AM', module: 'Invoices' },
    { id: 'ACT003', user: 'Finance Lead', action: 'Modified commission rate', target: 'RULE-001', time: '10:20 AM', module: 'Commissions' },
    { id: 'ACT004', user: 'Super Admin', action: 'Enabled payment gateway', target: 'Stripe', time: '10:15 AM', module: 'Gateways' },
    { id: 'ACT005', user: 'System', action: 'Flagged suspicious transaction', target: 'TXN-98760', time: '10:10 AM', module: 'Security' },
  ];

  const fraudAlerts = [
    { id: 'FRD001', type: 'Unusual Pattern', description: 'Multiple high-value transactions from new device', risk: 'High', time: '10:30 AM', status: 'Active' },
    { id: 'FRD002', type: 'Velocity Check', description: 'Exceeded transaction frequency limit', risk: 'Medium', time: '10:15 AM', status: 'Under Review' },
    { id: 'FRD003', type: 'Location Mismatch', description: 'Transaction from unusual location', risk: 'Low', time: '09:45 AM', status: 'Resolved' },
    { id: 'FRD004', type: 'Amount Anomaly', description: 'Transaction 500% above average', risk: 'High', time: '09:30 AM', status: 'Active' },
  ];

  const stats = [
    { label: 'Total Logs Today', value: '12,456', icon: FileText },
    { label: 'Suspicious Activity', value: '8', icon: AlertTriangle },
    { label: 'Blocked Transactions', value: '3', icon: XCircle },
    { label: 'Security Score', value: '98%', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Lock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Security logs and fraud monitoring</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search logs by ID, action, or user..." className="pl-10" />
      </div>

      {/* Fraud Detection (for log_fraud_detection view) */}
      {activeView === 'log_fraud_detection' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Fraud Detection Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg ${
                  alert.risk === 'High' ? 'bg-red-50 dark:bg-red-900/20' :
                  alert.risk === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20' :
                  'bg-slate-50 dark:bg-slate-800/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.risk === 'High' ? 'text-red-600' :
                        alert.risk === 'Medium' ? 'text-amber-600' :
                        'text-slate-600'
                      }`} />
                      <span className="font-medium text-slate-900 dark:text-white">{alert.type}</span>
                      <Badge variant={
                        alert.risk === 'High' ? 'destructive' :
                        alert.risk === 'Medium' ? 'secondary' :
                        'outline'
                      }>{alert.risk}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{alert.time}</span>
                      <Badge variant={
                        alert.status === 'Active' ? 'destructive' :
                        alert.status === 'Under Review' ? 'secondary' :
                        'default'
                      }>{alert.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{alert.description}</p>
                  {alert.status !== 'Resolved' && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Investigate
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <XCircle className="w-3 h-3" />
                        Block
                      </Button>
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        Mark Safe
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Logs (for log_activity view) */}
      {activeView === 'log_activity' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Finance Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{log.user}</span> {log.action}
                      </p>
                      <p className="text-xs text-slate-500">Target: {log.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{log.module}</Badge>
                    <span className="text-xs text-slate-500">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Logs Table */}
      {(activeView === 'log_transactions' || activeView === 'log_masked_view') && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              Transaction Logs
              {activeView === 'log_masked_view' && (
                <Badge variant="outline" className="ml-2">
                  <Eye className="w-3 h-3 mr-1" />
                  Masked View
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">Log ID</th>
                    <th className="pb-3 font-medium">Transaction</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">IP Address</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactionLogs.map((log) => (
                    <tr key={log.id} className="text-sm">
                      <td className="py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{log.id}</td>
                      <td className="py-3 font-mono text-blue-600">{log.txnId}</td>
                      <td className="py-3 text-slate-900 dark:text-white">{log.action}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{log.amount}</td>
                      <td className="py-3 font-mono text-slate-500">{log.user}</td>
                      <td className="py-3 font-mono text-xs text-slate-500">{log.ip}</td>
                      <td className="py-3 text-xs text-slate-500">{log.time}</td>
                      <td className="py-3">
                        <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="text-xs">
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LogsSecurity;
