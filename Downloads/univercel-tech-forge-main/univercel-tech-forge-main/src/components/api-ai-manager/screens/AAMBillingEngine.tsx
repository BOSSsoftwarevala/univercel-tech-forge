import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Receipt,
  Plug,
  Package,
  Users,
  Clock,
  FileText,
  Download,
  Eye,
  DollarSign,
  TrendingUp
} from "lucide-react";

interface AAMBillingEngineProps {
  activeSubSection: string;
}

const AAMBillingEngine = ({ activeSubSection }: AAMBillingEngineProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const billingStats = [
    { label: "Today's Billing", value: "₹4,520", change: "+12%", icon: <Clock className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { label: "This Week", value: "₹28,450", change: "+8%", icon: <Clock className="w-5 h-5" />, color: "from-purple-500 to-indigo-500" },
    { label: "This Month", value: "₹78,230", change: "+15%", icon: <Clock className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { label: "Pending Invoices", value: "3", change: "0", icon: <FileText className="w-5 h-5" />, color: "from-yellow-500 to-orange-500" },
  ];

  const apiBilling = [
    { name: "OpenAI GPT-4", requests: "45,230", cost: "₹12,450", percentage: 16 },
    { name: "WhatsApp Business", requests: "32,100", cost: "₹8,200", percentage: 10 },
    { name: "Razorpay", requests: "28,450", cost: "₹5,600", percentage: 7 },
    { name: "Google Maps", requests: "25,000", cost: "₹6,250", percentage: 8 },
    { name: "Vision AI", requests: "15,200", cost: "₹4,300", percentage: 5 },
    { name: "NLP / Chat AI", requests: "32,500", cost: "₹2,600", percentage: 3 },
  ];

  const productBilling = [
    { name: "CRM System", apis: 4, cost: "₹18,450", percentage: 24 },
    { name: "E-Commerce App", apis: 5, cost: "₹15,200", percentage: 19 },
    { name: "Analytics Dashboard", apis: 3, cost: "₹12,800", percentage: 16 },
    { name: "Mobile App", apis: 4, cost: "₹11,500", percentage: 15 },
    { name: "Support Portal", apis: 3, cost: "₹8,280", percentage: 11 },
  ];

  const roleBilling = [
    { name: "Admin", users: 12, cost: "₹25,400", percentage: 32 },
    { name: "Developer", users: 8, cost: "₹18,200", percentage: 23 },
    { name: "Reseller", users: 45, cost: "₹15,600", percentage: 20 },
    { name: "Franchise", users: 28, cost: "₹12,030", percentage: 15 },
    { name: "User", users: 1250, cost: "₹7,000", percentage: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing Engine</h1>
          <p className="text-slate-400 text-sm mt-1">Complete billing breakdown by API, product, and role</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("Export Billing Report")}
            className="border-white/20 text-slate-300 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction("Generate Invoice")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {billingStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Billing Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Per API Billing */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Plug className="w-5 h-5 text-purple-400" />
              Per API Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiBilling.map((api) => (
                <div
                  key={api.name}
                  className="p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{api.name}</p>
                    <p className="text-sm font-bold text-white">{api.cost}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${api.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{api.percentage}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{api.requests} requests</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              onClick={() => handleAction("View All API Billing")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardContent>
        </Card>

        {/* Per Product Billing */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Per Product Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productBilling.map((product) => (
                <div
                  key={product.name}
                  className="p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="text-sm font-bold text-white">{product.cost}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${product.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{product.percentage}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{product.apis} APIs connected</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              onClick={() => handleAction("View All Product Billing")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardContent>
        </Card>

        {/* Per Role Billing */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Per Role Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roleBilling.map((role) => (
                <div
                  key={role.name}
                  className="p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{role.name}</p>
                    <p className="text-sm font-bold text-white">{role.cost}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${role.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{role.percentage}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{role.users} users</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-green-400 hover:text-green-300 hover:bg-green-500/10"
              onClick={() => handleAction("View All Role Billing")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AAMBillingEngine;
