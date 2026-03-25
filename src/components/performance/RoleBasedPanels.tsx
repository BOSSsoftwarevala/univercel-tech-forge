import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  TrendingUp, 
  Users, 
  Building2, 
  Megaphone, 
  HeadphonesIcon,
  Search,
  Heart,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface RoleBasedPanelsProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const roles = [
  { id: "developer", label: "Developer", icon: Code, color: "cyan" },
  { id: "sales", label: "Sales", icon: TrendingUp, color: "emerald" },
  { id: "reseller", label: "Reseller", icon: Users, color: "violet" },
  { id: "franchise", label: "Franchise", icon: Building2, color: "amber" },
  { id: "influencer", label: "Influencer", icon: Megaphone, color: "rose" },
  { id: "support", label: "Support", icon: HeadphonesIcon, color: "blue" },
  { id: "seo", label: "SEO", icon: Search, color: "orange" },
  { id: "client-success", label: "Client Success", icon: Heart, color: "pink" },
];

const roleKPIs = {
  developer: [
    { label: "Delivery Time", value: 94, target: 90, unit: "%" },
    { label: "Rework Rate", value: 8, target: 10, unit: "%" },
    { label: "Bug Density", value: 2.3, target: 3, unit: "/KLOC" },
    { label: "Chat Professionalism", value: 4.7, target: 4.5, unit: "/5" },
    { label: "Task Complexity", value: 847, target: 800, unit: "pts" },
  ],
  sales: [
    { label: "Lead Followup Speed", value: 2.4, target: 3, unit: "hrs" },
    { label: "Close Rate", value: 32, target: 28, unit: "%" },
    { label: "Client Sentiment", value: 4.6, target: 4.2, unit: "/5" },
    { label: "Upsell Probability", value: 24, target: 20, unit: "%" },
    { label: "Revenue Generated", value: 127, target: 100, unit: "K" },
  ],
  reseller: [
    { label: "Shared Leads", value: 156, target: 120, unit: "" },
    { label: "Conversion Rate", value: 28, target: 25, unit: "%" },
    { label: "Click-to-Order", value: 4.2, target: 5, unit: "%" },
    { label: "Fraud Score", value: 98, target: 95, unit: "%" },
    { label: "Commission Earned", value: 34, target: 25, unit: "K" },
  ],
  franchise: [
    { label: "Region Growth", value: 18, target: 15, unit: "%" },
    { label: "Payment Reliability", value: 99, target: 98, unit: "%" },
    { label: "Churn Reduction", value: 23, target: 20, unit: "%" },
    { label: "Revenue/Month", value: 245, target: 200, unit: "K" },
    { label: "Team Efficiency", value: 87, target: 85, unit: "%" },
  ],
  influencer: [
    { label: "Total Clicks", value: 45600, target: 40000, unit: "" },
    { label: "Conversion Rate", value: 3.8, target: 3, unit: "%" },
    { label: "Traffic Legitimacy", value: 94, target: 90, unit: "%" },
    { label: "Engagement Quality", value: 4.3, target: 4, unit: "/5" },
    { label: "Revenue Impact", value: 89, target: 75, unit: "K" },
  ],
  support: [
    { label: "Response Time", value: 1.8, target: 2, unit: "min" },
    { label: "Resolution Rate", value: 94, target: 90, unit: "%" },
    { label: "Tone Score", value: 4.5, target: 4.2, unit: "/5" },
    { label: "Tickets Reopened", value: 3, target: 5, unit: "%" },
    { label: "Satisfaction", value: 4.6, target: 4.3, unit: "/5" },
  ],
  seo: [
    { label: "Ranking Gain", value: 47, target: 40, unit: "pos" },
    { label: "CTR Improvement", value: 34, target: 25, unit: "%" },
    { label: "Keyword Health", value: 89, target: 85, unit: "%" },
    { label: "Region Performance", value: 92, target: 88, unit: "%" },
    { label: "Organic Traffic", value: 156, target: 130, unit: "K" },
  ],
  "client-success": [
    { label: "Risks Prevented", value: 12, target: 8, unit: "" },
    { label: "Onboarding Score", value: 94, target: 90, unit: "%" },
    { label: "Complaint Reduction", value: 45, target: 35, unit: "%" },
    { label: "Retention Rate", value: 97, target: 95, unit: "%" },
    { label: "NPS Impact", value: 18, target: 15, unit: "pts" },
  ],
};

export const RoleBasedPanels = ({ selectedRole, onRoleChange }: RoleBasedPanelsProps) => {
  const [activeRole, setActiveRole] = useState("developer");

  const currentKPIs = roleKPIs[activeRole as keyof typeof roleKPIs] || roleKPIs.developer;
  const currentRoleInfo = roles.find(r => r.id === activeRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Role-Based KPI Panels
        </h2>
        <p className="text-slate-400 text-sm mt-1">Detailed performance metrics by role — All data system-generated</p>
      </div>

      {/* Role Selector */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;
          
          return (
            <motion.button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                isActive 
                  ? `bg-gradient-to-r from-${role.color}-500/20 to-${role.color}-600/20 text-white border border-${role.color}-500/50` 
                  : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              {role.label}
            </motion.button>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {currentKPIs.map((kpi, index) => {
          const isAboveTarget = kpi.value >= kpi.target;
          const percentage = Math.min((kpi.value / kpi.target) * 100, 100);
          
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-400">{kpi.label}</p>
                  <Badge className={isAboveTarget ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}>
                    {isAboveTarget ? "Above" : "Below"}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <motion.p 
                    className={`text-2xl font-bold ${isAboveTarget ? "text-emerald-400" : "text-amber-400"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {kpi.value}{kpi.unit}
                  </motion.p>
                  <p className="text-xs text-slate-500">Target: {kpi.target}{kpi.unit}</p>
                </div>

                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${isAboveTarget ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-gradient-to-r from-amber-500 to-orange-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Scoring Engine Info */}
      <Card className="p-5 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-cyan-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/20">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">AI Scoring Engine</h3>
            <p className="text-sm text-slate-300 mb-3">
              Weighted metrics with historical comparison. No manual overrides allowed. 
              Penalties applied for delays, bonuses for excellence.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-cyan-400">✓ Weighted metrics</span>
              <span className="text-cyan-400">✓ No manual overrides</span>
              <span className="text-cyan-400">✓ Historical comparison</span>
              <span className="text-emerald-400">✓ Auto penalty/bonus</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
