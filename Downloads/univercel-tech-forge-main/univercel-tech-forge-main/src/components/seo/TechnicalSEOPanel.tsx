import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, FileText, ArrowRightLeft, LinkIcon, AlertTriangle,
  CheckCircle, RefreshCw, Download, Upload, Eye, Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TechnicalSEOPanel = () => {
  const [activeTab, setActiveTab] = useState<"sitemap" | "robots" | "redirects" | "broken">("sitemap");

  const sitemapStatus = {
    lastGenerated: "2 hours ago",
    totalUrls: 1247,
    indexedUrls: 1198,
    errorUrls: 12,
    pendingUrls: 37,
  };

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

User-agent: Googlebot
Allow: /
Crawl-delay: 1

Sitemap: https://softwarevala.com/sitemap.xml`;

  const redirects = [
    { from: "/old-pos-system", to: "/products/pos", type: "301", hits: 234 },
    { from: "/school-software", to: "/products/school-management", type: "301", hits: 189 },
    { from: "/demo-old", to: "/demo", type: "302", hits: 56 },
    { from: "/pricing-2023", to: "/pricing", type: "301", hits: 145 },
  ];

  const brokenLinks = [
    { url: "/products/legacy-crm", source: "Homepage", status: 404, discovered: "1 day ago" },
    { url: "/blog/old-article-123", source: "Blog Index", status: 404, discovered: "3 days ago" },
    { url: "/partners/removed-partner", source: "Partners Page", status: 410, discovered: "5 days ago" },
  ];

  const technicalMetrics = [
    { label: "Page Speed Score", value: 94, status: "good" },
    { label: "Mobile Friendly", value: 98, status: "good" },
    { label: "SSL Certificate", value: "Valid", status: "good" },
    { label: "Canonical Issues", value: 3, status: "warning" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-cyan-400" />
            Technical SEO Panel
          </h2>
          <p className="text-slate-400">Manage sitemaps, robots.txt, redirects, and link health</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Full Audit
        </Button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {technicalMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${
              metric.status === "good" 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-orange-500/10 border-orange-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              {metric.status === "good" ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              )}
            </div>
            <p className={`text-2xl font-bold ${
              metric.status === "good" ? "text-green-400" : "text-orange-400"
            }`}>
              {metric.value}
            </p>
            <p className="text-xs text-slate-400">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700/50 pb-4">
        {[
          { id: "sitemap", label: "Sitemap", icon: FileText },
          { id: "robots", label: "Robots.txt", icon: FileCode },
          { id: "redirects", label: "Redirects", icon: ArrowRightLeft },
          { id: "broken", label: "Broken Links", icon: LinkIcon },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className={activeTab === tab.id ? "bg-cyan-500" : ""}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "sitemap" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
              <h3 className="font-semibold text-white mb-4">Sitemap Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Generated</span>
                  <span className="text-white">{sitemapStatus.lastGenerated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total URLs</span>
                  <span className="text-white">{sitemapStatus.totalUrls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Indexed</span>
                  <span className="text-green-400">{sitemapStatus.indexedUrls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Errors</span>
                  <span className="text-red-400">{sitemapStatus.errorUrls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending</span>
                  <span className="text-yellow-400">{sitemapStatus.pendingUrls}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1 bg-cyan-500/20 text-cyan-300">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Regenerate
                </Button>
                <Button size="sm" variant="outline" className="border-slate-600">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
              <h3 className="font-semibold text-white mb-4">Auto-Generation Rules</h3>
              <div className="space-y-3">
                {[
                  { rule: "Include product pages", enabled: true },
                  { rule: "Include blog posts", enabled: true },
                  { rule: "Include demo pages", enabled: true },
                  { rule: "Exclude admin routes", enabled: true },
                  { rule: "Include images", enabled: false },
                ].map((rule) => (
                  <div key={rule.rule} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                    <span className="text-sm text-white">{rule.rule}</span>
                    <Badge className={rule.enabled ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}>
                      {rule.enabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "robots" && (
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">robots.txt Editor</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-slate-600">
                  <Eye className="w-4 h-4 mr-1" />
                  Test
                </Button>
                <Button size="sm" className="bg-cyan-500">
                  <Upload className="w-4 h-4 mr-1" />
                  Deploy
                </Button>
              </div>
            </div>
            <Textarea
              defaultValue={robotsTxt}
              className="font-mono text-sm bg-slate-800/50 border-slate-600 min-h-[300px]"
            />
          </div>
        </div>
      )}

      {activeTab === "redirects" && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold text-white">Redirect Rules</h3>
            <Button size="sm" className="bg-cyan-500">
              + Add Redirect
            </Button>
          </div>
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left p-4 text-xs text-slate-400">From</th>
                  <th className="text-left p-4 text-xs text-slate-400">To</th>
                  <th className="text-center p-4 text-xs text-slate-400">Type</th>
                  <th className="text-center p-4 text-xs text-slate-400">Hits</th>
                  <th className="text-center p-4 text-xs text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {redirects.map((redirect, index) => (
                  <tr key={index}>
                    <td className="p-4 text-sm text-white font-mono">{redirect.from}</td>
                    <td className="p-4 text-sm text-cyan-400 font-mono">{redirect.to}</td>
                    <td className="p-4 text-center">
                      <Badge className={redirect.type === "301" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {redirect.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-center text-white">{redirect.hits}</td>
                    <td className="p-4 text-center">
                      <Button size="sm" variant="ghost">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "broken" && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Broken Links</h3>
              <Badge className="bg-red-500/20 text-red-400">{brokenLinks.length} found</Badge>
            </div>
            <Button size="sm" className="bg-cyan-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              Scan Now
            </Button>
          </div>
          <div className="space-y-3">
            {brokenLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-white">{link.url}</p>
                    <p className="text-xs text-slate-400">Found on: {link.source} • {link.discovered}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-500/20 text-red-400">{link.status}</Badge>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                      Fix
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalSEOPanel;
