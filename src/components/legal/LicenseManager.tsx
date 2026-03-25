import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Key, 
  Plus, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Copy,
  Power,
  AlertTriangle
} from "lucide-react";

const LicenseManager = () => {
  const licenses = [
    { id: "LIC-001", key: "SVALA-XXXX-XXXX-1234", client: "Enterprise Corp", type: "Lifetime", status: "active", domain: "enterprise.com", activations: "3/5", expires: "Never" },
    { id: "LIC-002", key: "SVALA-XXXX-XXXX-5678", client: "TechStart Inc", type: "Annual", status: "active", domain: "techstart.io", activations: "2/3", expires: "Dec 2025" },
    { id: "LIC-003", key: "SVALA-XXXX-XXXX-9012", client: "Global Solutions", type: "Lifetime", status: "suspended", domain: "globalsol.net", activations: "5/5", expires: "Suspended" },
    { id: "LIC-004", key: "SVALA-XXXX-XXXX-3456", client: "SME Partner", type: "Annual", status: "expired", domain: "smepartner.com", activations: "1/2", expires: "Expired" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "suspended":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      case "expired":
        return <Badge className="bg-stone-500/20 text-stone-400 border-stone-500/40"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">License Validation & Key Management</h2>
          <p className="text-stone-500">Manage software licenses and prevent piracy</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Keys
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Generate License
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Licenses", value: "234", icon: Key, color: "text-amber-400" },
          { label: "Active", value: "189", icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Suspended", value: "12", icon: XCircle, color: "text-red-400" },
          { label: "Expiring Soon", value: "23", icon: Clock, color: "text-blue-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4"
      >
        <AlertTriangle className="w-6 h-6 text-amber-400" />
        <div className="flex-1">
          <p className="text-amber-300 font-medium">Piracy Alert</p>
          <p className="text-sm text-stone-400">Suspicious activation attempt detected from unauthorized domain. License LIC-003 has been suspended.</p>
        </div>
        <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
          Review
        </Button>
      </motion.div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <Input
            placeholder="Search by license key, client, or domain..."
            className="pl-10 bg-stone-800/50 border-stone-700/50 text-stone-200"
          />
        </div>
      </div>

      {/* License Table */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th className="text-left p-4 text-stone-500 font-medium text-sm">License ID</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Key</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Client</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Domain</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Type</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Activations</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Status</th>
                <th className="text-right p-4 text-stone-500 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license, index) => (
                <motion.tr
                  key={license.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-stone-800/30 hover:bg-stone-800/30 transition-colors"
                >
                  <td className="p-4 text-stone-400 font-mono text-sm">{license.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <code className="text-amber-400 text-sm">{license.key}</code>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-stone-500 hover:text-amber-400">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">{license.client}</td>
                  <td className="p-4 text-stone-400 font-mono text-sm">{license.domain}</td>
                  <td className="p-4">
                    <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50">
                      {license.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-stone-300">{license.activations}</td>
                  <td className="p-4">{getStatusBadge(license.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {license.status === "active" && (
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Power className="w-4 h-4" />
                        </Button>
                      )}
                      {license.status === "suspended" && (
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseManager;
