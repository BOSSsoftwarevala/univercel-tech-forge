import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Smartphone, 
  Globe,
  Link2,
  AlertTriangle,
  Flag,
  Clock,
  Server
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TechnicalAlert {
  id: string;
  type: "page_speed" | "mobile" | "indexing" | "broken_link";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  affectedUrl: string;
  flagged: boolean;
  flaggedAt?: string;
}

const mockAlerts: TechnicalAlert[] = [
  {
    id: "tech-001",
    type: "page_speed",
    severity: "critical",
    title: "Slow Page Load Time",
    description: "LCP exceeds 4 seconds. Core Web Vitals failing.",
    affectedUrl: "/products/enterprise",
    flagged: false,
  },
  {
    id: "tech-002",
    type: "mobile",
    severity: "warning",
    title: "Mobile Usability Issue",
    description: "Text too small to read on mobile viewport.",
    affectedUrl: "/blog/case-study-1",
    flagged: true,
    flaggedAt: "2024-01-18",
  },
  {
    id: "tech-003",
    type: "indexing",
    severity: "critical",
    title: "Indexing Error",
    description: "Page blocked by robots.txt but in sitemap.",
    affectedUrl: "/admin/settings",
    flagged: false,
  },
  {
    id: "tech-004",
    type: "broken_link",
    severity: "warning",
    title: "Internal Link Update Needed",
    description: "Link destination requires content update.",
    affectedUrl: "/old-pricing",
    flagged: true,
    flaggedAt: "2024-01-15",
  },
];

const SEOTechnicalAlerts = () => {
  const [alerts, setAlerts] = useState<TechnicalAlert[]>(mockAlerts);

  const getTypeIcon = (type: TechnicalAlert["type"]) => {
    switch (type) {
      case "page_speed": return <Zap className="h-4 w-4" />;
      case "mobile": return <Smartphone className="h-4 w-4" />;
      case "indexing": return <Globe className="h-4 w-4" />;
      case "broken_link": return <Link2 className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: TechnicalAlert["severity"]) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warning": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "info": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const handleFlag = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, flagged: true, flaggedAt: new Date().toISOString().split('T')[0] } : a
    ));
    toast({
      title: "Issue Flagged",
      description: "Flagged for Server Manager. SEO cannot fix infra issues.",
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Zap className="h-5 w-5 text-amber-400" />
            Technical SEO Alerts
          </CardTitle>
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {alerts.filter(a => a.severity === "critical").length} Critical
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              alert.flagged 
                ? "bg-slate-800/30 border-slate-700/30" 
                : "bg-slate-800/50 border-slate-700/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                {getTypeIcon(alert.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-slate-100">{alert.title}</h4>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{alert.description}</p>
                <p className="text-xs text-slate-500 font-mono">{alert.affectedUrl}</p>
                
                {alert.flagged ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Flag className="h-3 w-3 mr-1" />
                      Flagged for Server Manager
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.flaggedAt}
                    </span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs mt-2 text-purple-400 hover:text-purple-300"
                    onClick={() => handleFlag(alert.id)}
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    Flag for Server Manager
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Infra Notice */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-start gap-2">
          <Server className="h-4 w-4 text-purple-400 mt-0.5" />
          <div>
            <p className="text-xs text-purple-400 font-medium">Infrastructure Separation</p>
            <p className="text-xs text-purple-400/70">
              SEO can FLAG only. Server Manager handles infrastructure fixes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOTechnicalAlerts;
