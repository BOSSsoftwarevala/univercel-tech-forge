import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, Bell } from "lucide-react";

const LegalOverview = () => {
  const stats = [
    { label: "Compliance Health Score", value: "94/100", icon: Shield, trend: "All regions compliant", color: "text-emerald-400" },
    { label: "Open Legal Requests", value: "7", icon: FileText, trend: "3 high priority", color: "text-amber-400" },
    { label: "Active Disputes", value: "2", icon: AlertTriangle, trend: "1 pending resolution", color: "text-red-400" },
    { label: "Policy Update Alerts", value: "4", icon: Bell, trend: "GDPR update pending", color: "text-blue-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-amber-400">Regional Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: "Europe (GDPR)", status: "Compliant", color: "text-emerald-400" },
                { region: "USA (CCPA)", status: "Compliant", color: "text-emerald-400" },
                { region: "India (DPDP)", status: "Review Pending", color: "text-yellow-400" },
                { region: "Middle East", status: "Compliant", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.region} className="flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="text-slate-300">{item.region}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-amber-400">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { alert: "GDPR Article 17 update required", time: "2 hours ago" },
                { alert: "Trademark renewal due (EU)", time: "1 day ago" },
                { alert: "New compliance checklist available", time: "2 days ago" },
                { alert: "Contract expiry warning: Vendor-A", time: "3 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="text-white text-sm">{item.alert}</span>
                  <span className="text-slate-500 text-xs">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default LegalOverview;
