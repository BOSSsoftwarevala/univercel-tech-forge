import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, Download, Calendar, Globe2,
  TrendingUp, TrendingDown, Target, Zap,
  FileText, Mail, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const reports = [
  { 
    id: 1,
    name: "Daily Summary",
    type: "daily",
    lastGenerated: "Today, 6:00 AM",
    status: "ready",
    metrics: { leads: 45, spend: 342, roi: 285 }
  },
  { 
    id: 2,
    name: "Weekly ROI Report",
    type: "weekly",
    lastGenerated: "Jan 12, 2025",
    status: "ready",
    metrics: { leads: 312, spend: 2890, roi: 312 }
  },
  { 
    id: 3,
    name: "Country Performance",
    type: "custom",
    lastGenerated: "Jan 10, 2025",
    status: "ready",
    metrics: { countries: 8, topCountry: "India", growth: 22 }
  },
  { 
    id: 4,
    name: "Campaign Health",
    type: "weekly",
    lastGenerated: "Jan 12, 2025",
    status: "generating",
    metrics: { campaigns: 12, active: 8, optimized: 6 }
  },
];

const countryPerformance = [
  { country: "India", leads: 145, spend: 1250, roi: 342, trend: "up" },
  { country: "Nigeria", leads: 67, spend: 560, roi: 298, trend: "up" },
  { country: "UAE", leads: 54, spend: 480, roi: 312, trend: "up" },
  { country: "Kenya", leads: 38, spend: 320, roi: 256, trend: "down" },
  { country: "South Africa", leads: 28, spend: 280, roi: 234, trend: "up" },
];

export const MarketingReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const handleDownload = (reportId: number) => {
    toast.success("Report download started");
  };

  const handleEmailReport = (reportId: number) => {
    toast.success("Report sent to your email");
  };

  const handleRefresh = (reportId: number) => {
    toast.info("Regenerating report...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing Reports</h1>
          <p className="text-muted-foreground">Daily, weekly & custom performance reports</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[150px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.lastGenerated}</p>
                    </div>
                  </div>
                  <Badge className={
                    report.status === "ready"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }>
                    {report.status === "generating" && (
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    )}
                    {report.status}
                  </Badge>
                </div>

                {/* Metrics Preview */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg bg-accent/30">
                  {report.metrics.leads !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{report.metrics.leads}</p>
                      <p className="text-xs text-muted-foreground">Leads</p>
                    </div>
                  )}
                  {report.metrics.spend !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-foreground">${report.metrics.spend}</p>
                      <p className="text-xs text-muted-foreground">Spend</p>
                    </div>
                  )}
                  {report.metrics.roi !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-emerald-400">{report.metrics.roi}%</p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  )}
                  {report.metrics.countries !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{report.metrics.countries}</p>
                      <p className="text-xs text-muted-foreground">Countries</p>
                    </div>
                  )}
                  {report.metrics.topCountry !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{report.metrics.topCountry}</p>
                      <p className="text-xs text-muted-foreground">Top</p>
                    </div>
                  )}
                  {report.metrics.growth !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-emerald-400">+{report.metrics.growth}%</p>
                      <p className="text-xs text-muted-foreground">Growth</p>
                    </div>
                  )}
                  {report.metrics.campaigns !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{report.metrics.campaigns}</p>
                      <p className="text-xs text-muted-foreground">Campaigns</p>
                    </div>
                  )}
                  {report.metrics.active !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{report.metrics.active}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  )}
                  {report.metrics.optimized !== undefined && (
                    <div className="text-center">
                      <p className="font-semibold text-emerald-400">{report.metrics.optimized}</p>
                      <p className="text-xs text-muted-foreground">Optimized</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(report.id)}
                    disabled={report.status !== "ready"}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEmailReport(report.id)}
                    disabled={report.status !== "ready"}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRefresh(report.id)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Country Performance Table */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            Country Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countryPerformance.map((country, index) => (
              <div 
                key={country.country}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{country.country}</p>
                    <p className="text-xs text-muted-foreground">{country.leads} leads generated</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">${country.spend}</p>
                    <p className="text-xs text-muted-foreground">Spend</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold flex items-center gap-1 ${
                      country.trend === "up" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {country.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {country.roi}%
                    </p>
                    <p className="text-xs text-muted-foreground">ROI</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
