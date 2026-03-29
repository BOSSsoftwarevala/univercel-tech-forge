import { motion } from "framer-motion";
import { 
  Link2, Eye, AlertTriangle, CheckCircle, ExternalLink,
  TrendingUp, RefreshCw, Globe, Zap, MousePointer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DemoSEOIntegration = () => {
  const demoPages = [
    {
      name: "POS Demo",
      url: "/demo/pos",
      metaStatus: "complete",
      indexed: true,
      clicks: 1234,
      impressions: 8900,
      avgPosition: 4.2,
      ctr: 13.8,
      lastChecked: "2 hours ago",
    },
    {
      name: "School Management Demo",
      url: "/demo/school",
      metaStatus: "complete",
      indexed: true,
      clicks: 987,
      impressions: 6700,
      avgPosition: 5.8,
      ctr: 14.7,
      lastChecked: "2 hours ago",
    },
    {
      name: "Hospital ERP Demo",
      url: "/demo/hospital",
      metaStatus: "missing",
      indexed: false,
      clicks: 234,
      impressions: 1200,
      avgPosition: 18.5,
      ctr: 19.5,
      lastChecked: "2 hours ago",
    },
    {
      name: "Inventory Demo",
      url: "/demo/inventory",
      metaStatus: "incomplete",
      indexed: true,
      clicks: 567,
      impressions: 3400,
      avgPosition: 8.3,
      ctr: 16.7,
      lastChecked: "2 hours ago",
    },
  ];

  const demoInsights = {
    totalClicks: 3022,
    totalImpressions: 20200,
    avgCtr: 14.9,
    conversionToLead: 8.3,
  };

  const missingMetaAlerts = [
    { page: "Hospital ERP Demo", issue: "No meta description", priority: "high" },
    { page: "Inventory Demo", issue: "Title too short (23 chars)", priority: "medium" },
    { page: "CRM Demo", issue: "Missing og:image", priority: "low" },
  ];

  const brokenDemoWarnings = [
    { demo: "Legacy POS Demo", url: "/demo/pos-v1", status: "redirect", lastWorking: "3 days ago" },
    { demo: "Old School Demo", url: "/demo/school-old", status: "maintenance", lastWorking: "1 week ago" },
  ];

  const getMetaStatusStyle = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-500/20 text-green-400";
      case "incomplete": return "bg-yellow-500/20 text-yellow-400";
      case "missing": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-400" />
            Demo SEO Integration
          </h2>
          <p className="text-slate-400">Track and optimize demo page visibility</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync All Demos
        </Button>
      </div>

      {/* Demo Insights */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Demo Clicks", value: demoInsights.totalClicks.toLocaleString(), icon: MousePointer, color: "text-cyan-400" },
          { label: "Impressions", value: demoInsights.totalImpressions.toLocaleString(), icon: Eye, color: "text-blue-400" },
          { label: "Avg CTR", value: `${demoInsights.avgCtr}%`, icon: TrendingUp, color: "text-green-400" },
          { label: "Demo → Lead", value: `${demoInsights.conversionToLead}%`, icon: Zap, color: "text-purple-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts Section */}
      {(missingMetaAlerts.length > 0 || brokenDemoWarnings.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {/* Missing Meta Alerts */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Missing Meta Alerts
            </h4>
            <div className="space-y-2">
              {missingMetaAlerts.map((alert, index) => (
                <div key={index} className="p-2 bg-slate-900/50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{alert.page}</p>
                    <p className="text-xs text-slate-400">{alert.issue}</p>
                  </div>
                  <Badge className={
                    alert.priority === "high" ? "bg-red-500/20 text-red-400" :
                    alert.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-slate-500/20 text-slate-400"
                  }>
                    {alert.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Broken Demo Warnings */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Broken Demo Warnings
            </h4>
            <div className="space-y-2">
              {brokenDemoWarnings.map((warning, index) => (
                <div key={index} className="p-2 bg-slate-900/50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{warning.demo}</p>
                    <p className="text-xs text-slate-400">{warning.url}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500/20 text-red-400">{warning.status}</Badge>
                    <p className="text-xs text-slate-500 mt-1">Last OK: {warning.lastWorking}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Demo Pages Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Demo Page Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-xs text-slate-400">Demo Page</th>
                <th className="text-center p-4 text-xs text-slate-400">Meta Status</th>
                <th className="text-center p-4 text-xs text-slate-400">Indexed</th>
                <th className="text-center p-4 text-xs text-slate-400">Clicks</th>
                <th className="text-center p-4 text-xs text-slate-400">Impressions</th>
                <th className="text-center p-4 text-xs text-slate-400">Position</th>
                <th className="text-center p-4 text-xs text-slate-400">CTR</th>
                <th className="text-center p-4 text-xs text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {demoPages.map((demo, index) => (
                <motion.tr
                  key={demo.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-sm text-white">{demo.name}</p>
                        <p className="text-xs text-slate-500">{demo.url}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Badge className={getMetaStatusStyle(demo.metaStatus)}>
                      {demo.metaStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    {demo.indexed ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-center text-sm text-white">{demo.clicks.toLocaleString()}</td>
                  <td className="p-4 text-center text-sm text-slate-300">{demo.impressions.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`text-sm font-medium ${
                      demo.avgPosition <= 5 ? "text-green-400" :
                      demo.avgPosition <= 10 ? "text-cyan-400" : "text-yellow-400"
                    }`}>
                      #{demo.avgPosition}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm text-cyan-400">{demo.ctr}%</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
        <h4 className="font-semibold text-cyan-400 mb-3">Demo SEO Best Practices</h4>
        <div className="grid grid-cols-4 gap-3">
          {[
            "Unique meta for each demo",
            "Track demo-to-lead conversion",
            "Add schema markup for demos",
            "Monitor demo page speed",
          ].map((tip, index) => (
            <div key={index} className="p-3 bg-slate-900/50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-cyan-400 mb-2" />
              <p className="text-sm text-white">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoSEOIntegration;
