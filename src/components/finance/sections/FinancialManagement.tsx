/**
 * FINANCIAL MANAGEMENT SECTION
 * Revenue, Expenses, Invoices, Payments, Refunds, Payouts
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, Receipt, FileText, CreditCard, RotateCcw, Banknote,
  Plus, Download, RefreshCw, Search, Filter
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { Input } from '@/components/ui/input';

interface Props { activeView: FinanceView; }

const sectionConfig: Record<string, { title: string; desc: string; icon: React.ElementType; color: string; addLabel: string }> = {
  fm_manage_revenue: { title: 'Manage Revenue', desc: 'Track and manage all revenue streams', icon: TrendingUp, color: '#2ca01c', addLabel: '+ Add Revenue' },
  fm_manage_expenses: { title: 'Manage Expenses', desc: 'Track and categorize all expenses', icon: Receipt, color: '#ef4444', addLabel: '+ Add Expense' },
  fm_manage_invoices: { title: 'Manage Invoices', desc: 'Create, send, and track invoices', icon: FileText, color: '#3b82f6', addLabel: '+ Create Invoice' },
  fm_manage_payments: { title: 'Manage Payments', desc: 'Process and monitor all payments', icon: CreditCard, color: '#8b5cf6', addLabel: '+ Record Payment' },
  fm_manage_refunds: { title: 'Manage Refunds', desc: 'Process refund requests and adjustments', icon: RotateCcw, color: '#f59e0b', addLabel: '+ Process Refund' },
  fm_manage_payouts: { title: 'Manage Payouts', desc: 'Handle payouts to partners and vendors', icon: Banknote, color: '#0ea5e9', addLabel: '+ Create Payout' },
};

const FinancialManagement: React.FC<Props> = ({ activeView }) => {
  const config = sectionConfig[activeView] || sectionConfig.fm_manage_revenue;
  const Icon = config.icon;

  const statusTabs = ['All', 'Pending', 'Approved', 'Completed', 'Failed'];

  return (
    <div className="space-y-5">
      {/* Header */}
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

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: '₹0.00', color: config.color },
          { label: 'This Month', value: '₹0.00', color: '#3b82f6' },
          { label: 'Pending', value: '₹0.00', color: '#f59e0b' },
          { label: 'Count', value: '0', color: '#6b7280' },
        ].map((s, i) => (
          <Card key={i} className="bg-white border-[#e5e7eb]">
            <CardContent className="p-3">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <p className="text-[18px] font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-[#f3f4f6] rounded-lg p-0.5">
          {statusTabs.map(tab => (
            <button key={tab} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${tab === 'All' ? 'bg-white text-[#0d333f] shadow-sm' : 'text-[#6b7280] hover:text-[#0d333f]'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <Input placeholder="Search..." className="pl-8 h-8 text-[12px] w-[200px] border-[#d4d7dc]" />
        </div>
        <Button variant="outline" size="sm" className="text-[11px] border-[#d4d7dc]">
          <Filter className="w-3.5 h-3.5 mr-1" /> Filter
        </Button>
      </div>

      {/* Data Table - Empty State */}
      <Card className="bg-white border-[#e5e7eb]">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
            <span>ID</span>
            <span>Date</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          
          {/* Empty State */}
          <div className="p-12 text-center">
            <Icon className="w-12 h-12 mx-auto mb-3" style={{ color: `${config.color}40` }} />
            <p className="text-[14px] font-medium text-[#6b7280]">No records found</p>
            <p className="text-[12px] text-[#9ca3af] mt-1">Records will appear here as data flows in</p>
            <Button size="sm" className="mt-4 bg-[#2ca01c] hover:bg-[#249317] text-white text-[12px]">
              {config.addLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialManagement;
