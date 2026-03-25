import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, XCircle, Zap, Flag, Wrench, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SEOIssue {
  id: string;
  type: string;
  category: "on-page" | "technical" | "content" | "mobile";
  severity: "critical" | "high" | "medium" | "low";
  affectedPages: number;
  status: "open" | "in_progress" | "reviewed" | "fixed" | "escalated";
  autoFixable: boolean;
  recommendation: string;
}

const SEOIssuesFixes = () => {
  const [issues, setIssues] = useState<SEOIssue[]>([
    { id: "ISS001", type: "Missing Meta Description", category: "on-page", severity: "high", affectedPages: 24, status: "open", autoFixable: true, recommendation: "AI can generate meta descriptions based on page content" },
    { id: "ISS002", type: "Duplicate Title Tags", category: "on-page", severity: "medium", affectedPages: 8, status: "open", autoFixable: true, recommendation: "Unique titles will be generated per page context" },
    { id: "ISS003", type: "Broken Internal Links", category: "technical", severity: "critical", affectedPages: 12, status: "in_progress", autoFixable: false, recommendation: "Manual review required — links point to deleted pages" },
    { id: "ISS004", type: "Missing Alt Text", category: "content", severity: "low", affectedPages: 156, status: "open", autoFixable: true, recommendation: "AI can generate descriptive alt text from image analysis" },
    { id: "ISS005", type: "Slow Page Load (>3s)", category: "technical", severity: "critical", affectedPages: 5, status: "escalated", autoFixable: false, recommendation: "Flagged to Server Manager — requires infrastructure fix" },
    { id: "ISS006", type: "Mobile Tap Target Too Small", category: "mobile", severity: "high", affectedPages: 3, status: "fixed", autoFixable: false, recommendation: "CSS adjustments applied to increase button sizes" },
    { id: "ISS007", type: "Missing H1 Tags", category: "on-page", severity: "medium", affectedPages: 7, status: "reviewed", autoFixable: true, recommendation: "H1 tags will be auto-generated from page title" },
    { id: "ISS008", type: "Orphan Pages (No Internal Links)", category: "content", severity: "high", affectedPages: 14, status: "open", autoFixable: true, recommendation: "Auto-linker can connect these to related content" },
    { id: "ISS009", type: "Missing Schema Markup", category: "on-page", severity: "medium", affectedPages: 32, status: "open", autoFixable: true, recommendation: "Schema will be auto-generated based on page type" },
    { id: "ISS010", type: "Mixed Content (HTTP/HTTPS)", category: "technical", severity: "critical", affectedPages: 2, status: "open", autoFixable: false, recommendation: "Requires server-side redirect configuration" },
  ]);
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkReviewed = (id: string) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "reviewed" } : i));
    toast.success(`Issue ${id} marked as reviewed`);
  };

  const handleAutoFix = (id: string) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "in_progress" } : i));
    toast.info(`Auto-fix initiated for issue ${id}`);
    setTimeout(() => {
      setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "fixed" } : i));
      toast.success(`Issue ${id} auto-fixed successfully`);
    }, 3000);
  };

  const handleEscalate = (id: string) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "escalated" } : i));
    toast.info(`Issue ${id} escalated to Server Manager`);
  };

  const getSevColor = (s: string) => {
    const m: Record<string, string> = { critical: "bg-red-500/20 text-red-400", high: "bg-orange-500/20 text-orange-400", medium: "bg-amber-500/20 text-amber-400", low: "bg-blue-500/20 text-blue-400" };
    return m[s] || m.low;
  };

  const getStatusColor = (s: string) => {
    const m: Record<string, string> = { open: "bg-slate-500/20 text-slate-400", in_progress: "bg-cyan-500/20 text-cyan-400", reviewed: "bg-purple-500/20 text-purple-400", fixed: "bg-emerald-500/20 text-emerald-400", escalated: "bg-amber-500/20 text-amber-400" };
    return m[s] || m.open;
  };

  const filtered = issues.filter(i => {
    if (activeTab === "all") return true;
    if (activeTab === "critical") return i.severity === "critical";
    if (activeTab === "fixable") return i.autoFixable && i.status !== "fixed";
    if (activeTab === "fixed") return i.status === "fixed";
    return true;
  });

  const total = issues.length;
  const fixedCount = issues.filter(i => i.status === "fixed").length;
  const critCount = issues.filter(i => i.severity === "critical" && i.status !== "fixed").length;
  const fixableCount = issues.filter(i => i.autoFixable && i.status !== "fixed").length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Issues & Fixes</h2>
        <Button onClick={() => toast.info("Running full site scan...")} className="bg-cyan-600 hover:bg-cyan-700">
          <RefreshCw className="h-4 w-4 mr-2" /> Re-scan Site
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Total Issues</p><p className="text-2xl font-bold text-white">{total}</p></CardContent></Card>
        <Card className="bg-red-500/10 border-red-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-red-400">Critical</p><p className="text-2xl font-bold text-red-400">{critCount}</p></CardContent></Card>
        <Card className="bg-cyan-500/10 border-cyan-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-cyan-400">Auto-Fixable</p><p className="text-2xl font-bold text-cyan-400">{fixableCount}</p></CardContent></Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-emerald-400">Fixed</p><p className="text-2xl font-bold text-emerald-400">{fixedCount}</p></CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-400">Health</p>
            <p className="text-2xl font-bold text-white">{Math.round((fixedCount / total) * 100)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-600">All ({total})</TabsTrigger>
          <TabsTrigger value="critical" className="data-[state=active]:bg-red-600">Critical ({critCount})</TabsTrigger>
          <TabsTrigger value="fixable" className="data-[state=active]:bg-purple-600">Auto-Fixable ({fixableCount})</TabsTrigger>
          <TabsTrigger value="fixed" className="data-[state=active]:bg-emerald-600">Fixed ({fixedCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400">Issue</TableHead>
                <TableHead className="text-slate-400">Category</TableHead>
                <TableHead className="text-slate-400">Severity</TableHead>
                <TableHead className="text-slate-400">Pages</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(issue => (
                <TableRow key={issue.id} className="border-slate-700/50 hover:bg-slate-800/30">
                  <TableCell>
                    <div>
                      <p className="text-white text-sm font-medium">{issue.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{issue.recommendation}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-slate-700/50 text-slate-300 text-xs">{issue.category}</Badge></TableCell>
                  <TableCell><Badge className={getSevColor(issue.severity)}>{issue.severity}</Badge></TableCell>
                  <TableCell className="text-slate-300">{issue.affectedPages}</TableCell>
                  <TableCell><Badge className={getStatusColor(issue.status)}>{issue.status.replace("_", " ")}</Badge></TableCell>
                  <TableCell>
                    {issue.status !== "fixed" && issue.status !== "escalated" && (
                      <div className="flex gap-1">
                        {issue.autoFixable && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-cyan-400" onClick={() => handleAutoFix(issue.id)}>
                            <Zap className="h-3 w-3 mr-1" /> Auto Fix
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-400" onClick={() => handleMarkReviewed(issue.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Review
                        </Button>
                        {!issue.autoFixable && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-amber-400" onClick={() => handleEscalate(issue.id)}>
                            <Flag className="h-3 w-3 mr-1" /> Escalate
                          </Button>
                        )}
                      </div>
                    )}
                    {issue.status === "fixed" && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                    {issue.status === "escalated" && <Badge className="bg-amber-500/20 text-amber-400 text-xs"><Flag className="h-3 w-3 mr-1" />Escalated</Badge>}
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

export default SEOIssuesFixes;
