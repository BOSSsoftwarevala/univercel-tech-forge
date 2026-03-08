import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Pause, Play, TrendingUp, TrendingDown, Minus, Search, 
  Sparkles, Target, BarChart3, Globe, ArrowUpDown, Loader2
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useSEOKeywords } from "@/hooks/useSEOData";
import { useSEOAutomation } from "@/hooks/useSEOAutomation";

const SEOKeywords = () => {
  const { keywords, loading, addKeyword, updateKeyword } = useSEOKeywords();
  const { isLoading: aiLoading, generateMetaTags } = useSEOAutomation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"position" | "search_volume" | "difficulty">("position");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [newKeyword, setNewKeyword] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleTracking = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "tracking" ? "paused" : "tracking";
    await updateKeyword(id, { status: newStatus });
    toast.success(`Tracking ${newStatus === "tracking" ? "resumed" : "paused"}`);
  };

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    await addKeyword({ keyword: newKeyword.trim(), status: "tracking", intent: "informational", country: "US" });
    setNewKeyword("");
    setShowAddForm(false);
  };

  const handleAIDiscover = async () => {
    toast.info("AI keyword discovery started...");
    const result = await generateMetaTags({ business: "Software Vala", keywords: "software development" });
    if (result) {
      toast.success("AI analysis complete — check recommendations");
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const filteredKeywords = keywords
    .filter((kw: any) => {
      if (searchQuery && !kw.keyword?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedTab === "improved") return kw.position && kw.prev_position && kw.position < kw.prev_position;
      if (selectedTab === "declined") return kw.position && kw.prev_position && kw.position > kw.prev_position;
      if (selectedTab === "paused") return kw.status === "paused";
      return true;
    })
    .sort((a: any, b: any) => {
      const val = sortAsc ? 1 : -1;
      return ((a[sortField] || 999) - (b[sortField] || 999)) * val;
    });

  const getChangeValue = (kw: any) => (kw.prev_position || 0) - (kw.position || 0);
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

  const improved = keywords.filter((k: any) => k.position && k.prev_position && k.position < k.prev_position).length;
  const declined = keywords.filter((k: any) => k.position && k.prev_position && k.position > k.prev_position).length;
  const unchanged = keywords.filter((k: any) => k.position && k.prev_position && k.position === k.prev_position).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-slate-400">Loading keywords...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Keyword Tracker</h2>
        <div className="flex gap-2">
          <Button onClick={handleAIDiscover} disabled={aiLoading} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-4 w-4 mr-2" /> AI Discover
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" /> Add Keyword
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardContent className="pt-4 pb-3">
            <div className="flex gap-3">
              <Input placeholder="Enter keyword to track..." value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddKeyword()}
                className="bg-slate-800/50 border-slate-700 text-white" />
              <Button onClick={handleAddKeyword} className="bg-cyan-600 hover:bg-cyan-700">Add</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-slate-400">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            <p className="text-2xl font-bold text-amber-400">{keywords.filter((k: any) => k.position && k.position <= 10).length}</p>
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
          <TabsTrigger value="paused" className="data-[state=active]:bg-slate-600">Paused ({keywords.filter((k: any) => k.status === "paused").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {keywords.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-8 pb-8 text-center">
            <Search className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No Keywords Tracked</h3>
            <p className="text-slate-400 text-sm">Add keywords manually or use AI Discover to find opportunities.</p>
          </CardContent>
        </Card>
      ) : (
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
                  <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("search_volume")}>
                    <span className="flex items-center gap-1">Volume <ArrowUpDown className="h-3 w-3" /></span>
                  </TableHead>
                  <TableHead className="text-slate-400 cursor-pointer" onClick={() => handleSort("difficulty")}>
                    <span className="flex items-center gap-1">KD <ArrowUpDown className="h-3 w-3" /></span>
                  </TableHead>
                  <TableHead className="text-slate-400">CPC</TableHead>
                  <TableHead className="text-slate-400">Intent</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((kw: any) => {
                  const change = getChangeValue(kw);
                  return (
                    <TableRow key={kw.id} className="border-slate-700/50 hover:bg-slate-800/30">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium text-sm">{kw.keyword}</p>
                          <p className="text-xs text-slate-500 font-mono">{kw.page_url || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-cyan-400 font-bold">{kw.position ? `#${kw.position}` : "—"}</TableCell>
                      <TableCell>
                        {kw.prev_position ? (
                          <Badge className={change > 0 ? "bg-emerald-500/20 text-emerald-400" : change < 0 ? "bg-red-500/20 text-red-400" : "bg-slate-500/20 text-slate-400"}>
                            {change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                            {change > 0 ? `+${change}` : change === 0 ? '0' : change}
                          </Badge>
                        ) : <span className="text-slate-500">—</span>}
                      </TableCell>
                      <TableCell className="text-slate-300">{kw.search_volume ? kw.search_volume.toLocaleString() : "—"}</TableCell>
                      <TableCell className={kw.difficulty ? getDifficultyColor(kw.difficulty) : "text-slate-500"}>{kw.difficulty ? `${kw.difficulty}%` : "—"}</TableCell>
                      <TableCell className="text-slate-300">{kw.cpc ? `$${Number(kw.cpc).toFixed(2)}` : "—"}</TableCell>
                      <TableCell>
                        <Badge className={getIntentBadge(kw.intent || "informational")}>
                          <Target className="h-3 w-3 mr-1" />{kw.intent || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => handleToggleTracking(kw.id, kw.status)} className="h-7 w-7 p-0">
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
      )}
    </motion.div>
  );
};

export default SEOKeywords;
