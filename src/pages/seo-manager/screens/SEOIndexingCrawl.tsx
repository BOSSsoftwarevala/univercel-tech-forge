import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, FileText, AlertTriangle, Ban, FileCode } from "lucide-react";
import { toast } from "sonner";

const SEOIndexingCrawl = () => {
  const [sitemapStatus] = useState({
    lastGenerated: "2025-06-20 08:00:00",
    totalUrls: 1847,
    status: "healthy",
    lastSubmitted: "2025-06-20 08:05:00"
  });

  const [crawlErrors] = useState([
    { id: "CE001", url: "/old-product-page", error: "Page Redirect Needed", discovered: "2025-06-19", status: "pending" },
    { id: "CE002", url: "/broken-link", error: "Content Update Required", discovered: "2025-06-18", status: "pending" },
    { id: "CE003", url: "/redirect-loop", error: "Redirect Configuration", discovered: "2025-06-17", status: "fixed" },
  ]);

  const [blockedUrls] = useState([
    { id: "BU001", url: "/admin/*", reason: "Admin area", type: "robots.txt" },
    { id: "BU002", url: "/api/*", reason: "API endpoints", type: "robots.txt" },
    { id: "BU003", url: "/private/*", reason: "Private content", type: "noindex" },
  ]);

  const handleRequestRecrawl = () => {
    toast.info("Re-crawl request submitted for approval");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Indexing & Crawl</h2>
        <Button onClick={handleRequestRecrawl} className="bg-cyan-600 hover:bg-cyan-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Request Re-crawl
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sitemap Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">Status</p>
              <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">{sitemapStatus.status}</Badge>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">Total URLs</p>
              <p className="text-2xl font-bold text-white mt-1">{sitemapStatus.totalUrls.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">Last Generated</p>
              <p className="text-sm text-white mt-2">{sitemapStatus.lastGenerated}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">Last Submitted</p>
              <p className="text-sm text-white mt-2">{sitemapStatus.lastSubmitted}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Crawl Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">URL</TableHead>
                <TableHead className="text-slate-400">Error</TableHead>
                <TableHead className="text-slate-400">Discovered</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crawlErrors.map((error) => (
                <TableRow key={error.id} className="border-slate-700/50">
                  <TableCell className="text-slate-300 font-mono text-sm">{error.url}</TableCell>
                  <TableCell className="text-red-400">{error.error}</TableCell>
                  <TableCell className="text-slate-300">{error.discovered}</TableCell>
                  <TableCell>
                    <Badge className={error.status === "fixed" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                      {error.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-400 flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Blocked URLs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">URL Pattern</TableHead>
                <TableHead className="text-slate-400">Reason</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedUrls.map((blocked) => (
                <TableRow key={blocked.id} className="border-slate-700/50">
                  <TableCell className="text-slate-300 font-mono text-sm">{blocked.url}</TableCell>
                  <TableCell className="text-slate-300">{blocked.reason}</TableCell>
                  <TableCell>
                    <Badge className="bg-slate-500/20 text-slate-400">{blocked.type}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Robots.txt (View Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-300 font-mono overflow-x-auto">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml`}
          </pre>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SEOIndexingCrawl;
