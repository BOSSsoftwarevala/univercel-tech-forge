import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Cpu, Activity, Zap, DollarSign, Clock, CheckCircle2,
  AlertTriangle, ArrowRightLeft, Shield, BarChart3, Globe,
  Play, Pause, RotateCcw, Trash2
} from "lucide-react";

interface AIProvider {
  id: string;
  name: string;
  models: string[];
  status: "active" | "standby" | "error";
  latency: number;
  costToday: number;
  requests: number;
  uptime: number;
}

const PROVIDERS: AIProvider[] = [
  { id: "openai", name: "OpenAI", models: ["GPT-5", "GPT-5-mini", "GPT-5-nano", "GPT-5.2"], status: "active", latency: 120, costToday: 1240, requests: 3420, uptime: 99.9 },
  { id: "claude", name: "Anthropic Claude", models: ["Claude Sonnet 4", "Claude Haiku"], status: "active", latency: 145, costToday: 890, requests: 2180, uptime: 99.7 },
  { id: "gemini", name: "Google Gemini", models: ["Gemini 2.5 Pro", "Gemini 2.5 Flash", "Gemini 3 Flash"], status: "active", latency: 95, costToday: 560, requests: 4100, uptime: 99.8 },
  { id: "elevenlabs", name: "ElevenLabs", models: ["Turbo v2.5", "Multilingual v2"], status: "active", latency: 200, costToday: 320, requests: 890, uptime: 99.5 },
  { id: "stability", name: "Stability AI", models: ["SDXL", "SD3"], status: "standby", latency: 0, costToday: 0, requests: 0, uptime: 98.2 },
  { id: "replicate", name: "Replicate", models: ["Llama 3", "Mixtral"], status: "standby", latency: 0, costToday: 0, requests: 0, uptime: 97.8 },
];

const FAILOVER_LOG = [
  { id: "1", from: "OpenAI", to: "Claude", reason: "429 Rate Limit", time: "14:32", status: "resolved" },
  { id: "2", from: "Gemini", to: "OpenAI", reason: "503 Timeout", time: "11:15", status: "resolved" },
  { id: "3", from: "ElevenLabs", to: "OpenAI TTS", reason: "Quota exceeded", time: "09:45", status: "active" },
];

const AIRAProviders = () => {
  const totalCost = PROVIDERS.reduce((s, p) => s + p.costToday, 0);
  const totalRequests = PROVIDERS.reduce((s, p) => s + p.requests, 0);
  const activeCount = PROVIDERS.filter(p => p.status === "active").length;

  const statusStyle = (s: string) => {
    if (s === "active") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (s === "standby") return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Providers Hub</h1>
            <p className="text-blue-400/80">Multi-Provider Routing • Auto Failover • Cost Control</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Providers", value: `${activeCount}/${PROVIDERS.length}`, icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Requests", value: totalRequests.toLocaleString(), icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Total Cost Today", value: `₹${totalCost.toLocaleString()}`, icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Avg Latency", value: `${Math.round(PROVIDERS.filter(p => p.status === "active").reduce((s, p) => s + p.latency, 0) / activeCount)}ms`, icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-slate-400">{m.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-3 gap-4">
        {PROVIDERS.map((provider, i) => (
          <motion.div key={provider.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base">{provider.name}</CardTitle>
                  <Badge className={statusStyle(provider.status)}>{provider.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {provider.models.map(m => (
                      <Badge key={m} className="bg-slate-700/50 text-slate-300 text-[10px]">{m}</Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500">Latency</p>
                      <p className="text-white font-medium">{provider.latency || "—"}ms</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Requests</p>
                      <p className="text-white font-medium">{provider.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Cost Today</p>
                      <p className="text-yellow-400 font-medium">₹{provider.costToday.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Uptime</p>
                      <p className="text-emerald-400 font-medium">{provider.uptime}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/30">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10">
                      <Play className="w-3 h-3 mr-1" /> Run
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-yellow-400 hover:bg-yellow-500/10">
                      <Pause className="w-3 h-3 mr-1" /> Pause
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-cyan-400 hover:bg-cyan-500/10">
                      <RotateCcw className="w-3 h-3 mr-1" /> Restart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Failover Log */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <ArrowRightLeft className="w-4 h-4 text-orange-400" />
            Auto Failover Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {FAILOVER_LOG.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
              >
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500/20 text-red-400 text-xs">{log.from}</Badge>
                  <span className="text-slate-500">→</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">{log.to}</Badge>
                  <span className="text-sm text-slate-300">{log.reason}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={log.status === "resolved" ? "bg-emerald-500/20 text-emerald-400 text-xs" : "bg-yellow-500/20 text-yellow-400 text-xs"}>{log.status}</Badge>
                  <span className="text-xs text-slate-500">{log.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Routing Flow */}
      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <p className="text-xs text-blue-400/80 mb-3 uppercase tracking-wider font-medium">API Routing Pipeline</p>
        <div className="flex items-center justify-center gap-4">
          {["User Request", "AIRA Reasoning", "Model Selection", "Provider Execution", "Response"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">{s}</div>
              {i < 4 && <span className="text-blue-500/50">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRAProviders;
