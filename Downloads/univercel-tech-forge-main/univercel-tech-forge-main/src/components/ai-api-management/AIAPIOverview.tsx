import { motion } from "framer-motion";
import { 
  Activity, DollarSign, Zap, AlertTriangle, Play, Square,
  CreditCard, TrendingUp, Brain, Plug
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AIAPIServicesTable } from "./AIAPIServicesTable";

const SUMMARY_CARDS = [
  { label: 'Total Services', value: '24', icon: Zap, color: 'orange', change: '+3' },
  { label: 'Active (Running)', value: '18', icon: Play, color: 'emerald', change: '+2' },
  { label: 'Stopped', value: '6', icon: Square, color: 'slate', change: '-1' },
  { label: 'Paid', value: '15', icon: CreditCard, color: 'blue', change: '+1' },
  { label: 'Unpaid', value: '3', icon: AlertTriangle, color: 'amber', change: '0' },
  { label: 'Monthly Cost', value: '$847', icon: DollarSign, color: 'violet', change: '+12%' },
  { label: 'Today Usage', value: '1.2M', icon: Activity, color: 'cyan', change: '+8%' },
  { label: 'Risk Alerts', value: '2', icon: AlertTriangle, color: 'red', change: '+1' },
];

export const AIAPIOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI & API Dashboard</h1>
          <p className="text-sm text-muted-foreground">Centralized control for all services</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50">
          <Activity className="w-3 h-3 mr-1 animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              "bg-gradient-to-br border transition-all hover:scale-[1.02]",
              card.color === 'orange' && "from-orange-500/10 to-amber-500/5 border-orange-500/30",
              card.color === 'emerald' && "from-emerald-500/10 to-green-500/5 border-emerald-500/30",
              card.color === 'slate' && "from-slate-500/10 to-zinc-500/5 border-slate-500/30",
              card.color === 'blue' && "from-blue-500/10 to-cyan-500/5 border-blue-500/30",
              card.color === 'amber' && "from-amber-500/10 to-yellow-500/5 border-amber-500/30",
              card.color === 'violet' && "from-violet-500/10 to-purple-500/5 border-violet-500/30",
              card.color === 'cyan' && "from-cyan-500/10 to-blue-500/5 border-cyan-500/30",
              card.color === 'red' && "from-red-500/10 to-rose-500/5 border-red-500/30",
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className={cn(
                    "w-5 h-5",
                    card.color === 'orange' && "text-orange-400",
                    card.color === 'emerald' && "text-emerald-400",
                    card.color === 'slate' && "text-slate-400",
                    card.color === 'blue' && "text-blue-400",
                    card.color === 'amber' && "text-amber-400",
                    card.color === 'violet' && "text-violet-400",
                    card.color === 'cyan' && "text-cyan-400",
                    card.color === 'red' && "text-red-400",
                  )} />
                  <Badge variant="outline" className={cn(
                    "text-[10px] px-1.5",
                    card.change.startsWith('+') ? "text-emerald-400 border-emerald-500/50" : 
                    card.change.startsWith('-') ? "text-red-400 border-red-500/50" : 
                    "text-muted-foreground border-border/50"
                  )}>
                    {card.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <Brain className="w-4 h-4 text-violet-400" />
              AI Models Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'Text AI (LLM)', value: 45, color: 'violet' },
                { name: 'Image AI', value: 25, color: 'blue' },
                { name: 'Voice AI', value: 15, color: 'emerald' },
                { name: 'Video AI', value: 10, color: 'orange' },
                { name: 'Multimodal', value: 5, color: 'pink' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">{item.name}</span>
                  <Progress value={item.value} className="flex-1 h-2" />
                  <span className="text-xs text-white w-8">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <Plug className="w-4 h-4 text-blue-400" />
              API Services Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'Payment APIs', value: 30, color: 'emerald' },
                { name: 'Messaging APIs', value: 25, color: 'blue' },
                { name: 'Auth APIs', value: 20, color: 'violet' },
                { name: 'Storage APIs', value: 15, color: 'amber' },
                { name: 'Analytics APIs', value: 10, color: 'cyan' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">{item.name}</span>
                  <Progress value={item.value} className="flex-1 h-2" />
                  <span className="text-xs text-white w-8">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Services Table */}
      <AIAPIServicesTable />
    </div>
  );
};
