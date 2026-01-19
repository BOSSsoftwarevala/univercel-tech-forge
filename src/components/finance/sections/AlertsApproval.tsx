/**
 * ALERTS & APPROVAL SECTION
 * High Amount Approval, Manual Override, Risky Transaction Alert
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell,
  AlertTriangle,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  DollarSign
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface AlertsApprovalProps {
  activeView: FinanceView;
}

const AlertsApproval: React.FC<AlertsApprovalProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'alert_high_amount': return 'High Amount Approvals';
      case 'alert_manual_override': return 'Manual Override Requests';
      case 'alert_risky_transaction': return 'Risky Transaction Alerts';
      default: return 'Alerts & Approval';
    }
  };

  const highAmountRequests = [
    { id: 'HAR001', user: 'Delhi Franchise', amount: '₹15,00,000', type: 'Withdrawal', time: '10:30 AM', riskLevel: 'Medium', status: 'Pending' },
    { id: 'HAR002', user: 'Mumbai Reseller', amount: '₹8,50,000', type: 'Transfer', time: '09:45 AM', riskLevel: 'Low', status: 'Pending' },
    { id: 'HAR003', user: 'Bangalore User', amount: '₹5,00,000', type: 'Payout', time: '09:15 AM', riskLevel: 'High', status: 'Pending' },
  ];

  const manualOverrides = [
    { id: 'MOR001', type: 'Commission Rate', original: '10%', requested: '15%', by: 'Sales Manager', reason: 'Special client', status: 'Pending' },
    { id: 'MOR002', type: 'Credit Limit', original: '₹50,000', requested: '₹1,00,000', by: 'Account Manager', reason: 'Trusted franchise', status: 'Pending' },
    { id: 'MOR003', type: 'Payment Terms', original: '30 days', requested: '60 days', by: 'Finance Lead', reason: 'Cash flow issue', status: 'Approved' },
  ];

  const riskyTransactions = [
    { id: 'RTX001', transaction: 'TXN-98765', amount: '₹25,00,000', flags: ['Unusual amount', 'New device'], time: '11:00 AM', severity: 'High' },
    { id: 'RTX002', transaction: 'TXN-98764', amount: '₹12,00,000', flags: ['Multiple attempts', 'Different location'], time: '10:45 AM', severity: 'Medium' },
    { id: 'RTX003', transaction: 'TXN-98763', amount: '₹8,00,000', flags: ['Rapid succession'], time: '10:30 AM', severity: 'Low' },
  ];

  const stats = [
    { label: 'Pending Approvals', value: '12', icon: Clock, color: 'amber' },
    { label: 'High Risk Alerts', value: '3', icon: AlertTriangle, color: 'red' },
    { label: 'Approved Today', value: '28', icon: CheckCircle, color: 'emerald' },
    { label: 'Rejected Today', value: '5', icon: XCircle, color: 'slate' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Bell className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review and approve financial requests</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Alert Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
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

      {/* High Amount Approvals */}
      {activeView === 'alert_high_amount' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              High Amount Approval Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highAmountRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      request.riskLevel === 'High' ? 'bg-red-100 dark:bg-red-900/30' :
                      request.riskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-emerald-100 dark:bg-emerald-900/30'
                    }`}>
                      <DollarSign className={`w-5 h-5 ${
                        request.riskLevel === 'High' ? 'text-red-600' :
                        request.riskLevel === 'Medium' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{request.user}</p>
                      <p className="text-xs text-slate-500">{request.type} • {request.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{request.amount}</p>
                    <Badge variant={
                      request.riskLevel === 'High' ? 'destructive' :
                      request.riskLevel === 'Medium' ? 'secondary' :
                      'default'
                    }>{request.riskLevel} Risk</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                        <ThumbsUp className="w-3 h-3" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <ThumbsDown className="w-3 h-3" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Override Requests */}
      {activeView === 'alert_manual_override' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Manual Override Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {manualOverrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{override.type}</p>
                    <p className="text-xs text-slate-500">
                      {override.original} → <span className="text-blue-600 font-semibold">{override.requested}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">By: {override.by} • Reason: {override.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={override.status === 'Approved' ? 'default' : 'secondary'}>{override.status}</Badge>
                    {override.status === 'Pending' && (
                      <div className="flex gap-1">
                        <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risky Transaction Alerts */}
      {activeView === 'alert_risky_transaction' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Risky Transaction Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskyTransactions.map((txn) => (
                <div key={txn.id} className={`p-4 rounded-lg ${
                  txn.severity === 'High' ? 'bg-red-50 dark:bg-red-900/20' :
                  txn.severity === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20' :
                  'bg-slate-50 dark:bg-slate-800/50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        txn.severity === 'High' ? 'text-red-600' :
                        txn.severity === 'Medium' ? 'text-amber-600' :
                        'text-slate-600'
                      }`} />
                      <span className="font-mono text-sm text-slate-900 dark:text-white">{txn.transaction}</span>
                      <Badge variant={
                        txn.severity === 'High' ? 'destructive' :
                        txn.severity === 'Medium' ? 'secondary' :
                        'outline'
                      }>{txn.severity}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{txn.amount}</span>
                      <span className="text-xs text-slate-500">{txn.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {txn.flags.map((flag, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">{flag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Review
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <XCircle className="w-3 h-3" />
                        Block
                      </Button>
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        Allow
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertsApproval;
