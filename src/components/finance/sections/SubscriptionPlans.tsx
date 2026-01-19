/**
 * SUBSCRIPTION & PLANS SECTION
 * Active, Expired, Renewal, Upgrade, Downgrade Plans
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Search,
  Calendar,
  Users,
  Crown,
  Zap
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface SubscriptionPlansProps {
  activeView: FinanceView;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'plan_active': return 'Active Plans';
      case 'plan_expired': return 'Expired Plans';
      case 'plan_renewal': return 'Renewal Due';
      case 'plan_upgrade': return 'Plan Upgrades';
      case 'plan_downgrade': return 'Plan Downgrades';
      default: return 'Subscription & Plans';
    }
  };

  const plans = [
    { id: 'SUB001', user: 'Delhi Franchise', plan: 'Enterprise', price: '₹99,999/yr', start: '01 Jan 2024', end: '31 Dec 2024', daysLeft: 350, status: 'Active' },
    { id: 'SUB002', user: 'Mumbai Reseller', plan: 'Professional', price: '₹49,999/yr', start: '15 Feb 2024', end: '14 Feb 2025', daysLeft: 25, status: 'Renewal Due' },
    { id: 'SUB003', user: 'Bangalore User', plan: 'Basic', price: '₹9,999/yr', start: '01 Mar 2023', end: '28 Feb 2024', daysLeft: 0, status: 'Expired' },
    { id: 'SUB004', user: 'Chennai Franchise', plan: 'Enterprise', price: '₹99,999/yr', start: '10 Apr 2024', end: '09 Apr 2025', daysLeft: 280, status: 'Active' },
    { id: 'SUB005', user: 'Pune Reseller', plan: 'Professional', price: '₹49,999/yr', start: '20 May 2024', end: '19 May 2025', daysLeft: 120, status: 'Active' },
  ];

  const stats = [
    { label: 'Active Subscriptions', value: '1,234', icon: CheckCircle, color: 'emerald' },
    { label: 'Expired', value: '56', icon: XCircle, color: 'red' },
    { label: 'Renewal Due', value: '89', icon: RefreshCw, color: 'amber' },
    { label: 'MRR', value: '₹45.6L', icon: TrendingUp, color: 'blue' },
  ];

  const planTypes = [
    { name: 'Basic', price: '₹9,999/yr', features: ['5 Users', 'Basic Support', '10GB Storage'], color: 'slate' },
    { name: 'Professional', price: '₹49,999/yr', features: ['25 Users', 'Priority Support', '100GB Storage'], color: 'blue' },
    { name: 'Enterprise', price: '₹99,999/yr', features: ['Unlimited Users', '24/7 Support', '1TB Storage'], color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage subscription plans and renewals</p>
        </div>
        <Button size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          Send Renewal Reminders
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

      {/* Plan Types Overview (for upgrade/downgrade views) */}
      {(activeView === 'plan_upgrade' || activeView === 'plan_downgrade') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planTypes.map((plan) => (
            <Card key={plan.name} className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${plan.name === 'Enterprise' ? 'ring-2 ring-purple-500' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className={`w-5 h-5 text-${plan.color}-500`} />
                  <h3 className="font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                  {plan.name === 'Enterprise' && <Badge className="text-[10px]">Popular</Badge>}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">Select Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search subscriptions by user, plan, or ID..." className="pl-10" />
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">User/Client</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Period</th>
                  <th className="pb-3 font-medium">Days Left</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {plans.map((sub) => (
                  <tr key={sub.id} className="text-sm">
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{sub.id}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{sub.user}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{sub.plan}</Badge>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{sub.price}</td>
                    <td className="py-3 text-slate-500 text-xs">{sub.start} - {sub.end}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={sub.daysLeft > 0 ? (sub.daysLeft / 365) * 100 : 0} className="w-16 h-2" />
                        <span className="text-xs text-slate-500">{sub.daysLeft}d</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge 
                        variant={
                          sub.status === 'Active' ? 'default' : 
                          sub.status === 'Expired' ? 'destructive' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Upgrade
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Renew
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

export default SubscriptionPlans;
