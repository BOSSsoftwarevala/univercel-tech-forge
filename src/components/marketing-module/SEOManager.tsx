import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Globe2, FileText, Zap, CheckCircle2, 
  AlertTriangle, XCircle, RefreshCw, ExternalLink,
  TrendingUp, BarChart3, FileCode, Eye
} from "lucide-react";
import { toast } from "sonner";

const seoAudits = [
  { 
    page: "/products/erp-software", 
    score: 92, 
    status: "excellent",
    issues: 0,
    lastAudit: "2 hours ago"
  },
  { 
    page: "/franchise/apply", 
    score: 78, 
    status: "good",
    issues: 3,
    lastAudit: "1 day ago"
  },
  { 
    page: "/demo/school-management", 
    score: 65, 
    status: "needs-work",
    issues: 7,
    lastAudit: "3 days ago"
  },
  { 
    page: "/pricing", 
    score: 85, 
    status: "good",
    issues: 2,
    lastAudit: "5 hours ago"
  },
];

const rankTracking = [
  { keyword: "school erp software india", position: 3, change: "+2", volume: 12400 },
  { keyword: "franchise management system", position: 7, change: "+5", volume: 8900 },
  { keyword: "pos software africa", position: 12, change: "-1", volume: 5600 },
  { keyword: "erp software middle east", position: 5, change: "+3", volume: 4200 },
];

const seoActions = [
  { label: "Meta/Schema Generator", icon: FileCode, action: "generate-meta" },
  { label: "Blog Generator", icon: FileText, action: "generate-blog" },
  { label: "Landing Page AI", icon: Eye, action: "generate-landing" },
];

export const SEOManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanUrl, setScanUrl] = useState("");

  const handleRunScan = () => {
    if (!scanUrl) {
      toast.error("Enter a URL to scan");
      return;
    }
    setIsScanning(true);
    toast.info("SEO Scan started...");
    setTimeout(() => {
      setIsScanning(false);
      toast.success("SEO Scan complete!");
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "good": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "needs-work": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SEO Manager</h1>
          <p className="text-muted-foreground">Auto SEO audits, meta generation & rank tracking</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* URL Scanner */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter URL to scan (e.g., /products/erp)"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Button 
              onClick={handleRunScan}
              disabled={isScanning}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Run SEO Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seoActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-emerald-500/50 transition-colors"
                onClick={() => toast.info(`${action.label} - Coming soon!`)}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground">AI Auto-Generate</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Audits */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              Page SEO Audits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seoAudits.map((audit) => (
                <div 
                  key={audit.page}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{audit.page}</p>
                    <p className="text-xs text-muted-foreground">Last: {audit.lastAudit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className={`text-lg font-bold ${getScoreColor(audit.score)}`}>
                        {audit.score}
                      </p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <Badge className={getStatusColor(audit.status)}>
                      {audit.issues === 0 ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : audit.issues < 5 ? (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {audit.issues} issues
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-emerald-400">
                      Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rank Tracking */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Keyword Rank Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankTracking.map((keyword) => (
                <div 
                  key={keyword.keyword}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{keyword.keyword}</p>
                    <p className="text-xs text-muted-foreground">{keyword.volume.toLocaleString()} searches/mo</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">#{keyword.position}</p>
                      <p className="text-xs text-muted-foreground">Position</p>
                    </div>
                    <Badge className={
                      keyword.change.startsWith("+") 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    }>
                      {keyword.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
