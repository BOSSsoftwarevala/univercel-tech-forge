import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Link2, TrendingUp, Target, Globe2,
  Search, Megaphone, Users, Zap, ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const attributionData = [
  { 
    source: "Organic SEO",
    icon: Search,
    leads: 156,
    percentage: 38,
    topKeyword: "school erp software",
    topCountry: "India",
    conversionRate: 4.2
  },
  { 
    source: "Google Ads",
    icon: Megaphone,
    leads: 89,
    percentage: 22,
    topCampaign: "ERP India Q1",
    topCountry: "India",
    conversionRate: 3.8
  },
  { 
    source: "Meta Ads",
    icon: Megaphone,
    leads: 67,
    percentage: 16,
    topCampaign: "Franchise Africa",
    topCountry: "Nigeria",
    conversionRate: 3.5
  },
  { 
    source: "Influencer",
    icon: Users,
    leads: 45,
    percentage: 11,
    topInfluencer: "TechIndia",
    topCountry: "India",
    conversionRate: 5.2
  },
  { 
    source: "Direct",
    icon: Globe2,
    leads: 53,
    percentage: 13,
    topPage: "/products/erp",
    topCountry: "UAE",
    conversionRate: 6.1
  },
];

const recentAttributions = [
  { id: 1, lead: "John Doe", source: "Google Ads", campaign: "ERP India Q1", keyword: "erp software", country: "India", time: "5 min ago" },
  { id: 2, lead: "Maria Santos", source: "Organic SEO", campaign: "-", keyword: "school management", country: "Brazil", time: "12 min ago" },
  { id: 3, lead: "Ahmed Hassan", source: "Meta Ads", campaign: "Franchise Africa", keyword: "-", country: "UAE", time: "25 min ago" },
  { id: 4, lead: "Sarah Chen", source: "Influencer", campaign: "TechIndia", keyword: "-", country: "India", time: "1 hour ago" },
];

export const LeadAttribution = () => {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Attribution</h1>
          <p className="text-muted-foreground">Track lead sources, campaigns & keywords</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attribution Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributionData.map((source, index) => {
          const Icon = source.icon;
          return (
            <motion.div
              key={source.source}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-emerald-500/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{source.source}</p>
                        <p className="text-xs text-muted-foreground">{source.percentage}% of leads</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {source.leads}
                    </Badge>
                  </div>

                  <Progress value={source.percentage} className="h-2 mb-4" />

                  <div className="space-y-2 text-sm">
                    {source.topKeyword && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Keyword</span>
                        <span className="text-foreground font-medium">{source.topKeyword}</span>
                      </div>
                    )}
                    {source.topCampaign && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Campaign</span>
                        <span className="text-foreground font-medium">{source.topCampaign}</span>
                      </div>
                    )}
                    {source.topInfluencer && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Influencer</span>
                        <span className="text-foreground font-medium">{source.topInfluencer}</span>
                      </div>
                    )}
                    {source.topPage && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Page</span>
                        <span className="text-foreground font-medium">{source.topPage}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Top Country</span>
                      <span className="text-foreground font-medium">{source.topCountry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conv. Rate</span>
                      <span className="text-emerald-400 font-medium">{source.conversionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Attributions */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-400" />
            Recent Lead Attributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttributions.map((attr) => (
              <div 
                key={attr.id}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400">
                      {attr.lead.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{attr.lead}</p>
                    <p className="text-xs text-muted-foreground">{attr.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-foreground">{attr.source}</p>
                    <p className="text-xs text-muted-foreground">Source</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">{attr.campaign}</p>
                    <p className="text-xs text-muted-foreground">Campaign</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">{attr.keyword || "-"}</p>
                    <p className="text-xs text-muted-foreground">Keyword</p>
                  </div>
                  <Badge variant="outline">
                    <Globe2 className="w-3 h-3 mr-1" />
                    {attr.country}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
