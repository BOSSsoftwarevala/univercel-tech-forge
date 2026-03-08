/**
 * FINANCIAL MANAGEMENT SECTION - CONNECTED TO REAL DATA
 */
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, Receipt, FileText, CreditCard, RotateCcw, Banknote,
  Plus, Download, Search, Filter, Loader2
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { Input } from '@/components/ui/input';
import { useTransactions, useInvoices, usePayouts, formatINR } from '@/hooks/useFinanceData';
import { format } from 'date-fns';

interface Props { activeView: FinanceView; }

const sectionConfig: Record<string, { title: string; desc: string; icon: React.ElementType; color: string; addLabel: string; dataSource: string }> = {
  fm_manage_revenue: { title: 'Manage Revenue', desc: 'Track and manage all revenue streams', icon: TrendingUp, color: '#2ca01c', addLabel: '+ Add Revenue', dataSource: 'transactions' },
  fm_manage_expenses: { title: 'Manage Expenses', desc: 'Track and categorize all expenses', icon: Receipt, color: '#ef4444', addLabel: '+ Add Expense', dataSource: 'transactions' },
  fm_manage_invoices: { title: 'Manage Invoices', desc: 'Create, send, and track invoices', icon: FileText, color: '#3b82f6', addLabel: '+ Create Invoice', dataSource: 'invoices' },
  fm_manage_payments: { title: 'Manage Payments', desc: 'Process and monitor all payments', icon: CreditCard, color: '#8b5cf6', addLabel: '+ Record Payment', dataSource: 'transactions' },
  fm_manage_refunds: { title: 'Manage Refunds', desc: 'Process refund requests and adjustments', icon: RotateCcw, color: '#f59e0b', addLabel: '+ Process Refund', dataSource: 'transactions' },
  fm_manage_payouts: { title: 'Manage Payouts', desc: 'Handle payouts to partners and vendors', icon: Banknote, color: '#0ea5e9', addLabel: '+ Create Payout', dataSource: 'payouts' },
};

const revenueTypes = ['order_created', 'payment_received', 'subscription', 'deposit', 'credit'];
const expenseTypes = ['payout', 'refund', 'debit', 'commission_paid', 'expense'];
const refundTypes = ['refund'];

const FinancialManagement: React.FC<Props> = ({ activeView }) => {
  const config = sectionConfig[activeView] || sectionConfig.fm_manage_revenue;
  const Icon = config.icon;
  const [activeTab, setActiveTab] = useState('All');

  const { data: transactions, isLoading: txnLoading } = useTransactions(100);
  const { data: invoices, isLoading: invLoading } = useInvoices(100);
  const { data: payouts, isLoading: payLoading } = usePayouts(100);

  const statusTabs = ['All', 'Pending', 'Approved', 'Completed', 'Failed'];

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      success: 'bg-[#dcfce7] text-[#16a34a]', completed: 'bg-[#dcfce7] text-[#16a34a]',
      pending: 'bg-[#fef3c7] text-[#d97706]', processing: 'bg-[#dbeafe] text-[#2563eb]',
      failed: 'bg-[#fee2e2] text-[#dc2626]', approved: 'bg-[#dcfce7] text-[#16a34a]',
      rejected: 'bg-[#fee2e2] text-[#dc2626]', paid: 'bg-[#dcfce7] text-[#16a34a]',
      unpaid: 'bg-[#fee2e2] text-[#dc2626]', sent: 'bg-[#dbeafe] text-[#2563eb]',
    };
    return map[status] || 'bg-[#f3f4f6] text-[#6b7280]';
  };

  // Determine what data to show
  let rows: any[] = [];
  let isLoading = false;
  let totalAmount = 0;
  let pendingAmount = 0;
  let count = 0;

  if (config.dataSource === 'invoices') {
    isLoading = invLoading;
    const data = invoices || [];
    rows = data.map(inv => ({
      id: inv.invoice_id,
      date: inv.timestamp,
      description: inv.invoice_number || 'Invoice',
      amount: inv.amount,
      status: inv.status || 'sent',
    }));
    totalAmount = data.reduce((s, i) => s + Number(i.amount || 0), 0);
    pendingAmount = data.filter(i => i.status === 'unpaid' || i.status === 'pending').reduce((s, i) => s + Number(i.amount || 0), 0);
    count = data.length;
  } else if (config.dataSource === 'payouts') {
    isLoading = payLoading;
    const data = payouts || [];
    rows = data.map(p => ({
      id: p.payout_id,
      date: p.requested_at || p.timestamp,
      description: `${p.user_role} · ${p.payment_method?.replace('_', ' ')}`,
      amount: p.amount,
      status: p.status,
    }));
    totalAmount = data.reduce((s, p) => s + Number(p.amount || 0), 0);
    pendingAmount = data.filter(p => p.status === 'pending' || p.status === 'approved').reduce((s, p) => s + Number(p.amount || 0), 0);
    count = data.length;
  } else {
    isLoading = txnLoading;
    const allTxns = transactions || [];
    let filtered = allTxns;
    if (activeView === 'fm_manage_revenue') filtered = allTxns.filter(t => revenueTypes.includes(t.type));
    else if (activeView === 'fm_manage_expenses') filtered = allTxns.filter(t => expenseTypes.includes(t.type));
    else if (activeView === 'fm_manage_refunds') filtered = allTxns.filter(t => refundTypes.includes(t.type));

    rows = filtered.map(t => ({
      id: t.transaction_id,
      date: t.timestamp,
      description: t.reference || t.type?.replace(/_/g, ' '),
      amount: t.amount,
      status: t.status,
    }));
    totalAmount = filtered.reduce((s, t) => s + Number(t.amount || 0), 0);
    pendingAmount = filtered.filter(t => t.status === 'pending').reduce((s, t) => s + Number(t.amount || 0), 0);
    count = filtered.length;
  }

  // Filter by tab
  if (activeTab !== 'All') {
    const tabMap: Record<string, string[]> = {
      'Pending': ['pending'], 'Approved': ['approved', 'processing'],
      'Completed': ['completed', 'success', 'paid'], 'Failed': ['failed', 'rejected'],
    };
    rows = rows.filter(r => (tabMap[activeTab] || []).includes(r.status));
  }

  // Month total
  const now = new Date();
  const thisMonth = rows.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthTotal = thisMonth.reduce((s: number, r: any) => s + Number(r.amount || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0d333f]">{config.title}</h2>
          <p className="text-[13px] text-[#6b7280]">{config.desc}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
          <Button size="sm" className="bg-[#2ca01c] hover:bg-[#249317] text-white text-[12px]">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> {config.addLabel}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: formatINR(totalAmount), color: config.color },
          { label: 'This Month', value: formatINR(monthTotal), color: '#3b82f6' },
          { label: 'Pending', value: formatINR(pendingAmount), color: '#f59e0b' },
          { label: 'Count', value: String(count), color: '#6b7280' },
        ].map((s, i) => (
          <Card key={i} className="bg-white border-[#e5e7eb]">
            <CardContent className="p-3">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <p className="text-[18px] font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-[#f3f4f6] rounded-lg p-0.5">
          {statusTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${tab === activeTab ? 'bg-white text-[#0d333f] shadow-sm' : 'text-[#6b7280] hover:text-[#0d333f]'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <Input placeholder="Search..." className="pl-8 h-8 text-[12px] w-[200px] border-[#d4d7dc]" />
        </div>
      </div>

      <Card className="bg-white border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
            <span>ID</span><span>Date</span><span>Description</span><span>Amount</span><span>Status</span>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#2ca01c] mx-auto" /></div>
          ) : rows.length > 0 ? (
            rows.slice(0, 50).map((row, i) => (
              <div key={row.id || i} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#f3f4f6] text-[12px] hover:bg-[#f9fafb] transition-colors">
                <span className="font-mono text-[11px] text-[#6b7280] truncate">{String(row.id).substring(0, 8)}</span>
                <span>{row.date ? format(new Date(row.date), 'dd MMM yy') : '—'}</span>
                <span className="capitalize truncate">{row.description}</span>
                <span className="font-semibold">{formatINR(row.amount)}</span>
                <Badge className={`text-[10px] w-fit ${statusColor(row.status)}`}>{row.status}</Badge>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Icon className="w-12 h-12 mx-auto mb-3" style={{ color: `${config.color}40` }} />
              <p className="text-[14px] font-medium text-[#6b7280]">No records found</p>
              <p className="text-[12px] text-[#9ca3af] mt-1">Records will appear here as data flows in</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialManagement;
