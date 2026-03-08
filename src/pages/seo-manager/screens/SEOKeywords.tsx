import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Pause, Play, TrendingUp, TrendingDown, Minus, Search, Filter, 
  Sparkles, Target, BarChart3, Globe, ArrowUpDown, Eye, Trash2, Tag
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface Keyword {
  id: string;
  keyword: string;
  page: string;
  position: number;
  prevPosition: number;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: "informational" | "transactional" | "navigational" | "commercial";
  status: "tracking" | "paused";
  country: string;
  trend: number[];
}

const mockKeywords: Keyword[] = [
  { id: "KW001", keyword: "software development services", page: "/products/software", position: 3, prevPosition: 8, volume: 12400, difficulty: 72, cpc: 4.50, intent: "commercial", status: "tracking", country: "US", trend: [12,8,6,5,4,3] },
  { id: "KW002", keyword: "best crm for small business", page: "/products/crm", position: 7, prevPosition: 15, volume: 8900, difficulty: 58, cpc: 6.20, intent: "transactional", status: "tracking", country: "US", trend: [22,18,15,12,9,7] },
  { id: "KW003", keyword: "mobile app development company", page: "/services/mobile", position: 12, prevPosition: 11, volume: 15200, difficulty: 81, cpc: 8.40, intent: "commercial", status: "tracking", country: "Global", trend: [15,14,13,12,11,12] },
  { id: "KW004", keyword: "cloud hosting solutions", page: "/services/cloud", position: 9, prevPosition: 22, volume: 6700, difficulty: 45, cpc: 3.80, intent: "informational", status: "tracking", country: "US", trend: [28,24,20,16,12,9] },
  { id: "KW005", keyword: "enterprise automation platform", page: "/enterprise", position: 4, prevPosition: 5, volume: 4200, difficulty: 67, cpc: 12.50, intent: "transactional", status: "tracking", country: "Global", trend: [8,7,6,5,5,4] },
  { id: "KW006", keyword: "custom software solutions", page: "/products/custom", position: 5, prevPosition: 5, volume: 6300, difficulty: 55, cpc: 5.10, intent: "commercial", status: "paused", country: "US", trend: [6,5,5,5,5,5] },
  { id: "KW007", keyword: "web design agency", page: "/services/web-design", position: 18, prevPosition: 14, volume: 9800, difficulty: 73, cpc: 7.30, intent: "navigational", status: "tracking", country: "UK", trend: [10,11,12,13,15,18] },
  { id: "KW008", keyword: "saas platform builder", page: "/products/saas", position: 21, prevPosition: 35, volume: 3400, difficulty: 42, cpc: 4.90, intent: "informational", status: "tracking", country: "US", trend: [42,38,35,30,25,21] },
];

const opportunityKeywords = [
  { keyword: "ai powered crm tools", volume: 5600, difficulty: 38, currentPos: null, opportunity: 94 },
  { keyword: "no code automation platform", volume: 7200, difficulty: 41, currentPos: null, opportunity: 91 },
  { keyword: "enterprise software pricing", volume: 3800, difficulty: 29, currentPos: 45, opportunity: 87 },
  { keyword: "white label software solution", volume: 2900, difficulty: 33, currentPos: null, opportunity: 85 },
  { keyword: "best project management api", volume: 4100, difficulty: 36, currentPos: 52, opportunity: 82 },
];

const SEOKeywords = () => {
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"position" | "volume" | "difficulty">("position");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");

  const handleToggleTracking = (id: string) => {
    setKeywords(prev => prev.map(kw => 
      kw.id === id ? { ...kw, status: kw.status === "tracking" ? "paused" : "tracking" } : kw
    ));
    const kw = keywords.find(k => k.id === id);
    toast.success(`Tracking ${kw?.status === "tracking" ? "paused" : "resumed"} for "${kw?.keyword}"`);
  };

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredKeywords = keywords
    .filter(kw => {
      if (searchQuery && !kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedTab === "improved") return kw.position < kw.prevPosition;
      if (selectedTab === "declined") return kw.position > kw.prevPosition;
      if (selectedTab === "paused") return kw.status === "paused";
      return true;
    })
    .sort((a, b) => {
      const val = sortAsc ? 1 : -1;
      return (a[sortField] - b[sortField]) * val;
    });

  const getChangeValue = (kw: Keyword) => kw.prevPosition - kw.position;
  const getDifficultyColor = (d: number) => d >= 70 ? "text-red-400" : d >= 40 ? "text-amber-400" : "text-emerald-400";
  const getIntentBadge = (intent: string) => {
    const colors: Record<string, string> = {
      informational: "bg-blue-500/20 text-blue-400",
      transactional: "bg-purple-500/20 text-purple-400",
      navigational: "bg-cyan-500/20 text-cyan-400",
      commercial: "bg-pink-500/20 text-pink-400",
    };
    return colors[intent] || "bg-slate-500/20 text-slate-400";
  };

  const improved = keywords.filter(k => k.position < k.prevPosition).length;
  const declined = keywords.filter(k => k.position > k.prevPosition).length;
  const unchanged = keywords.filter(k => k.position === k.prevPosition).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Keyword Tracker</h2>
        <div className="flex gap-2">
          <Button onClick={() => toast.info("AI keyword discovery started...")} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-4 w-4 mr-2" /> AI Discover
          </Button>
          <Button onClick={() => toast.info("Keyword addition submitted")} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" /> Add Keyword
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-400">Total Tracked</p>
            <p className="text-2xl font-bold text-white">{keywords.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-emerald-400">Improved</p>
            <p className="text-2xl font-bold text-emerald-400">{improved}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-red-400">Declined</p>
            <p className="text-2xl font-bold text-red-400">{declined}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-400">Unchanged</p>
            <p className="text-2xl font-bold text-slate-300">{unchanged}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-amber-400">Top 10</p>
            <p className="text-2xl font-bold text-amber-400">{keywords.filter(k => k.position <= 10).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Search keywords..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-600">All ({keywords.length})</TabsTrigger>
          <TabsTrigger value="improved" className="data-[state=active]:bg-emerald-600">Improved ({improved})</TabsTrigger>
          <TabsTrigger value="declined" className="data-[state=active]:bg-red-600">Declined ({declined})</TabsTrigger>
          <TabsTrigger value="paused" className="data-[state=active]:bg-slate-600">Paused ({keywords.filter(k => k.status === "paused").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Keywords Table */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400">Keyword</TableHead>
                <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("position")}>
                  <span className="flex items-center gap-1">Position <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="text-slate-400">Change</TableHead>
                <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("volume")}>
                  <span className="flex items-center gap-1">Volume <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("difficulty")}>
                  <span className="flex items-center gap-1">KD <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="text-slate-400">CPC</TableHead>
                <TableHead className="text-slate-400">Intent</TableHead>
                <TableHead className="text-slate-400">Trend</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((kw) => {
                const change = getChangeValue(kw);
                return (
                  <TableRow key={kw.id} className="border-slate-700/50 hover:bg-slate-800/30">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium text-sm">{kw.keyword}</p>
                        <p className="text-xs text-slate-500 font-mono">{kw.page}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-cyan-400 font-bold">#{kw.position}</TableCell>
                    <TableCell>
                      <Badge className={change > 0 ? "bg-emerald-500/20 text-emerald-400" : change < 0 ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}>
                        {change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                        {change > 0 ? `+${change}` : change === 0 ? '0' : change}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{kw.volume.toLocaleString()}</TableCell>
                    <TableCell className={getDifficultyColor(kw.difficulty)}>{kw.difficulty}%</TableCell>
                    <TableCell className="text-slate-300">${kw.cpc.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getIntentBadge(kw.intent)}>
                        <Target className="h-3 w-3 mr-1" />{kw.intent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-6">
                        <ResponsiveContainer>
                          <AreaChart data={kw.trend.map((v, i) => ({ v }))}>
                            <Area type="monotone" dataKey="v" stroke={change >= 0 ? "#10b981" : "#ef4444"} fill={change >= 0 ? "#10b98120" : "#ef444420"} strokeWidth={1.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => handleToggleTracking(kw.id)} className="h-7 w-7 p-0">
                        {kw.status === "tracking" ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Opportunities */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-400 text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> AI Keyword Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {opportunityKeywords.map((opp, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{opp.keyword}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">Vol: {opp.volume.toLocaleString()}</span>
                  <span className={`text-xs ${getDifficultyColor(opp.difficulty)}`}>KD: {opp.difficulty}%</span>
                  {opp.currentPos && <span className="text-xs text-slate-500">Currently #{opp.currentPos}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-400">{opp.opportunity}% match</Badge>
                <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400 h-7 text-xs" onClick={() => toast.success(`Added "${opp.keyword}" to tracking`)}>
                  <Plus className="h-3 w-3 mr-1" /> Track
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SEOKeywords;
