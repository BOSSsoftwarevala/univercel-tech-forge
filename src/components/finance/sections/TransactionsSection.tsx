/**
 * TRANSACTIONS SECTION - CONNECTED TO REAL DATA
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardList, Clock, CreditCard, FileText,
  Search, Filter, Download, RefreshCw, Loader2
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useTransactions, useInvoices, formatINR } from '@/hooks/useFinanceData';
import { format } from 'date-fns';

interface Props { activeView: FinanceView; }

const configs: Record<string, { title: string; desc: string; icon: React.ElementType; source: string }> = {
  txn_transaction_list: { title: 'Transaction List', desc: 'All financial transactions', icon: ClipboardList, source: 'transactions' },
  txn_transaction_history: { title: 'Transaction History', desc: 'Complete transaction history with audit trail', icon: Clock, source: 'transactions' },
  txn_payment_records: { title: 'Payment Records', desc: 'All payment transaction records', icon: CreditCard, source: 'transactions' },
  txn_invoice_records: { title: 'Invoice Records', desc: 'All issued and received invoices', icon: FileText, source: 'invoices' },
};

const TransactionsSection: React.FC<Props> = ({ activeView }) => {
  const config = configs[activeView] || configs.txn_transaction_list;
  const Icon = config.icon;

  const { data: transactions, isLoading: txnLoading, refetch: refetchTxn } = useTransactions(100);
  const { data: invoices, isLoading: invLoading, refetch: refetchInv } = useInvoices(100);

  const isInvoice = config.source === 'invoices';
  const isLoading = isInvoice ? invLoading : txnLoading;
  const refetch = isInvoice ? refetchInv : refetchTxn;

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      success: 'bg-[#dcfce7] text-[#16a34a]', completed: 'bg-[#dcfce7] text-[#16a34a]',
      pending: 'bg-[#fef3c7] text-[#d97706]', processing: 'bg-[#dbeafe] text-[#2563eb]',
      failed: 'bg-[#fee2e2] text-[#dc2626]', paid: 'bg-[#dcfce7] text-[#16a34a]',
      unpaid: 'bg-[#fee2e2] text-[#dc2626]', sent: 'bg-[#dbeafe] text-[#2563eb]',
    };
    return map[status] || 'bg-[#f3f4f6] text-[#6b7280]';
  };

  const rows = isInvoice
    ? (invoices || []).map(inv => ({
        id: inv.invoice_id,
        col1: inv.invoice_number || inv.invoice_id.substring(0, 8),
        col2: inv.timestamp ? format(new Date(inv.timestamp), 'dd MMM yy') : '—',
        col3: `Tax: ${formatINR(inv.tax || 0)}`,
        col4: formatINR(inv.amount),
        status: inv.status || 'sent',
      }))
    : (transactions || []).map(t => ({
        id: t.transaction_id,
        col1: t.transaction_id.substring(0, 8),
        col2: t.timestamp ? format(new Date(t.timestamp), 'dd MMM yy') : '—',
        col3: t.type?.replace(/_/g, ' ') || '—',
        col4: formatINR(t.amount),
        status: t.status,
      }));

  const totalAmount = rows.reduce((s, r) => s + Number(isInvoice ? (invoices || []).find(i => i.invoice_id === r.id)?.amount || 0 : (transactions || []).find(t => t.transaction_id === r.id)?.amount || 0), 0);
  const completedCount = rows.filter(r => ['success', 'completed', 'paid'].includes(r.status)).length;
  const pendingCount = rows.filter(r => r.status === 'pending').length;

  const columns = isInvoice
    ? ['Invoice #', 'Date', 'Tax', 'Amount', 'Status']
    : ['Transaction ID', 'Date', 'Type', 'Amount', 'Status'];

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
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: String(rows.length) },
          { label: 'Total Amount', value: formatINR(totalAmount) },
          { label: 'Completed', value: String(completedCount) },
          { label: 'Pending', value: String(pendingCount) },
        ].map((s, i) => (
          <Card key={i} className="bg-white border-[#e5e7eb]">
            <CardContent className="p-3">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <p className="text-[18px] font-bold text-[#0d333f] mt-0.5">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <Input placeholder="Search transactions..." className="pl-8 h-8 text-[12px] border-[#d4d7dc]" />
        </div>
        <Button variant="outline" size="sm" className="text-[11px] border-[#d4d7dc]" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <Card className="bg-white border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
            {columns.map(col => <span key={col}>{col}</span>)}
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#2ca01c] mx-auto" /></div>
          ) : rows.length > 0 ? (
            rows.map((row, i) => (
              <div key={row.id || i} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#f3f4f6] text-[12px] hover:bg-[#f9fafb]">
                <span className="font-mono text-[11px] text-[#6b7280]">{row.col1}</span>
                <span>{row.col2}</span>
                <span className="capitalize">{row.col3}</span>
                <span className="font-semibold">{row.col4}</span>
                <Badge className={`text-[10px] w-fit ${statusColor(row.status)}`}>{row.status}</Badge>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Icon className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
              <p className="text-[14px] font-medium text-[#6b7280]">No records found</p>
              <p className="text-[12px] text-[#9ca3af] mt-1">Transaction records will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsSection;
