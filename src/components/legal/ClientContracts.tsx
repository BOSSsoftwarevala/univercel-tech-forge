import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  Download,
  Send,
  MoreVertical
} from "lucide-react";

const ClientContracts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const contracts = [
    { id: "CON-2024-001", client: "Enterprise Corp", type: "Service Agreement", value: "₹25,00,000", status: "active", signedDate: "Dec 1, 2024", expiry: "Dec 1, 2025" },
    { id: "CON-2024-002", client: "TechStart Inc", type: "Product License", value: "₹8,50,000", status: "pending", signedDate: "-", expiry: "Pending" },
    { id: "CON-2024-003", client: "Global Solutions", type: "Service Agreement", value: "₹45,00,000", status: "active", signedDate: "Nov 15, 2024", expiry: "Nov 15, 2026" },
    { id: "CON-2024-004", client: "SME Partner", type: "Annual Subscription", value: "₹2,40,000", status: "expired", signedDate: "Dec 1, 2023", expiry: "Dec 1, 2024" },
    { id: "CON-2024-005", client: "Innovation Labs", type: "Custom Development", value: "₹12,00,000", status: "review", signedDate: "-", expiry: "Pending" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      case "review":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40"><Eye className="w-3 h-3 mr-1" />In Review</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Contract Management</h2>
          <p className="text-stone-500">Track and manage all client agreements</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <Input
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-stone-800/50 border-stone-700/50 text-stone-200"
          />
        </div>
        <Button variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Contracts", value: "89", color: "text-emerald-400" },
          { label: "Pending Signature", value: "12", color: "text-amber-400" },
          { label: "In Review", value: "7", color: "text-blue-400" },
          { label: "Expiring Soon", value: "5", color: "text-red-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/50"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Contracts Table */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Contract ID</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Client</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Type</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Value</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Status</th>
                <th className="text-left p-4 text-stone-500 font-medium text-sm">Expiry</th>
                <th className="text-right p-4 text-stone-500 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-stone-800/30 hover:bg-stone-800/30 transition-colors"
                >
                  <td className="p-4 text-stone-300 font-mono text-sm">{contract.id}</td>
                  <td className="p-4 text-white font-medium">{contract.client}</td>
                  <td className="p-4 text-stone-400">{contract.type}</td>
                  <td className="p-4 text-amber-400 font-medium">{contract.value}</td>
                  <td className="p-4">{getStatusBadge(contract.status)}</td>
                  <td className="p-4 text-stone-400">{contract.expiry}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                        <Download className="w-4 h-4" />
                      </Button>
                      {contract.status === "pending" && (
                        <Button size="sm" variant="ghost" className="text-stone-400 hover:text-amber-400">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-stone-400 hover:text-stone-300">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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

export default ClientContracts;
