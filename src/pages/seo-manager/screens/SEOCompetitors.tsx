import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Eye, TrendingUp, TrendingDown, Search, Globe, Link2, FileText, Zap, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { toast } from "sonner";

interface Competitor {
  id: string;
  domain: string;
  da: number;
  traffic: string;
  keywords: number;
  backlinks: string;
  topKeywordOverlap: number;
  trend: "up" | "down" | "stable";
  status: "monitoring" | "paused";
}

const competitors: Competitor[] = [
  { id: "C001", domain: "competitor-a.com", da: 72, traffic: "890K", keywords: 4200, backlinks: "45K", topKeywordOverlap: 34, trend: "up", status: "monitoring" },
  { id: "C002", domain: "competitor-b.io", da: 65, traffic: "520K", keywords: 2800, backlinks: "28K", topKeywordOverlap: 48, trend: "up", status: "monitoring" },
  { id: "C003", domain: "competitor-c.com", da: 58, traffic: "340K", keywords: 1900, backlinks: "18K", topKeywordOverlap: 22, trend: "down", status: "monitoring" },
  { id: "C004", domain: "competitor-d.net", da: 51, traffic: "180K", keywords: 1200, backlinks: "12K", topKeywordOverlap: 15, trend: "stable", status: "paused" },
];

const comparisonData = [
  { metric: "DA", you: 54, compA: 72, compB: 65 },
  { metric: "Traffic", you: 45, compA: 89, compB: 52 },
  { metric: "Keywords", you: 648, compA: 4200, compB: 2800 },
  { metric: "Backlinks", you: 12, compA: 45, compB: 28 },
];

const radarData = [
  { subject: "On-Page", you: 92, compA: 85, compB: 78 },
  { subject: "Technical", you: 78, compA: 82, compB: 71 },
  { subject: "Content", you: 85, compA: 90, compB: 88 },
  { subject: "Backlinks", you: 62, compA: 88, compB: 72 },
  { subject: "UX", you: 88, compA: 75, compB: 80 },
  { subject: "Speed", you: 91, compA: 70, compB: 82 },
];

const keywordGaps = [
  { keyword: "enterprise saas platform", yourPos: null, compAPos: 3, compBPos: 8, volume: 6800, difficulty: 62 },
  { keyword: "business automation tools", yourPos: 45, compAPos: 5, compBPos: 12, volume: 9200, difficulty: 58 },
  { keyword: "workflow management software", yourPos: null, compAPos: 7, compBPos: 4, volume: 5400, difficulty: 51 },
  { keyword: "team collaboration platform", yourPos: 52, compAPos: 2, compBPos: 9, volume: 12000, difficulty: 72 },
  { keyword: "project management api", yourPos: null, compAPos: 11, compBPos: 15, volume: 3800, difficulty: 38 },
];

const SEOCompetitors = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Competitor Intelligence</h2>
        <Button onClick={() => toast.info("Add competitor domain for monitoring")} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" /> Add Competitor
        </Button>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitors.map((comp, i) => (
          <motion.div key={comp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`border ${comp.status === "monitoring" ? "bg-slate-900/50 border-slate-700/50" : "bg-slate-900/30 border-slate-800/50 opacity-70"}`}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-white font-medium">{comp.domain}</span>
                  </div>
                  {comp.trend === "up" ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : comp.trend === "down" ? <TrendingDown className="h-4 w-4 text-red-400" /> : <span className="text-slate-500 text-xs">—</span>}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">DA</p><p className="text-white font-bold">{comp.da}</p></div>
                  <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">Traffic</p><p className="text-white font-bold">{comp.traffic}</p></div>
                  <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">Keywords</p><p className="text-white font-bold">{comp.keywords.toLocaleString()}</p></div>
                  <div className="bg-slate-800/50 rounded p-2"><p className="text-slate-500">Overlap</p><p className="text-amber-400 font-bold">{comp.topKeywordOverlap}%</p></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Radar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">SEO Strength Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="You" dataKey="you" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Competitor A" dataKey="compA" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                <Radar name="Competitor B" dataKey="compB" stroke="#a855f7" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">Metrics Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="metric" stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="you" fill="#06b6d4" radius={[0,4,4,0]} name="You" />
                <Bar dataKey="compA" fill="#ef4444" radius={[0,4,4,0]} name="Competitor A" />
                <Bar dataKey="compB" fill="#a855f7" radius={[0,4,4,0]} name="Competitor B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Gap Analysis */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-400 text-base flex items-center gap-2"><Target className="h-5 w-5" /> Keyword Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-slate-400">Keyword</TableHead>
                <TableHead className="text-slate-400">Your Pos</TableHead>
                <TableHead className="text-slate-400">Comp A</TableHead>
                <TableHead className="text-slate-400">Comp B</TableHead>
                <TableHead className="text-slate-400">Volume</TableHead>
                <TableHead className="text-slate-400">KD</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywordGaps.map((gap, i) => (
                <TableRow key={i} className="border-slate-700/30 hover:bg-slate-800/30">
                  <TableCell className="text-white text-sm font-medium">{gap.keyword}</TableCell>
                  <TableCell className={gap.yourPos ? "text-cyan-400 font-bold" : "text-red-400"}>
                    {gap.yourPos ? `#${gap.yourPos}` : "Not ranking"}
                  </TableCell>
                  <TableCell className="text-slate-300">#{gap.compAPos}</TableCell>
                  <TableCell className="text-slate-300">#{gap.compBPos}</TableCell>
                  <TableCell className="text-slate-300">{gap.volume.toLocaleString()}</TableCell>
                  <TableCell className={gap.difficulty >= 60 ? "text-red-400" : gap.difficulty >= 40 ? "text-amber-400" : "text-emerald-400"}>{gap.difficulty}%</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-purple-400" onClick={() => toast.success(`Added "${gap.keyword}" to tracking`)}>
                      <Plus className="h-3 w-3 mr-1" /> Track
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SEOCompetitors;
