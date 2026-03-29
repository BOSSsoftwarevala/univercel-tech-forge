import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Search, FileText, CheckCircle, AlertTriangle, XCircle, ExternalLink, Zap, Globe } from "lucide-react";
import { toast } from "sonner";

interface PageData {
  id: string;
  url: string;
  title: string;
  indexStatus: "indexed" | "pending" | "noindex" | "error";
  lastCrawl: string;
  score: number;
  wordCount: number;
  loadTime: number;
  backlinks: number;
  impressions: number;
  keywords: number;
}

const mockPages: PageData[] = [
  { id: "PG001", url: "/products/software-development", title: "Software Development Services", indexStatus: "indexed", lastCrawl: "2026-03-08", score: 94, wordCount: 2450, loadTime: 1.2, backlinks: 89, impressions: 245000, keywords: 42 },
  { id: "PG002", url: "/services/web-design", title: "Professional Web Design", indexStatus: "indexed", lastCrawl: "2026-03-08", score: 88, wordCount: 1890, loadTime: 1.8, backlinks: 56, impressions: 189000, keywords: 35 },
  { id: "PG003", url: "/about-us", title: "About Our Company", indexStatus: "indexed", lastCrawl: "2026-03-07", score: 91, wordCount: 1200, loadTime: 0.9, backlinks: 124, impressions: 98000, keywords: 18 },
  { id: "PG004", url: "/blog/tech-trends-2025", title: "Tech Trends 2025", indexStatus: "pending", lastCrawl: "2026-03-06", score: 76, wordCount: 3200, loadTime: 2.4, backlinks: 12, impressions: 156000, keywords: 28 },
  { id: "PG005", url: "/contact", title: "Contact Us", indexStatus: "indexed", lastCrawl: "2026-03-08", score: 85, wordCount: 450, loadTime: 0.6, backlinks: 78, impressions: 45000, keywords: 8 },
  { id: "PG006", url: "/pricing", title: "Pricing Plans", indexStatus: "noindex", lastCrawl: "2026-03-05", score: 0, wordCount: 800, loadTime: 1.1, backlinks: 34, impressions: 0, keywords: 0 },
  { id: "PG007", url: "/products/crm", title: "CRM Platform", indexStatus: "indexed", lastCrawl: "2026-03-08", score: 92, wordCount: 2100, loadTime: 1.4, backlinks: 67, impressions: 134000, keywords: 38 },
  { id: "PG008", url: "/services/cloud", title: "Cloud Solutions", indexStatus: "error", lastCrawl: "2026-03-04", score: 45, wordCount: 1600, loadTime: 3.8, backlinks: 23, impressions: 67000, keywords: 15 },
];

const SEOPages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "indexed": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "pending": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "noindex": return <XCircle className="h-4 w-4 text-slate-400" />;
      case "error": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      indexed: "bg-emerald-500/20 text-emerald-400",
      pending: "bg-amber-500/20 text-amber-400",
      noindex: "bg-slate-500/20 text-slate-400",
      error: "bg-red-500/20 text-red-400",
    };
    return styles[status] || styles.noindex;
  };

  const getScoreColor = (s: number) => s >= 90 ? "text-emerald-400" : s >= 70 ? "text-amber-400" : s >= 50 ? "text-orange-400" : "text-red-400";
  const getLoadColor = (t: number) => t <= 1.5 ? "text-emerald-400" : t <= 2.5 ? "text-amber-400" : "text-red-400";

  const filtered = mockPages.filter(p => !searchQuery || p.url.includes(searchQuery) || p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const indexedCount = mockPages.filter(p => p.indexStatus === "indexed").length;
  const errorCount = mockPages.filter(p => p.indexStatus === "error").length;

  const detail = selectedPage ? mockPages.find(p => p.id === selectedPage) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Pages Analysis</h2>
        <Badge className="bg-slate-700 text-slate-300">Read Only — View Mode</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Total Pages</p><p className="text-2xl font-bold text-white">{mockPages.length}</p></CardContent></Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-emerald-400">Indexed</p><p className="text-2xl font-bold text-emerald-400">{indexedCount}</p></CardContent></Card>
        <Card className="bg-red-500/10 border-red-500/20"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-red-400">Errors</p><p className="text-2xl font-bold text-red-400">{errorCount}</p></CardContent></Card>
        <Card className="bg-slate-900/50 border-slate-700/50"><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-slate-400">Avg Score</p><p className="text-2xl font-bold text-cyan-400">{Math.round(mockPages.filter(p => p.score > 0).reduce((a, b) => a + b.score, 0) / mockPages.filter(p => p.score > 0).length)}</p></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input placeholder="Search pages by URL or title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Page</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Score</TableHead>
                    <TableHead className="text-slate-400">Load</TableHead>
                    <TableHead className="text-slate-400">Keywords</TableHead>
                    <TableHead className="text-slate-400">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(page => (
                    <TableRow key={page.id} className={`border-slate-700/50 cursor-pointer ${selectedPage === page.id ? 'bg-cyan-500/10' : 'hover:bg-slate-800/30'}`}
                      onClick={() => setSelectedPage(page.id)}>
                      <TableCell>
                        <div>
                          <p className="text-white text-sm font-medium truncate max-w-xs">{page.title}</p>
                          <p className="text-xs text-slate-500 font-mono">{page.url}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(page.indexStatus)}
                          <Badge className={getStatusBadge(page.indexStatus)}>{page.indexStatus}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className={`font-bold ${getScoreColor(page.score)}`}>{page.score > 0 ? page.score : "N/A"}</TableCell>
                      <TableCell className={getLoadColor(page.loadTime)}>{page.loadTime}s</TableCell>
                      <TableCell className="text-slate-300">{page.keywords}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setSelectedPage(page.id); }}>
                          <Eye className="h-3.5 w-3.5 text-cyan-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Page Details</CardTitle>
          </CardHeader>
          <CardContent>
            {detail ? (
              <div className="space-y-4">
                <div>
                  <p className="text-white font-medium">{detail.title}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{detail.url}</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "SEO Score", value: `${detail.score}/100`, color: getScoreColor(detail.score) },
                    { label: "Word Count", value: detail.wordCount.toLocaleString(), color: "text-white" },
                    { label: "Load Time", value: `${detail.loadTime}s`, color: getLoadColor(detail.loadTime) },
                    { label: "Backlinks", value: detail.backlinks.toString(), color: "text-blue-400" },
                    { label: "Impressions", value: `${(detail.impressions / 1000).toFixed(0)}K`, color: "text-purple-400" },
                    { label: "Keywords", value: detail.keywords.toString(), color: "text-cyan-400" },
                    { label: "Last Crawl", value: detail.lastCrawl, color: "text-slate-300" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between p-2 bg-slate-800/50 rounded">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(detail.indexStatus)}
                  <Badge className={getStatusBadge(detail.indexStatus)}>{detail.indexStatus}</Badge>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <Eye className="h-8 w-8 mb-2" />
                <p className="text-sm">Select a page to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SEOPages;
