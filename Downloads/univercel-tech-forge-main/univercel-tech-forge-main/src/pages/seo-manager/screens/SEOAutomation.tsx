import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, FileText, Link, Code, Send, Clock, CheckCircle, RefreshCw, Bot, AlertTriangle, Settings } from "lucide-react";
import { toast } from "sonner";

interface Automation {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  lastRun: string;
  nextRun: string;
  runsToday: number;
  successRate: number;
  stats: { label: string; value: string }[];
}

const SEOAutomation = () => {
  const [automations, setAutomations] = useState<Automation[]>([
    { id: "AUTO001", name: "Auto Meta Generation", description: "AI generates meta titles & descriptions based on page content analysis", icon: FileText, enabled: true, lastRun: "12 min ago", nextRun: "In 48 min", runsToday: 24, successRate: 98.2, stats: [{ label: "Pages Processed", value: "1,847" }, { label: "Tags Generated", value: "3,694" }] },
    { id: "AUTO002", name: "Auto Internal Linking", description: "AI discovers and creates contextual internal links between related content", icon: Link, enabled: true, lastRun: "2 hrs ago", nextRun: "In 4 hrs", runsToday: 6, successRate: 95.8, stats: [{ label: "Links Created", value: "342" }, { label: "Pages Connected", value: "289" }] },
    { id: "AUTO003", name: "Auto Schema Markup", description: "Automatically generates JSON-LD schema based on page type detection", icon: Code, enabled: false, lastRun: "Yesterday", nextRun: "Paused", runsToday: 0, successRate: 97.1, stats: [{ label: "Schemas Generated", value: "89" }, { label: "Types Detected", value: "6" }] },
    { id: "AUTO004", name: "Auto Keyword Clustering", description: "Groups related keywords into topic clusters for content strategy", icon: Bot, enabled: true, lastRun: "4 hrs ago", nextRun: "In 20 hrs", runsToday: 1, successRate: 94.5, stats: [{ label: "Clusters Created", value: "28" }, { label: "Keywords Grouped", value: "648" }] },
    { id: "AUTO005", name: "Auto Rank Monitoring", description: "Tracks keyword positions across search engines every 6 hours", icon: RefreshCw, enabled: true, lastRun: "1 hr ago", nextRun: "In 5 hrs", runsToday: 4, successRate: 99.9, stats: [{ label: "Keywords Tracked", value: "648" }, { label: "Engines", value: "3" }] },
    { id: "AUTO006", name: "Auto Issue Detection", description: "Crawls site for SEO issues and creates tickets automatically", icon: AlertTriangle, enabled: true, lastRun: "30 min ago", nextRun: "In 30 min", runsToday: 48, successRate: 96.3, stats: [{ label: "Issues Found Today", value: "3" }, { label: "Auto-Fixed", value: "1" }] },
  ]);

  const handleToggle = (id: string) => {
    setAutomations(prev => prev.map(a => {
      if (a.id === id) {
        const newEnabled = !a.enabled;
        toast.success(`${a.name} ${newEnabled ? 'enabled' : 'disabled'}`);
        return { ...a, enabled: newEnabled, nextRun: newEnabled ? "Scheduled" : "Paused" };
      }
      return a;
    }));
  };

  const handleRunNow = (id: string) => {
    const auto = automations.find(a => a.id === id);
    toast.info(`Running ${auto?.name} now...`);
    setTimeout(() => {
      setAutomations(prev => prev.map(a => a.id === id ? { ...a, lastRun: "Just now", runsToday: a.runsToday + 1 } : a));
      toast.success(`${auto?.name} completed successfully`);
    }, 2000);
  };

  const totalRuns = automations.reduce((s, a) => s + a.runsToday, 0);
  const avgSuccess = (automations.reduce((s, a) => s + a.successRate, 0) / automations.length).toFixed(1);
  const activeCount = automations.filter(a => a.enabled).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">SEO Automation Engine</h2>
        <Badge className="bg-cyan-500/20 text-cyan-400"><Zap className="h-3 w-3 mr-1" /> AI-Powered</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Active Automations</p><p className="text-2xl font-bold text-emerald-400">{activeCount}/{automations.length}</p></CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Runs Today</p><p className="text-2xl font-bold text-white">{totalRuns}</p></CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Avg Success Rate</p><p className="text-2xl font-bold text-cyan-400">{avgSuccess}%</p></CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Time Saved</p><p className="text-2xl font-bold text-purple-400">156 hrs</p><p className="text-xs text-slate-500">this month</p></CardContent></Card>
      </div>

      {/* Automation Cards */}
      <div className="space-y-4">
        {automations.map((auto, i) => (
          <motion.div key={auto.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={`border ${auto.enabled ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-900/30 border-slate-800/50 opacity-70'}`}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${auto.enabled ? 'bg-cyan-500/20' : 'bg-slate-700/30'}`}>
                      <auto.icon className={`h-6 w-6 ${auto.enabled ? 'text-cyan-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-semibold text-white">{auto.name}</h3>
                        <Badge className={auto.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}>
                          {auto.enabled ? "ACTIVE" : "PAUSED"}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm">{auto.description}</p>
                      
                      <div className="flex items-center gap-6 mt-3 text-xs">
                        <span className="text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Last: {auto.lastRun}</span>
                        <span className="text-slate-500 flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Next: {auto.nextRun}</span>
                        <span className="text-slate-500">Runs today: <span className="text-white">{auto.runsToday}</span></span>
                        <span className="text-slate-500">Success: <span className="text-emerald-400">{auto.successRate}%</span></span>
                      </div>

                      <div className="flex gap-4 mt-3">
                        {auto.stats.map(s => (
                          <div key={s.label} className="bg-slate-800/50 rounded px-3 py-1.5">
                            <p className="text-[10px] text-slate-500">{s.label}</p>
                            <p className="text-sm font-bold text-cyan-400">{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Switch checked={auto.enabled} onCheckedChange={() => handleToggle(auto.id)} />
                    {auto.enabled && (
                      <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs"
                        onClick={() => handleRunNow(auto.id)}>
                        <Zap className="h-3 w-3 mr-1" /> Run Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SEOAutomation;
