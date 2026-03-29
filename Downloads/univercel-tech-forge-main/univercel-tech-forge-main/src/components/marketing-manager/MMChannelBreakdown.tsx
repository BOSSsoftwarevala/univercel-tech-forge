import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Share2, 
  Search, 
  Facebook, 
  Mail, 
  Globe,
  Lock,
  ExternalLink
} from "lucide-react";
import type { MarketingManagerSystem } from "@/hooks/useMarketingManagerSystem";

interface MMChannelBreakdownProps {
  system: MarketingManagerSystem;
}

const MMChannelBreakdown = ({ system }: MMChannelBreakdownProps) => {
  const channels = system.dashboard?.channels || [];
  const totalLeads = channels.reduce((sum, channel) => sum + channel.leads, 0) || 1;

  const getIcon = (name: string) => {
    if (name.includes("google")) return <Search className="h-4 w-4" />;
    if (name.includes("meta") || name.includes("facebook")) return <Facebook className="h-4 w-4" />;
    if (name.includes("email")) return <Mail className="h-4 w-4" />;
    if (name.includes("seo")) return <Globe className="h-4 w-4" />;
    return <Share2 className="h-4 w-4" />;
  };

  const getStatusBadge = (status: Channel["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Connected</Badge>;
      case "limited":
        return <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Limited</Badge>;
      case "read-only":
        return <Badge className="bg-slate-500/20 text-slate-400 text-[10px]">Read-Only</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Share2 className="h-5 w-5 text-purple-400" />
            Channel Breakdown
          </CardTitle>
          <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
            <Lock className="h-3 w-3 mr-1" />
            Read-Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {channels.map((channel, index) => {
          const status = channel.spend > 0 ? "connected" : "read-only";
          const costPerLead = channel.leads > 0 ? channel.spend / channel.leads : 0;

          return (
          <motion.div
            key={channel.channel}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-slate-700/50 text-slate-300">
                  {getIcon(channel.channel.toLowerCase())}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{channel.channel}</p>
                  <div className="flex items-center gap-1">
                    {getStatusBadge(status)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-100">{channel.leads}</p>
                <p className="text-xs text-slate-400">leads</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Share of Total</span>
                <span className="text-slate-300">
                  {((channel.leads / totalLeads) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(channel.leads / totalLeads) * 100} 
                className="h-1.5"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700/50">
              <div className="text-center">
                <p className="text-xs text-slate-400">CTR</p>
                <p className="text-sm font-medium text-slate-200">{channel.ctr.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Spend</p>
                <p className="text-sm font-medium text-slate-200">
                  ${(channel.spend / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">CPL</p>
                <p className="text-sm font-medium text-slate-200">
                  ${costPerLead.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        )})}

        {/* Security Notices */}
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400">
              🔒 API keys are NOT visible. No billing access available.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
            <p className="text-xs text-blue-400 flex-1">
              SEO data is read-only link access
            </p>
            <ExternalLink className="h-3 w-3 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMChannelBreakdown;
