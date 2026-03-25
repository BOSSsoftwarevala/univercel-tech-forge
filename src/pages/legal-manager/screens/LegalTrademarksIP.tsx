import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Globe, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const LegalTrademarksIP = () => {
  const [trademarks] = useState([
    { id: "TM001", name: "Software Vala®", type: "Word Mark", regions: ["India", "USA", "EU"], status: "registered", expiry: "2028-03-15" },
    { id: "TM002", name: "SV Logo™", type: "Design Mark", regions: ["India", "USA"], status: "registered", expiry: "2027-08-22" },
    { id: "TM003", name: "PrimePath®", type: "Word Mark", regions: ["India"], status: "pending", expiry: "N/A" },
    { id: "TM004", name: "FranchiseConnect™", type: "Word Mark", regions: ["Global"], status: "registered", expiry: "2026-01-10" },
  ]);

  const [pendingApplications] = useState([
    { id: "APP001", name: "ResellerHub®", region: "EU", filed: "2025-04-15", status: "under_examination" },
    { id: "APP002", name: "LeadEngine™", region: "USA", filed: "2025-05-20", status: "published" },
  ]);

  const handleAddRecord = () => {
    toast.info("Trademark record addition submitted for approval");
  };

  const handleRenewRequest = (id: string) => {
    toast.info(`Renewal request for ${id} submitted for approval`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Trademarks & IP</h2>
        <Button onClick={handleAddRecord} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">Registered Trademarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trademarks.map((tm) => (
              <div key={tm.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tm.name}</h3>
                    <p className="text-slate-400 text-sm">{tm.type}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-300 text-sm">{tm.regions.join(", ")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={tm.status === "registered" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                      {tm.status}
                    </Badge>
                    {tm.expiry !== "N/A" && (
                      <div className="mt-2">
                        <p className="text-slate-500 text-xs">Expires</p>
                        <p className="text-slate-300 text-sm">{tm.expiry}</p>
                      </div>
                    )}
                  </div>
                </div>
                {tm.status === "registered" && (
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400" onClick={() => handleRenewRequest(tm.id)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renew Request
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-blue-400">Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <div key={app.id} className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div>
                  <h4 className="text-white font-medium">{app.name}</h4>
                  <p className="text-slate-400 text-sm">Filed: {app.filed} • Region: {app.region}</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400">{app.status.replace("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50 border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium">Expiry Alerts</h4>
              <p className="text-slate-400 text-sm mt-1">FranchiseConnect™ expires in 6 months. Consider initiating renewal process.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LegalTrademarksIP;
