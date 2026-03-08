import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, AlertTriangle, Shield, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSEOBacklinks } from "@/hooks/useSEOData";

const SEOBacklinks = () => {
  const { backlinks, loading } = useSEOBacklinks();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getDaColor = (da: number) => da >= 70 ? "text-emerald-400" : da >= 40 ? "text-amber-400" : "text-red-400";
  
  const filtered = backlinks.filter((bl: any) => {
    if (searchQuery && !bl.source_url?.includes(searchQuery) && !bl.anchor_text?.includes(searchQuery)) return false;
    if (activeTab === "dofollow") return bl.link_type === "dofollow" && !bl.is_toxic;
    if (activeTab === "toxic") return bl.is_toxic;
    if (activeTab === "lost") return bl.status === "lost";
    return true;
  });

  const totalActive = backlinks.filter((b: any) => b.status === "active").length;
  const toxicCount = backlinks.filter((b: any) => b.is_toxic).length;
  const dofollowCount = backlinks.filter((b: any) => b.link_type === "dofollow" && b.status === "active").length;
  const avgDA = totalActive > 0 ? Math.round(backlinks.filter((b: any) => b.status === "active").reduce((s: number, b: any) => s + (b.domain_authority || 0), 0) / totalActive) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-slate-400">Loading backlinks...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Backlink Monitor</h2>
        <Button onClick={() => toast.info("Scanning for new backlinks...")} className="bg-cyan-600 hover:bg-cyan-700">
          <Search className="h-4 w-4 mr-2" /> Scan Backlinks
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Total Backlinks</p><p className="text-2xl font-bold text-white">{backlinks.length}</p></CardContent></Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-emerald-400">Active</p><p className="text-2xl font-bold text-emerald-400">{totalActive}</p></CardContent></Card>
        <Card className="bg-blue-500/10 border-blue-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-blue-400">Dofollow</p><p className="text-2xl font-bold text-blue-400">{dofollowCount}</p></CardContent></Card>
        <Card className="bg-red-500/10 border-red-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-red-400">Toxic</p><p className="text-2xl font-bold text-red-400">{toxicCount}</p></CardContent></Card>
        <Card className="bg-purple-500/10 border-purple-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-purple-400">Avg DA</p><p className="text-2xl font-bold text-purple-400">{avgDA}</p></CardContent></Card>
      </div>

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

      {backlinks.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-8 pb-8 text-center">
            <Link2 className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No Backlinks Found</h3>
            <p className="text-slate-400 text-sm">Backlinks will appear here once scanned or imported.</p>
          </CardContent>
        </Card>
      ) : (
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
                {filtered.map((bl: any) => (
                  <TableRow key={bl.id} className="border-slate-700/50 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 text-xs font-mono max-w-xs truncate">{bl.source_url}</TableCell>
                    <TableCell className="text-slate-400 text-xs font-mono">{bl.target_url}</TableCell>
                    <TableCell className="text-white text-sm">{bl.anchor_text || "—"}</TableCell>
                    <TableCell className={`font-bold ${getDaColor(bl.domain_authority || 0)}`}>{bl.domain_authority || "—"}</TableCell>
                    <TableCell>
                      <Badge className={bl.link_type === "dofollow" ? "bg-blue-500/20 text-blue-400" : "bg-slate-500/20 text-slate-400"}>{bl.link_type || "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={bl.is_toxic ? "bg-red-500/20 text-red-400" : bl.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}>
                        {bl.is_toxic && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {bl.is_toxic ? "toxic" : bl.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
