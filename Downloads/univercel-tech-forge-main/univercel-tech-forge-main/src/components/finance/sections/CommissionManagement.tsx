/**
 * COMMISSION MANAGEMENT SECTION
 * Franchise, Reseller, Influencer Commissions, Rules, Auto Deduction
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2,
  Users,
  Megaphone,
  Settings,
  Zap,
  Search,
  Percent,
  DollarSign,
  TrendingUp,
  Calculator,
  Edit,
  Eye
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface CommissionManagementProps {
  activeView: FinanceView;
}

const CommissionManagement: React.FC<CommissionManagementProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'commission_franchise': return 'Franchise Commission';
      case 'commission_reseller': return 'Reseller Commission';
      case 'commission_influencer': return 'Influencer Payout';
      case 'commission_rules': return 'Commission Rules';
      case 'commission_auto_deduct': return 'Auto Deduction';
      default: return 'Commission Management';
    }
  };

  const commissions = [
    { id: 'COM001', name: 'Delhi Franchise', type: 'Franchise', rate: '15%', earned: '₹2,50,000', paid: '₹2,00,000', pending: '₹50,000', status: 'Pending' },
    { id: 'COM002', name: 'Mumbai Reseller', type: 'Reseller', rate: '10%', earned: '₹1,25,000', paid: '₹1,25,000', pending: '₹0', status: 'Paid' },
    { id: 'COM003', name: 'Tech Influencer', type: 'Influencer', rate: '8%', earned: '₹75,000', paid: '₹50,000', pending: '₹25,000', status: 'Pending' },
    { id: 'COM004', name: 'Bangalore Franchise', type: 'Franchise', rate: '15%', earned: '₹3,00,000', paid: '₹3,00,000', pending: '₹0', status: 'Paid' },
    { id: 'COM005', name: 'Chennai Reseller', type: 'Reseller', rate: '12%', earned: '₹90,000', paid: '₹60,000', pending: '₹30,000', status: 'Processing' },
  ];

  const rules = [
    { id: 'RULE001', name: 'Franchise Base Rate', type: 'Franchise', rate: '15%', condition: 'All sales', status: 'Active' },
    { id: 'RULE002', name: 'Reseller Standard', type: 'Reseller', rate: '10%', condition: 'Direct referrals', status: 'Active' },
    { id: 'RULE003', name: 'Influencer Tier 1', type: 'Influencer', rate: '8%', condition: '< 10K followers', status: 'Active' },
    { id: 'RULE004', name: 'Influencer Tier 2', type: 'Influencer', rate: '12%', condition: '10K-100K followers', status: 'Active' },
    { id: 'RULE005', name: 'Volume Bonus', type: 'All', rate: '+2%', condition: '> ₹10L monthly', status: 'Active' },
  ];

  const stats = [
    { label: 'Total Earned', value: '₹8.4L', icon: DollarSign, color: 'blue' },
    { label: 'Total Paid', value: '₹6.35L', icon: TrendingUp, color: 'emerald' },
    { label: 'Pending', value: '₹2.05L', icon: Calculator, color: 'amber' },
    { label: 'Avg Rate', value: '11.5%', icon: Percent, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage commissions and payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Rules
          </Button>
          <Button size="sm" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Process Payouts
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

      {/* Commission Rules (for commission_rules view) */}
      {activeView === 'commission_rules' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Commission Rules</CardTitle>
              <Button size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Percent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{rule.name}</p>
                      <p className="text-xs text-slate-500">{rule.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{rule.type}</Badge>
                    <span className="text-lg font-bold text-emerald-600">{rule.rate}</span>
                    <Badge variant={rule.status === 'Active' ? 'default' : 'secondary'}>{rule.status}</Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search by name, type, or ID..." className="pl-10" />
      </div>

      {/* Commissions Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Commission Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Rate</th>
                  <th className="pb-3 font-medium">Earned</th>
                  <th className="pb-3 font-medium">Paid</th>
                  <th className="pb-3 font-medium">Pending</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="text-sm">
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{comm.id}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{comm.name}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                    </td>
                    <td className="py-3 font-semibold text-blue-600">{comm.rate}</td>
                    <td className="py-3 text-slate-900 dark:text-white">{comm.earned}</td>
                    <td className="py-3 text-emerald-600">{comm.paid}</td>
                    <td className="py-3 text-amber-600">{comm.pending}</td>
                    <td className="py-3">
                      <Badge 
                        variant={
                          comm.status === 'Paid' ? 'default' : 
                          comm.status === 'Pending' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {comm.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Pay
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionManagement;
