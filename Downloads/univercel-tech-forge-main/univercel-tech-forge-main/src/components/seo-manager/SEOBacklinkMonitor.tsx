import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Link2, 
  ExternalLink,
  AlertTriangle,
  Lock,
  Globe,
  Shield,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SEOManagerSystem } from "@/hooks/useSEOManagerSystem";

interface SEOBacklinkMonitorProps {
  system: SEOManagerSystem;
}

const SEOBacklinkMonitor = ({ system }: SEOBacklinkMonitorProps) => {
  const backlinks = system.dashboard?.backlinks || [];
  const backlinkStats = {
    total: backlinks.length,
    healthy: backlinks.filter((row) => row.status === "healthy").length,
    suspicious: backlinks.filter((row) => row.status === "suspicious").length,
    toxic: backlinks.filter((row) => row.status === "toxic").length,
    avgDA: backlinks.length === 0 ? 0 : Math.round(backlinks.reduce((sum, row) => sum + row.domain_authority, 0) / backlinks.length),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Healthy</Badge>;
      case "suspicious":
        return <Badge className="bg-amber-500/20 text-amber-400">Suspicious</Badge>;
      case "toxic":
        return <Badge className="bg-red-500/20 text-red-400">Toxic</Badge>;
      default:
        return null;
    }
  };

  const handleSuggestDisavow = (id: string) => {
    toast({
      title: "Disavow Suggested",
      description: "Suggestion logged. Auto-disavow is BLOCKED. Requires approval.",
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Link2 className="h-5 w-5 text-blue-400" />
            Backlink Monitor
          </CardTitle>
          <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
            <Lock className="h-3 w-3 mr-1" />
            Read-Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-2">
          <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
            <p className="text-lg font-bold text-slate-100">{backlinkStats.total}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-lg font-bold text-emerald-400">{backlinkStats.healthy}</p>
            <p className="text-xs text-emerald-400/70">Healthy</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-lg font-bold text-amber-400">{backlinkStats.suspicious}</p>
            <p className="text-xs text-amber-400/70">Suspicious</p>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-lg font-bold text-red-400">{backlinkStats.toxic}</p>
            <p className="text-xs text-red-400/70">Toxic</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-lg font-bold text-blue-400">{backlinkStats.avgDA}</p>
            <p className="text-xs text-blue-400/70">Avg DA</p>
          </div>
        </div>

        {/* Backlink List */}
        <div className="space-y-3">
          {backlinks.map((bl, index) => (
            <motion.div
              key={bl.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${
                bl.status === "toxic" 
                  ? "bg-red-500/10 border-red-500/20" 
                  : bl.status === "suspicious"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-slate-800/50 border-slate-700/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <span className="text-sm text-slate-200 font-mono">{bl.source_domain}</span>
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-400">→ {bl.target_url}</p>
                  <p className="text-xs text-slate-500">Anchor: "{bl.anchor_text}"</p>
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(bl.status)}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-blue-400">DA: {bl.domain_authority}</span>
                    <span className={bl.spam_score > 30 ? "text-red-400" : "text-slate-400"}>
                      Spam: {bl.spam_score}%
                    </span>
                  </div>
                </div>
              </div>

              {bl.disavow_suggested && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    AI suggests disavow
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs text-amber-400 hover:text-amber-300"
                    onClick={() => handleSuggestDisavow(bl.id)}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Suggest Disavow
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Auto-Disavow Blocked Notice */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400 font-medium">
            ⚠️ AUTO-DISAVOW IS BLOCKED. Suggestions require manual approval.
            AI spam detection is for flagging only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOBacklinkMonitor;
