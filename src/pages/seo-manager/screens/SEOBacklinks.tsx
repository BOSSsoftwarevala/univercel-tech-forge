import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, TrendingUp, TrendingDown, AlertTriangle, Shield, ExternalLink, Search, Plus, Trash2, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const backlinkGrowth = [
  { month: "Oct", total: 10800, new: 420, lost: 180 },
  { month: "Nov", total: 11200, new: 580, lost: 180 },
  { month: "Dec", total: 11600, new: 540, lost: 140 },
  { month: "Jan", total: 11900, new: 480, lost: 180 },
  { month: "Feb", total: 12100, new: 380, lost: 180 },
  { month: "Mar", total: 12400, new: 460, lost: 160 },
];

interface Backlink {
  id: string;
  source: string;
  target: string;
  anchor: string;
  da: number;
  type: "dofollow" | "nofollow";
  status: "active" | "lost" | "toxic";
  firstSeen: string;
}

const mockBacklinks: Backlink[] = [
  { id: "BL001", source: "techcrunch.com/article/...", target: "/products/software", anchor: "software development", da: 94, type: "dofollow", status: "active", firstSeen: "Jan 2026" },
  { id: "BL002", source: "forbes.com/business/...", target: "/enterprise", anchor: "enterprise solution", da: 95, type: "dofollow", status: "active", firstSeen: "Feb 2026" },
  { id: "BL003", source: "medium.com/@author/...", target: "/blog/trends", anchor: "read more", da: 62, type: "nofollow", status: "active", firstSeen: "Dec 2025" },
  { id: "BL004", source: "spamsite123.xyz/link", target: "/home", anchor: "click here", da: 5, type: "dofollow", status: "toxic", firstSeen: "Mar 2026" },
  { id: "BL005", source: "github.com/repo/...", target: "/docs/api", anchor: "API docs", da: 97, type: "nofollow", status: "active", firstSeen: "Nov 2025" },
  { id: "BL006", source: "reddit.com/r/...", target: "/products/crm", anchor: "best CRM", da: 91, type: "nofollow", status: "active", firstSeen: "Jan 2026" },
  { id: "BL007", source: "old-blog.net/post", target: "/services", anchor: "services", da: 28, type: "dofollow", status: "lost", firstSeen: "Sep 2025" },
];

const SEOBacklinks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getDaColor = (da: number) => da >= 70 ? "text-emerald-400" : da >= 40 ? "text-amber-400" : "text-red-400";
  const filtered = mockBacklinks.filter(bl => {
    if (searchQuery && !bl.source.includes(searchQuery) && !bl.anchor.includes(searchQuery)) return false;
    if (activeTab === "dofollow") return bl.type === "dofollow" && bl.status !== "toxic";
    if (activeTab === "toxic") return bl.status === "toxic";
    if (activeTab === "lost") return bl.status === "lost";
    return true;
  });

  const totalActive = mockBacklinks.filter(b => b.status === "active").length;
  const toxicCount = mockBacklinks.filter(b => b.status === "toxic").length;
  const dofollowCount = mockBacklinks.filter(b => b.type === "dofollow" && b.status === "active").length;
  const avgDA = Math.round(mockBacklinks.filter(b => b.status === "active").reduce((s, b) => s + b.da, 0) / totalActive);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Backlink Monitor</h2>
        <Button onClick={() => toast.info("Scanning for new backlinks...")} className="bg-cyan-600 hover:bg-cyan-700">
          <Search className="h-4 w-4 mr-2" /> Scan Backlinks
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Total Backlinks</p><p className="text-2xl font-bold text-white">12,400</p></CardContent></Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-emerald-400">Active</p><p className="text-2xl font-bold text-emerald-400">{totalActive}</p></CardContent></Card>
        <Card className="bg-blue-500/10 border-blue-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-blue-400">Dofollow</p><p className="text-2xl font-bold text-blue-400">{dofollowCount}</p></CardContent></Card>
        <Card className="bg-red-500/10 border-red-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-red-400">Toxic</p><p className="text-2xl font-bold text-red-400">{toxicCount}</p></CardContent></Card>
        <Card className="bg-purple-500/10 border-purple-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-purple-400">Avg DA</p><p className="text-2xl font-bold text-purple-400">{avgDA}</p></CardContent></Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2"><CardTitle className="text-cyan-400 text-base">Backlink Growth</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={backlinkGrowth}>
              <defs>
                <linearGradient id="blGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="total" stroke="#06b6d4" fill="url(#blGrad)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="new" stroke="#10b981" fill="none" strokeWidth={1.5} name="New" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Search backlinks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-600">All</TabsTrigger>
          <TabsTrigger value="dofollow" className="data-[state=active]:bg-blue-600">Dofollow</TabsTrigger>
          <TabsTrigger value="toxic" className="data-[state=active]:bg-red-600">Toxic</TabsTrigger>
          <TabsTrigger value="lost" className="data-[state=active]:bg-slate-600">Lost</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400">Source</TableHead>
                <TableHead className="text-slate-400">Target</TableHead>
                <TableHead className="text-slate-400">Anchor</TableHead>
                <TableHead className="text-slate-400">DA</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(bl => (
                <TableRow key={bl.id} className="border-slate-700/50 hover:bg-slate-800/30">
                  <TableCell className="text-slate-300 text-xs font-mono max-w-xs truncate">{bl.source}</TableCell>
                  <TableCell className="text-slate-400 text-xs font-mono">{bl.target}</TableCell>
                  <TableCell className="text-white text-sm">{bl.anchor}</TableCell>
                  <TableCell className={`font-bold ${getDaColor(bl.da)}`}>{bl.da}</TableCell>
                  <TableCell>
                    <Badge className={bl.type === "dofollow" ? "bg-blue-500/20 text-blue-400" : "bg-slate-500/20 text-slate-400"}>{bl.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={bl.status === "active" ? "bg-emerald-500/20 text-emerald-400" : bl.status === "toxic" ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}>
                      {bl.status === "toxic" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {bl.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {toxicCount > 0 && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-400">{toxicCount} Toxic Backlinks Detected</p>
                <p className="text-xs text-red-400/70">Submit disavow request to protect your domain authority</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400" onClick={() => toast.info("Disavow request submitted for review")}>
              <Shield className="h-3.5 w-3.5 mr-1.5" /> Disavow
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SEOBacklinks;
