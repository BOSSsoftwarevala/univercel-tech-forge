import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Plus, 
  MapPin, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileSignature
} from "lucide-react";

const FranchiseAgreements = () => {
  const agreements = [
    { id: "FRA-001", name: "Mumbai Metro Franchise", territory: "Mumbai, Maharashtra", status: "active", compliance: 96, startDate: "Jan 2024", endDate: "Jan 2029", revenue: "₹45L" },
    { id: "FRA-002", name: "Delhi NCR Franchise", territory: "Delhi NCR", status: "active", compliance: 92, startDate: "Mar 2024", endDate: "Mar 2029", revenue: "₹38L" },
    { id: "FRA-003", name: "Bangalore Tech Hub", territory: "Bangalore Urban", status: "pending", compliance: 0, startDate: "Pending", endDate: "Pending", revenue: "-" },
    { id: "FRA-004", name: "Chennai Franchise", territory: "Chennai Metro", status: "dispute", compliance: 78, startDate: "Jun 2023", endDate: "Jun 2028", revenue: "₹28L" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "dispute":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40"><AlertTriangle className="w-3 h-3 mr-1" />Dispute</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Franchise & Reseller Agreements</h2>
          <p className="text-stone-500">Manage franchise partner contracts and compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
            <FileSignature className="w-4 h-4 mr-2" />
            Bulk Sign Request
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Franchise Agreement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Franchises", value: "24", icon: Building2, color: "text-emerald-400" },
          { label: "Pending Approval", value: "6", icon: Clock, color: "text-amber-400" },
          { label: "Active Disputes", value: "2", icon: AlertTriangle, color: "text-red-400" },
          { label: "Avg Compliance", value: "89%", icon: TrendingUp, color: "text-blue-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-stone-800/50 flex items-center justify-center">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-stone-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agreements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agreements.map((agreement, index) => (
          <motion.div
            key={agreement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50 hover:border-amber-600/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{agreement.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-stone-500" />
                        <span className="text-sm text-stone-500">{agreement.territory}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(agreement.status)}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-stone-500">Start Date</p>
                    <p className="text-sm text-stone-300">{agreement.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">End Date</p>
                    <p className="text-sm text-stone-300">{agreement.endDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Revenue</p>
                    <p className="text-sm text-amber-400 font-medium">{agreement.revenue}</p>
                  </div>
                </div>

                {agreement.status !== "pending" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-stone-500">Compliance Score</span>
                      <span className={`text-sm font-medium ${
                        agreement.compliance >= 90 ? "text-emerald-400" :
                        agreement.compliance >= 80 ? "text-amber-400" :
                        "text-red-400"
                      }`}>{agreement.compliance}%</span>
                    </div>
                    <Progress 
                      value={agreement.compliance} 
                      className="h-2 bg-stone-700"
                    />
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-stone-700 text-stone-300 hover:bg-stone-800">
                    View Details
                  </Button>
                  {agreement.status === "dispute" && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Resolve Dispute
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FranchiseAgreements;
