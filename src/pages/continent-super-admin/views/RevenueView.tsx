// ============================================
// REVENUE — META BUSINESS MANAGER BILLING
// ============================================
import { useState } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, CreditCard,
  Download, Calendar, ChevronRight, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const RevenueView = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenues = [18.2, 21.5, 19.8, 24.1, 22.7, 24.8];
  const maxRevenue = Math.max(...revenues);

  const transactions = [
    { id: 'TXN-001', desc: 'India Franchise Revenue', amount: '₹8,20,000', date: 'Mar 7, 2026', status: 'completed' },
    { id: 'TXN-002', desc: 'Nigeria Reseller Commission', amount: '₹4,10,000', date: 'Mar 6, 2026', status: 'completed' },
    { id: 'TXN-003', desc: 'EU Enterprise License', amount: '₹3,20,000', date: 'Mar 5, 2026', status: 'completed' },
    { id: 'TXN-004', desc: 'LATAM Franchise Deposit', amount: '₹1,50,000', date: 'Mar 4, 2026', status: 'pending' },
    { id: 'TXN-005', desc: 'APAC Reseller Payout', amount: '-₹2,30,000', date: 'Mar 3, 2026', status: 'completed' },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1c1e21]">Billing & Payments</h1>
          <p className="text-[14px] text-[#65676b] mt-0.5">Revenue overview and transaction history</p>
        </div>
        <Button variant="outline" className="border-[#dddfe2] text-[#1c1e21] text-[13px] h-9">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹24.8L', change: '+18.3%', icon: DollarSign, color: '#1877F2' },
          { label: 'MRR', value: '₹4.1L', change: '+12.5%', icon: TrendingUp, color: '#42b72a' },
          { label: 'Avg Deal Size', value: '₹52K', change: '+8.1%', icon: CreditCard, color: '#8b5cf6' },
          { label: 'Pending Payouts', value: '₹3.8L', change: '12 pending', icon: Clock, color: '#f5a623' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#dddfe2] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#65676b]">{stat.label}</p>
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-[26px] font-bold text-[#1c1e21] mt-2">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-[#42b72a]" />
              <span className="text-[12px] text-[#42b72a]">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-[#dddfe2] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[#1c1e21]">Revenue Trend</h3>
          <div className="flex items-center gap-1 text-[12px] text-[#65676b]">
            <Calendar className="w-3.5 h-3.5" />
            Last 6 months
          </div>
        </div>
        <div className="flex items-end gap-4 h-48 px-4">
          {months.map((month, i) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[11px] font-medium text-[#1c1e21]">₹{revenues[i]}L</span>
              <div 
                className="w-full rounded-t-md transition-all duration-500"
                style={{ 
                  height: `${(revenues[i] / maxRevenue) * 160}px`,
                  backgroundColor: i === months.length - 1 ? '#1877F2' : '#e4e6eb'
                }}
              />
              <span className="text-[11px] text-[#65676b]">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg border border-[#dddfe2] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e4e6eb] flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#1c1e21]">Recent Transactions</h3>
          <button className="text-[13px] text-[#1877F2] font-medium hover:underline">View all</button>
        </div>
        {transactions.map((txn, i) => (
          <div key={txn.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-[#f7f8fa] transition-colors ${
            i < transactions.length - 1 ? 'border-b border-[#f0f2f5]' : ''
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              txn.amount.startsWith('-') ? 'bg-[#e41e3f15]' : 'bg-[#42b72a15]'
            }`}>
              <DollarSign className={`w-4 h-4 ${txn.amount.startsWith('-') ? 'text-[#e41e3f]' : 'text-[#42b72a]'}`} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] text-[#1c1e21] font-medium">{txn.desc}</p>
              <p className="text-[12px] text-[#65676b]">{txn.id} · {txn.date}</p>
            </div>
            <span className={`text-[15px] font-semibold ${txn.amount.startsWith('-') ? 'text-[#e41e3f]' : 'text-[#1c1e21]'}`}>
              {txn.amount}
            </span>
            <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${
              txn.status === 'completed' ? 'bg-[#42b72a15] text-[#42b72a]' : 'bg-[#f5a62315] text-[#f5a623]'
            }`}>
              {txn.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueView;
