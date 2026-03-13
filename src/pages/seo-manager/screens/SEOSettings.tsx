import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings, Globe, Bell, Clock, Shield, Database, Zap, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const SEOSettings = () => {
  const [settings, setSettings] = useState({
    autoAuditFrequency: "daily",
    rankCheckFrequency: "6h",
    backlinkScanFrequency: "daily",
    alertOnRankDrop: true,
    alertOnNewBacklink: true,
    alertOnToxicLink: true,
    alertOnCrawlError: true,
    autoMetaGeneration: true,
    autoInternalLinking: true,
    autoSchemaMarkup: false,
    targetRegions: ["US", "UK", "IN", "DE", "CA"],
    searchEngines: ["Google", "Bing", "Yahoo"],
    mobileFirst: true,
    coreWebVitals: true,
  });

  const handleSave = () => {
    toast.success("SEO settings saved successfully");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">SEO Settings</h2>
        <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Settings */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Zap className="h-5 w-5" /> Automation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "autoMetaGeneration", label: "Auto Meta Tag Generation", desc: "AI generates meta tags for new pages" },
              { key: "autoInternalLinking", label: "Auto Internal Linking", desc: "AI creates contextual internal links" },
              { key: "autoSchemaMarkup", label: "Auto Schema Markup", desc: "Auto-generate JSON-LD structured data" },
              { key: "mobileFirst", label: "Mobile-First Indexing", desc: "Prioritize mobile version for crawling" },
              { key: "coreWebVitals", label: "Core Web Vitals Monitoring", desc: "Track LCP, FID, CLS metrics" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Switch checked={(settings as any)[item.key]}
                  onCheckedChange={(val) => setSettings(prev => ({ ...prev, [item.key]: val }))} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Bell className="h-5 w-5" /> Alert Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "alertOnRankDrop", label: "Rank Drop Alert", desc: "Alert when keyword drops 5+ positions" },
              { key: "alertOnNewBacklink", label: "New Backlink Alert", desc: "Alert on new backlink discovery" },
              { key: "alertOnToxicLink", label: "Toxic Link Alert", desc: "Alert on toxic backlink detection" },
              { key: "alertOnCrawlError", label: "Crawl Error Alert", desc: "Alert on new crawl errors" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Switch checked={(settings as any)[item.key]}
                  onCheckedChange={(val) => setSettings(prev => ({ ...prev, [item.key]: val }))} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Frequency Settings */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Clock className="h-5 w-5" /> Scan Frequency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Site Audit", value: settings.autoAuditFrequency, options: ["hourly", "daily", "weekly"] },
              { label: "Rank Checking", value: settings.rankCheckFrequency, options: ["1h", "6h", "12h", "24h"] },
              { label: "Backlink Scan", value: settings.backlinkScanFrequency, options: ["daily", "weekly", "monthly"] },
            ].map(item => (
              <div key={item.label} className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-white font-medium mb-2">{item.label}</p>
                <div className="flex gap-2">
                  {item.options.map(opt => (
                    <Button key={opt} size="sm" variant={item.value === opt ? "default" : "outline"}
                      className={item.value === opt ? "bg-cyan-600 text-white" : "border-slate-700 text-slate-400"}
                      onClick={() => toast.info(`${item.label} frequency set to ${opt}`)}>
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Target Regions */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base flex items-center gap-2"><Globe className="h-5 w-5" /> Target Regions & Engines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-white font-medium mb-2">Target Regions</p>
              <div className="flex flex-wrap gap-2">
                {settings.targetRegions.map(r => (
                  <Badge key={r} className="bg-cyan-500/20 text-cyan-400">{r}</Badge>
                ))}
                <Button size="sm" variant="ghost" className="h-6 text-xs text-slate-400" onClick={() => toast.info("Add region")}>+ Add</Button>
              </div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-white font-medium mb-2">Search Engines</p>
              <div className="flex flex-wrap gap-2">
                {settings.searchEngines.map(e => (
                  <Badge key={e} className="bg-emerald-500/20 text-emerald-400">{e}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SEOSettings;
