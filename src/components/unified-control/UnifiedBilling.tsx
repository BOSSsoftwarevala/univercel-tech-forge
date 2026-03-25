import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, Brain, Plug, Server, Search, Users, Code2,
  DollarSign, TrendingDown, AlertTriangle, Square, Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CostCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  cost: number;
  budget: number;
  items: number;
  paid: number;
  unpaid: number;
  trend: string;
}

const COST_CATEGORIES: CostCategory[] = [
  { id: 'ai', name: 'AI Cost', icon: Brain, color: 'violet', cost: 1250, budget: 2000, items: 12, paid: 10, unpaid: 2, trend: '-5%' },
  { id: 'api', name: 'API Cost', icon: Plug, color: 'blue', cost: 380, budget: 500, items: 18, paid: 15, unpaid: 3, trend: '+2%' },
  { id: 'server', name: 'Server Cost', icon: Server, color: 'red', cost: 850, budget: 1000, items: 8, paid: 6, unpaid: 2, trend: '-8%' },
  { id: 'seo', name: 'SEO Cost', icon: Search, color: 'emerald', cost: 350, budget: 400, items: 4, paid: 4, unpaid: 0, trend: '0%' },
  { id: 'lead', name: 'Lead Cost', icon: Users, color: 'cyan', cost: 220, budget: 300, items: 9, paid: 8, unpaid: 1, trend: '-12%' },
  { id: 'dev', name: 'Dev Cost', icon: Code2, color: 'pink', cost: 0, budget: 500, items: 8, paid: 8, unpaid: 0, trend: '0%' },
];

const UNPAID_ITEMS = [
  { id: '1', name: 'Claude 3 AI', category: 'AI', amount: 250, dueDate: 'Overdue', status: 'critical' },
  { id: '2', name: 'Runway Video AI', category: 'AI', amount: 180, dueDate: '2 days', status: 'warning' },
  { id: '3', name: 'HubSpot CRM', category: 'API', amount: 120, dueDate: '5 days', status: 'normal' },
  { id: '4', name: 'Salesforce', category: 'API', amount: 200, dueDate: '7 days', status: 'normal' },
  { id: '5', name: 'Backup Server', category: 'Server', amount: 95, dueDate: '3 days', status: 'warning' },
  { id: '6', name: 'Africa CDN', category: 'Server', amount: 45, dueDate: '10 days', status: 'normal' },
  { id: '7', name: 'CRM Sync Leads', category: 'Lead', amount: 30, dueDate: '4 days', status: 'normal' },
  { id: '8', name: 'Competitor SEO', category: 'SEO', amount: 150, dueDate: 'Overdue', status: 'critical' },
];

export const UnifiedBilling = () => {
  const totalCost = COST_CATEGORIES.reduce((a, b) => a + b.cost, 0);
  const totalBudget = COST_CATEGORIES.reduce((a, b) => a + b.budget, 0);
  const totalUnpaid = UNPAID_ITEMS.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-400" />
            Billing & Usage
          </h1>
          <p className="text-muted-foreground">Global cost overview - Auto calculation - Auto stop on unpaid</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <DollarSign className="w-4 h-4 mr-1" /> Pay All
          </Button>
          <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400">
            <TrendingDown className="w-4 h-4 mr-1" /> Optimize
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-green-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-400">${totalCost}</p>
            <p className="text-xs text-muted-foreground">Total Monthly Cost</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">${totalBudget}</p>
            <p className="text-xs text-muted-foreground">Total Budget</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">${totalUnpaid}</p>
            <p className="text-xs text-muted-foreground">Unpaid Total</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-violet-400">{Math.round((totalCost / totalBudget) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Budget Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Category */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">Cost by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {COST_CATEGORIES.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className={`bg-slate-800/50 border-${cat.color}-500/30`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <cat.icon className={`w-5 h-5 text-${cat.color}-400`} />
                        <span className="font-medium text-white">{cat.name}</span>
                      </div>
                      <Badge className={cat.trend.startsWith('-') ? 'bg-emerald-500/20 text-emerald-400' : cat.trend === '0%' ? 'bg-slate-500/20 text-slate-400' : 'bg-red-500/20 text-red-400'}>
                        {cat.trend}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cost</span>
                        <span className="font-bold text-white">${cat.cost}</span>
                      </div>
                      <Progress value={(cat.cost / cat.budget) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Budget: ${cat.budget}</span>
                        <span>{Math.round((cat.cost / cat.budget) * 100)}%</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-border/30">
                        <span className="text-emerald-400">Paid: {cat.paid}</span>
                        <span className="text-amber-400">Unpaid: {cat.unpaid}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unpaid Items */}
      <Card className="bg-slate-900/50 border-amber-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Unpaid Items - Auto STOP if not paid
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Item</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Category</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Due</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {UNPAID_ITEMS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 text-sm font-medium text-white">{item.name}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </td>
                    <td className="p-3 text-sm font-bold text-white">${item.amount}</td>
                    <td className="p-3">
                      <Badge className={
                        item.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                        item.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }>
                        {item.dueDate}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                          <CreditCard className="w-3 h-3 mr-1" />
                          Pay
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-400">
                          <Square className="w-3 h-3 mr-1" />
                          Stop
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
