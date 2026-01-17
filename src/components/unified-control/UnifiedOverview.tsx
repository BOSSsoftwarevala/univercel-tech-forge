import { motion } from "framer-motion";
import { 
  Brain, Plug, Search, Users, Code2, Server, DollarSign, 
  AlertTriangle, TrendingUp, Activity, Plus, Trash2, Play, Square, CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const STATS = [
  { label: 'Total AI Services', value: '12', icon: Brain, color: 'violet', trend: '+2' },
  { label: 'Total APIs', value: '24', icon: Plug, color: 'blue', trend: '+5' },
  { label: 'SEO Status', value: 'Good', icon: Search, color: 'emerald', status: 'healthy' },
  { label: 'Leads Today', value: '156', icon: Users, color: 'cyan', trend: '+23' },
  { label: 'Active Dev Tasks', value: '8', icon: Code2, color: 'pink', trend: '-2' },
  { label: 'Running Servers', value: '6', icon: Server, color: 'red', trend: '0' },
  { label: 'Monthly Cost', value: '$2,450', icon: DollarSign, color: 'green', trend: '-12%' },
  { label: 'Unpaid Items', value: '3', icon: AlertTriangle, color: 'amber', alert: true },
  { label: 'Risk Alerts', value: '1', icon: AlertTriangle, color: 'red', alert: true },
];

const RECENT_ITEMS = [
  { id: '1', name: 'GPT-5 LLM', type: 'AI', status: 'running', payment: 'paid', usage: 78 },
  { id: '2', name: 'Stripe API', type: 'API', status: 'running', payment: 'paid', usage: 92 },
  { id: '3', name: 'Main Website SEO', type: 'SEO', status: 'running', payment: 'paid', usage: 65 },
  { id: '4', name: 'Facebook Leads', type: 'Lead', status: 'running', payment: 'unpaid', usage: 45 },
  { id: '5', name: 'Bug Fix #234', type: 'Dev', status: 'stopped', payment: 'paid', usage: 0 },
  { id: '6', name: 'India Server', type: 'Server', status: 'running', payment: 'paid', usage: 88 },
];

export const UnifiedOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Global Dashboard</h1>
          <p className="text-muted-foreground">Complete system overview - All modules unified</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
          <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
            <Play className="w-4 h-4 mr-1" /> Run/Stop
          </Button>
          <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
            <CreditCard className="w-4 h-4 mr-1" /> Pay/Unpay
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`bg-slate-900/50 border-${stat.color}-500/30 hover:border-${stat.color}-500/50 transition-all`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                  {stat.trend && (
                    <Badge variant="outline" className={stat.trend.startsWith('+') ? 'text-emerald-400 border-emerald-500/30' : stat.trend.startsWith('-') ? 'text-red-400 border-red-500/30' : 'text-slate-400'}>
                      {stat.trend}
                    </Badge>
                  )}
                  {stat.alert && (
                    <Badge variant="outline" className="text-red-400 border-red-500/30 animate-pulse">
                      Alert
                    </Badge>
                  )}
                  {stat.status && (
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                      ● {stat.status}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All Services Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            All Services & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Payment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Usage</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {RECENT_ITEMS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 text-sm font-medium text-white">{item.name}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={item.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                        {item.status === 'running' ? '● Running' : '○ Stopped'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={item.payment === 'paid' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}>
                        {item.payment}
                      </Badge>
                    </td>
                    <td className="p-3 w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={item.usage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{item.usage}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          {item.status === 'running' ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
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
