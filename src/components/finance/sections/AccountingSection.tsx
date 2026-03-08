/**
 * ACCOUNTING SECTION - CONNECTED TO REAL DATA
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Scale, BarChart3, ArrowRightLeft, FileCheck,
  Download, Calendar, Loader2
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useFinanceStats, formatINR } from '@/hooks/useFinanceData';

interface Props { activeView: FinanceView; }

const AccountingSection: React.FC<Props> = ({ activeView }) => {
  const { data: stats, isLoading } = useFinanceStats();

  const rev = stats?.totalRevenue || 0;
  const exp = stats?.totalExpenses || 0;
  const net = stats?.netProfit || 0;
  const pending = stats?.pendingAmount || 0;
  const payouts = stats?.payoutsDue || 0;

  const configs: Record<string, { title: string; desc: string; icon: React.ElementType; sections: { label: string; debit: string; credit: string }[] }> = {
    acc_balance_sheet: {
      title: 'Balance Sheet', desc: 'Assets, liabilities, and equity overview', icon: Scale,
      sections: [
        { label: 'Total Assets (Revenue + Pending)', debit: formatINR(rev + pending), credit: '' },
        { label: 'Total Liabilities (Payouts Due)', debit: '', credit: formatINR(payouts) },
        { label: 'Total Equity (Net)', debit: '', credit: formatINR(rev + pending - payouts) },
      ],
    },
    acc_profit_loss_statement: {
      title: 'Profit & Loss Statement', desc: 'Income and expenses for the selected period', icon: BarChart3,
      sections: [
        { label: 'Total Income', debit: formatINR(rev), credit: '' },
        { label: 'Total Expenses', debit: '', credit: formatINR(exp) },
        { label: 'Gross Profit', debit: formatINR(rev - exp), credit: '' },
        { label: 'Payouts & Commissions', debit: '', credit: formatINR(payouts) },
        { label: 'Net Profit', debit: formatINR(net - payouts), credit: '' },
      ],
    },
    acc_cash_flow: {
      title: 'Cash Flow Statement', desc: 'Cash inflows and outflows', icon: ArrowRightLeft,
      sections: [
        { label: 'Operating Activities (Revenue)', debit: formatINR(rev), credit: '' },
        { label: 'Operating Expenses', debit: '', credit: formatINR(exp) },
        { label: 'Payout Outflows', debit: '', credit: formatINR(payouts) },
        { label: 'Net Cash Flow', debit: formatINR(rev - exp - payouts), credit: '' },
      ],
    },
    acc_tax_reports: {
      title: 'Tax Reports', desc: 'GST, VAT, TDS and compliance reports', icon: FileCheck,
      sections: [
        { label: 'GST Collected (18% est.)', debit: formatINR(rev * 0.18), credit: '' },
        { label: 'GST Paid (Input)', debit: '', credit: formatINR(exp * 0.18) },
        { label: 'TDS Deducted (2% est.)', debit: '', credit: formatINR(payouts * 0.02) },
        { label: 'Net Tax Liability', debit: formatINR((rev - exp) * 0.18 - payouts * 0.02), credit: '' },
      ],
    },
  };

  const config = configs[activeView] || configs.acc_balance_sheet;
  const Icon = config.icon;

  const totalDebit = config.sections.filter(r => r.debit).reduce((s, r) => {
    const num = parseFloat(r.debit.replace(/[₹,]/g, ''));
    return s + (isNaN(num) ? 0 : num);
  }, 0);
  const totalCredit = config.sections.filter(r => r.credit).reduce((s, r) => {
    const num = parseFloat(r.credit.replace(/[₹,]/g, ''));
    return s + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#0d333f]">{config.title}</h2>
          <p className="text-[13px] text-[#6b7280]">{config.desc}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> This Month
          </Button>
          <Button variant="outline" size="sm" className="text-[12px] border-[#d4d7dc]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2ca01c]" /></div>
      ) : (
        <Card className="bg-white border-[#e5e7eb]">
          <CardHeader className="border-b border-[#e5e7eb] pb-3">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-[#2ca01c]" />
              <CardTitle className="text-[14px] font-semibold text-[#0d333f]">{config.title}</CardTitle>
            </div>
            <p className="text-[11px] text-[#9ca3af]">As of {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 gap-4 px-5 py-2.5 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-semibold text-[#6b7280] uppercase">
              <span>Account</span>
              <span className="text-right">Debit</span>
              <span className="text-right">Credit</span>
            </div>
            {config.sections.map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 px-5 py-3 border-b border-[#f3f4f6] text-[13px] hover:bg-[#f9fafb] transition-colors">
                <span className="font-medium text-[#0d333f]">{row.label}</span>
                <span className="text-right text-[#0d333f]">{row.debit || '—'}</span>
                <span className="text-right text-[#0d333f]">{row.credit || '—'}</span>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 px-5 py-3 bg-[#f0fdf4] text-[13px] font-bold">
              <span className="text-[#0d333f]">Total</span>
              <span className="text-right text-[#2ca01c]">{formatINR(totalDebit)}</span>
              <span className="text-right text-[#2ca01c]">{formatINR(totalCredit)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center py-4">
        <p className="text-[11px] text-[#9ca3af]">
          Data is auto-synced from all financial modules · Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default AccountingSection;
