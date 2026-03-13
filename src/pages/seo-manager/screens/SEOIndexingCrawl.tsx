import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, FileText, AlertTriangle, Ban, FileCode, CheckCircle, Clock, Globe, Zap, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const crawlData = [
  { date: "Mar 3", crawled: 1820, indexed: 1780, errors: 12 },
  { date: "Mar 4", crawled: 1825, indexed: 1785, errors: 15 },
  { date: "Mar 5", crawled: 1830, indexed: 1790, errors: 18 },
  { date: "Mar 6", crawled: 1835, indexed: 1798, errors: 14 },
  { date: "Mar 7", crawled: 1840, indexed: 1805, errors: 10 },
  { date: "Mar 8", crawled: 1847, indexed: 1812, errors: 8 },
];

const SEOIndexingCrawl = () => {
  const [isRecrawling, setIsRecrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);

  const sitemapStatus = {
    lastGenerated: "2026-03-08 08:00",
    totalUrls: 1847,
    status: "healthy",
    lastSubmitted: "2026-03-08 08:05",
    indexRate: "98.1%",
    avgCrawlFreq: "2.4 days"
  };

  const [crawlErrors] = useState([
    { id: "CE001", url: "/old-product-page", error: "301 Redirect Chain", discovered: "Mar 7", status: "pending", priority: "medium" },
    { id: "CE002", url: "/broken-resource", error: "404 Not Found", discovered: "Mar 6", status: "pending", priority: "high" },
    { id: "CE003", url: "/redirect-loop", error: "Redirect Loop Detected", discovered: "Mar 5", status: "fixed", priority: "critical" },
    { id: "CE004", url: "/slow-render-page", error: "Render Timeout (>10s)", discovered: "Mar 8", status: "pending", priority: "high" },
    { id: "CE005", url: "/duplicate-content", error: "Duplicate Content", discovered: "Mar 7", status: "pending", priority: "medium" },
  ]);

  const [blockedUrls] = useState([
    { url: "/admin/*", reason: "Admin area", type: "robots.txt" },
    { url: "/api/*", reason: "API endpoints", type: "robots.txt" },
    { url: "/private/*", reason: "Private content", type: "noindex" },
    { url: "/staging/*", reason: "Staging environment", type: "robots.txt" },
    { url: "/internal/*", reason: "Internal tools", type: "meta noindex" },
  ]);

  const handleRecrawl = () => {
    setIsRecrawling(true);
    setCrawlProgress(0);
    toast.info("Re-crawl initiated...");
    const interval = setInterval(() => {
      setCrawlProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecrawling(false);
          toast.success("Re-crawl completed! 1,847 pages processed.");
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const getPriorityBadge = (p: string) => {
    const m: Record<string, string> = { critical: "bg-red-500/20 text-red-400", high: "bg-orange-500/20 text-orange-400", medium: "bg-amber-500/20 text-amber-400", low: "bg-blue-500/20 text-blue-400" };
    return m[p] || m.low;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Indexing & Crawl Center</h2>
        <Button onClick={handleRecrawl} disabled={isRecrawling} className="bg-cyan-600 hover:bg-cyan-700">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRecrawling ? 'animate-spin' : ''}`} />
          {isRecrawling ? 'Crawling...' : 'Request Re-crawl'}
        </Button>
      </div>

      {/* Crawl Progress */}
      {isRecrawling && (
        <Card className="bg-cyan-500/10 border-cyan-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-cyan-400 font-medium">Crawl in progress...</span>
              <span className="text-sm text-white font-bold">{crawlProgress}%</span>
            </div>
            <Progress value={crawlProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Sitemap Status */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Globe className="h-5 w-5" /> Sitemap & Index Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "Status", value: sitemapStatus.status, badge: true },
              { label: "Total URLs", value: sitemapStatus.totalUrls.toLocaleString() },
              { label: "Index Rate", value: sitemapStatus.indexRate },
              { label: "Crawl Freq", value: sitemapStatus.avgCrawlFreq },
              { label: "Last Generated", value: sitemapStatus.lastGenerated },
              { label: "Last Submitted", value: sitemapStatus.lastSubmitted },
            ].map(s => (
              <div key={s.label} className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">{s.label}</p>
                {s.badge ? (
                  <Badge className="mt-1.5 bg-emerald-500/20 text-emerald-400">{s.value}</Badge>
                ) : (
                  <p className="text-sm font-bold text-white mt-1">{s.value}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crawl Trend */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-400 text-base">Crawl & Index Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={crawlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="indexed" fill="#10b981" radius={[4,4,0,0]} name="Indexed" />
              <Bar dataKey="errors" fill="#ef4444" radius={[4,4,0,0]} name="Errors" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Crawl Errors */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-400 text-base flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Crawl Errors</CardTitle>
            <Badge className="bg-red-500/20 text-red-400">{crawlErrors.filter(e => e.status === "pending").length} pending</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400">URL</TableHead>
                <TableHead className="text-slate-400">Error</TableHead>
                <TableHead className="text-slate-400">Priority</TableHead>
                <TableHead className="text-slate-400">Discovered</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crawlErrors.map(err => (
                <TableRow key={err.id} className="border-slate-700/50 hover:bg-slate-800/30">
                  <TableCell className="text-slate-300 font-mono text-xs">{err.url}</TableCell>
                  <TableCell className="text-red-400 text-sm">{err.error}</TableCell>
                  <TableCell><Badge className={getPriorityBadge(err.priority)}>{err.priority}</Badge></TableCell>
                  <TableCell className="text-slate-400 text-xs">{err.discovered}</TableCell>
                  <TableCell>
                    <Badge className={err.status === "fixed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}>{err.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Blocked URLs & Robots.txt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-base flex items-center gap-2"><Ban className="h-5 w-5" /> Blocked URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blockedUrls.map((b, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                <span className="text-slate-300 font-mono text-sm">{b.url}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{b.reason}</span>
                  <Badge className="bg-slate-600/30 text-slate-400 text-xs">{b.type}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><FileCode className="h-5 w-5" /> Robots.txt <Badge className="bg-slate-700 text-slate-300 text-xs ml-2">Read Only</Badge></CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-800/50 p-4 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /staging/
Disallow: /internal/

User-agent: Googlebot
Allow: /

Sitemap: https://softwarewala.net/sitemap.xml`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SEOIndexingCrawl;
