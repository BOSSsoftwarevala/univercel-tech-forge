/**
 * TRANSACTIONS SECTION
 * Transaction List, History, Payment Records, Invoice Records
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ClipboardList, Clock, CreditCard, FileText,
  Search, Filter, Download, RefreshCw, ArrowRightLeft
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface Props { activeView: FinanceView; }

const configs: Record<string, { title: string; desc: string; icon: React.ElementType; columns: string[] }> = {
  txn_transaction_list: {
    title: 'Transaction List',
    desc: 'All financial transactions',
    icon: ClipboardList,
    columns: ['Transaction ID', 'Date', 'Type', 'From/To', 'Amount', 'Status'],
  },
  txn_transaction_history: {
    title: 'Transaction History',
    desc: 'Complete transaction history with audit trail',
    icon: Clock,
    columns: ['Transaction ID', 'Date', 'Type', 'Description', 'Amount', 'Status'],
  },
  txn_payment_records: {
    title: 'Payment Records',
    desc: 'All payment transaction records',
    icon: CreditCard,
    columns: ['Payment ID', 'Date', 'Method', 'From', 'Amount', 'Status'],
  },
  txn_invoice_records: {
    title: 'Invoice Records',
    desc: 'All issued and received invoices',
    icon: FileText,
    columns: ['Invoice #', 'Date', 'Client', 'Due Date', 'Amount', 'Status'],
  },
};

const TransactionsSection: React.FC<Props> = ({ activeView }) => {
  const config = configs[activeView] || configs.txn_transaction_list;
  const Icon = config.icon;

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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: '0' },
          { label: 'Total Amount', value: '₹0.00' },
          { label: 'Completed', value: '0' },
          { label: 'Pending', value: '0' },
        ].map((s, i) => (
          <Card key={i} className="bg-white border-[#e5e7eb]">
            <CardContent className="p-3">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <p className="text-[18px] font-bold text-[#0d333f] mt-0.5">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <Input placeholder="Search transactions..." className="pl-8 h-8 text-[12px] border-[#d4d7dc]" />
        </div>
        <Button variant="outline" size="sm" className="text-[11px] border-[#d4d7dc]">
          <Filter className="w-3.5 h-3.5 mr-1" /> Filter
        </Button>
        <Button variant="outline" size="sm" className="text-[11px] border-[#d4d7dc]">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-white border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className={`grid gap-4 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider`} style={{ gridTemplateColumns: `repeat(${config.columns.length}, 1fr)` }}>
            {config.columns.map(col => <span key={col}>{col}</span>)}
          </div>
          
          <div className="p-12 text-center">
            <Icon className="w-12 h-12 text-[#d1d5db] mx-auto mb-3" />
            <p className="text-[14px] font-medium text-[#6b7280]">No records found</p>
            <p className="text-[12px] text-[#9ca3af] mt-1">Transaction records will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsSection;
