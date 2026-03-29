import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Globe, Facebook, Instagram, MessageCircle, Mail,
  Database, Upload, Sparkles, Plus, Trash2, Play, Square, CreditCard, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LeadSource {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  leadsToday: number;
  leadsMonth: number;
  conversion: number;
  aiScore: number;
  autoAssign: boolean;
  autoFollowup: boolean;
}

const LEAD_SOURCES: LeadSource[] = [
  { id: 'website', name: 'Website Forms', type: 'Website', status: 'running', payment: 'paid', leadsToday: 45, leadsMonth: 1250, conversion: 12, aiScore: 85, autoAssign: true, autoFollowup: true },
  { id: 'facebook', name: 'Facebook Leads', type: 'Facebook', status: 'running', payment: 'paid', leadsToday: 32, leadsMonth: 890, conversion: 8, aiScore: 72, autoAssign: true, autoFollowup: true },
  { id: 'google', name: 'Google Ads', type: 'Google Ads', status: 'running', payment: 'paid', leadsToday: 28, leadsMonth: 720, conversion: 15, aiScore: 90, autoAssign: true, autoFollowup: false },
  { id: 'instagram', name: 'Instagram', type: 'Instagram', status: 'running', payment: 'paid', leadsToday: 18, leadsMonth: 450, conversion: 6, aiScore: 65, autoAssign: false, autoFollowup: false },
  { id: 'whatsapp', name: 'WhatsApp', type: 'WhatsApp', status: 'running', payment: 'paid', leadsToday: 56, leadsMonth: 1580, conversion: 22, aiScore: 95, autoAssign: true, autoFollowup: true },
  { id: 'api', name: 'API Import', type: 'API', status: 'running', payment: 'paid', leadsToday: 12, leadsMonth: 340, conversion: 10, aiScore: 78, autoAssign: true, autoFollowup: false },
  { id: 'manual', name: 'Manual Entry', type: 'Manual', status: 'running', payment: 'paid', leadsToday: 8, leadsMonth: 220, conversion: 18, aiScore: 82, autoAssign: false, autoFollowup: false },
  { id: 'crm', name: 'CRM Sync', type: 'CRM', status: 'stopped', payment: 'unpaid', leadsToday: 0, leadsMonth: 0, conversion: 0, aiScore: 0, autoAssign: false, autoFollowup: false },
  { id: 'seo', name: 'SEO Leads', type: 'SEO', status: 'running', payment: 'paid', leadsToday: 23, leadsMonth: 680, conversion: 14, aiScore: 88, autoAssign: true, autoFollowup: true },
];

const LEAD_STAGES = [
  { name: 'Nano', count: 245, color: 'slate' },
  { name: 'Micro', count: 180, color: 'blue' },
  { name: 'Sub', count: 95, color: 'violet' },
  { name: 'Main', count: 45, color: 'amber' },
  { name: 'Converted', count: 28, color: 'emerald' },
];

export const UnifiedLeadManagement = () => {
  const [sources, setSources] = useState(LEAD_SOURCES);

  const toggleStatus = (id: string) => {
    setSources(sources.map(s => 
      s.id === id ? { ...s, status: s.status === 'running' ? 'stopped' : 'running' } : s
    ));
  };

  const totalLeadsToday = sources.reduce((a, b) => a + b.leadsToday, 0);
  const totalLeadsMonth = sources.reduce((a, b) => a + b.leadsMonth, 0);
  const avgConversion = Math.round(sources.filter(s => s.conversion > 0).reduce((a, b) => a + b.conversion, 0) / sources.filter(s => s.conversion > 0).length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Lead Management
          </h1>
          <p className="text-muted-foreground">Full lead flow: Nano → Micro → Sub → Main → Converted</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add Source
          </Button>
          <Button size="sm" variant="outline" className="border-violet-500/50 text-violet-400">
            <Sparkles className="w-4 h-4 mr-1" /> AI Score All
          </Button>
        </div>
      </div>

      {/* Lead Flow Pipeline */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Lead Pipeline Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {LEAD_STAGES.map((stage, idx) => (
              <div key={stage.name} className="flex-1 relative">
                <div className={`p-3 rounded-lg bg-${stage.color}-500/20 border border-${stage.color}-500/30 text-center`}>
                  <p className="text-xl font-bold text-white">{stage.count}</p>
                  <p className={`text-xs text-${stage.color}-400`}>{stage.name}</p>
                </div>
                {idx < LEAD_STAGES.length - 1 && (
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-muted-foreground">→</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">{totalLeadsToday}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{totalLeadsMonth}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{avgConversion}%</p>
            <p className="text-xs text-muted-foreground">Avg Conversion</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">{sources.filter(s => s.autoAssign).length}</p>
            <p className="text-xs text-muted-foreground">Auto-Assign</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{sources.filter(s => s.autoFollowup).length}</p>
            <p className="text-xs text-muted-foreground">Auto-Followup</p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">Lead Sources</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Source</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Today</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Month</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Conv.</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">AI Score</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Features</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {sources.map((source) => (
                  <motion.tr 
                    key={source.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-white">{source.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{source.type}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={source.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                        {source.status === 'running' ? '● RUN' : '○ STOP'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm font-medium text-white">{source.leadsToday}</td>
                    <td className="p-3 text-sm text-muted-foreground">{source.leadsMonth}</td>
                    <td className="p-3">
                      <Badge className={source.conversion >= 15 ? 'bg-emerald-500/20 text-emerald-400' : source.conversion >= 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}>
                        {source.conversion}%
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={source.aiScore} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{source.aiScore}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {source.autoAssign && <Badge className="bg-violet-500/20 text-violet-400 text-[10px]">Auto</Badge>}
                        {source.autoFollowup && <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">Follow</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleStatus(source.id)}
                        >
                          {source.status === 'running' ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          {source.status === 'running' ? 'Stop' : 'Run'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
